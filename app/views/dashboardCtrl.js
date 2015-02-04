(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'DashboardCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$location', 'bootstrap.dialog', '$routeParams', '$scope', 'logger', '$resource', '$modal', 'signalRSvc', 'batchApproveService', dashboardCtrl]);

    function dashboardCtrl(common, config, datacontext, $location, bsDialog, $routeParams, $scope, logger, $resource, $modal, signalR, batchApproveService) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        //  var getLogFn = common.logger.getLogFn;
        //var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
        var transationStatuses = datacontext.transactionStatuses;
        var notification = common.notification;

        //JRB 12/29/2013
        vm.title = 'Transactions Dashboard';
        vm.billerTabActive = true;
        vm.billervm = new DashboardTransactionView(dashboardviewtypes.BILLER);
        vm.payorvm = new DashboardTransactionView(dashboardviewtypes.PAYOR);

        //YCR 03/09/2014    
        if (!$.isEmptyObject($routeParams.billerTabActive) && $routeParams.billerTabActive == 2) {
            vm.billerTabActive = !vm.billerTabActive;
        }
        //YCR 02/22/2014
        vm.billervm.selectedFilter = "Showing All transactions";
        vm.payorvm.selectedFilter = "Showing All transactions";

        var dashboardactiveviewmodels = [vm.billervm, vm.payorvm];

        //Methods
        vm.pageChanged = pageChanged;
        vm.refresh = refresh;
        vm.search = search;
        vm.payorRefreshTransactionSelection = payorRefreshTransactionSelection;
        vm.billerRefreshTransactionSelection = billerRefreshTransactionSelection;
        vm.payorSelectUnSelectAll = payorSelectUnSelectAll;
        vm.billerSelectUnSelectAll = billerSelectUnSelectAll;

        //YCR 07/05/2014
        vm.downloadFile = downloadFile;
        vm.removeDocument = removeDocument;
        vm.makePrivate = makePrivate;
        vm.makePublic = makePublic;

        vm.filterTransactionsByNumber = filterTransactionsByNumber;
        vm.filterTransactionsByStatus = filterTransactionsByStatus;

        vm.goToDispute = goToDispute;
        vm.clearFilter = clearFilter;
        vm.sorting = sorting;
        vm.sortFromMenu = sortFromMenu;
        //JRB 04/26/2014
        vm.getTransactionSectionId = getTransactionSectionId;
        vm.getLocalStorage = getLocalStorage;

        vm.showAttachments = showAttachments;
        vm.loadAttachment = loadAttachment;

        vm.makePayment = makePayment;

        vm.goToPayment = goToPayment;

        //JRB 01/25/2014
        vm.changeVisibleTab = changeVisibleTab;
        //JRB 01/26/2014
        vm.showSelectedTransactions = showSelectedTransactions;
        vm.setSelectedToVerified = setSelectedToVerified;
        vm.setSelectedToVerifiedAndApproved = setSelectedToVerifiedAndApproved;
        vm.setSelectedToApproved = setSelectedToApproved;
        //JRB 05/25/2014
        vm.setSelectedToDispute = setSelectedToDispute;
        //YCR 02/23/2014
        vm.toggleDetail = toggleDetail;
        vm.templateUrl = "";

        vm.dueDateFromOpened = false;
        vm.dueDateToOpened = false;
        vm.dueDateFrompayorvmOpened = false;
        vm.dueDateTopayorvmOpened = false;
        vm.open = open;

        

        //  vm.uploadAttachment = uploadAttachment;

        vm.attachment = {
            txnId: 0,
            type: {},
            description: ''
        };

        //YCR 10/22/2014
        vm.sendEmail = sendEmail;

        vm.getTxnCount = getTxnCount;

        //YCR 04/110/2014
        // 4 "filter" and "Order By" Purpose
        vm.categories = [];

        //JRB 05/29/2014 subscribe to status change event
        $scope.$on('txnstatuschanged', function (event, args) {
            if (args.value) {
                if (!refreshVM(vm.payorvm, args.value)) {
                    refreshVM(vm.billervm, args.value);
                }
            }
        });

        //YCR 06/06/2014 subscribe to txn total att change event
        vm.attchedfilescount = 0;
        $scope.$on('txnattcountchanged', function (event, args) {
            vm.attchedfilescount = args.value;
        });


        //YCR 07/06/2014  TABLES  START
        vm.select = function (page, viewmodel) {
            var end, start;

            viewmodel.paging.currentPage = page;
            loadTransactionsAll(dashboardactiveviewmodels);


        };
        vm.numPerPage = 10;

        //TABLES BILLER END

        vm.isLoading = false;


        //YCR 08-13-2014
        vm.setTxnMouseOverTrue = setTxnMouseOverTrue;
        vm.setTxnMouseOverFalse = setTxnMouseOverFalse


        //YCR 08/28/2014  
        //SignalR Section       

        vm.onConnectedCallBack = onConnectedCallBack;
        vm.onNewUserConnectedCallBack = onNewUserConnectedCallBack;
        //Create Connection SignalRHub
        // signalR.createConnection();

        //Register Methods
     //   signalR.myPABHub.client.lockedTxn = myLockTxn;


        //vm.mylockedTxnId = 0;
        //vm.isLocked = false;
        //vm.getIsLocked = getIsLocked;


        //Start Hub Connection ;
        //signalR.myConnetionHub.start().done(function () {
        //    signalR.connectionActive = true;
        //    signalR.myPABHub.server.connect();
        //});


        vm.viewmodel = {};

        //YCR 11/3/2014
        vm.canApprovePayment = canApprovePayment;
        //YCR 11/11/2014
        vm.setTabSelected = setTabSelected;
        
        


        activate();

        function onConnectedCallBack(id, userName, connectedUsers, currentMessage) {
            //   alert(id + ' ' + userName);
        }

        function onNewUserConnectedCallBack(id, userName) {
            //   alert(id + ' ' + userName);
        }

        function activate() {



            if (!datacontext.validSession())
                return;

            common.activateController([loadLookups(), loadTransactionsAll(dashboardactiveviewmodels)], controllerId)
                .then(function () {
                    vm.tabSelectText = vm.getTxnCount().billerAll > 0 ? vm.currentcustomer.legalName + ' (biller account)' : vm.currentcustomer.legalName + ' (payor account)';

                    vm.selectedBillerTab = vm.getTxnCount().billerAll > 0;
                    vm.selectedPayorTab = !vm.selectedBillerTab;
               //     setTabSelected(vm.tabBillerSelected);
                    loadTabSelected();

                    logger.log('PayAnyBiz Dashboard');
                });
        }

        //JRB 05/29/2014
        function refreshVM(model, obj) {
            if (model && obj) {
                var txn = model.getById(obj.id);
                if (txn) {
                    txn.transactionStatus_id = obj.newstatus;
                    txn.transactionStatus_description = datacontext.getStatusDescription(txn.transactionStatus_id);
                    return true;
                }
                return false;
            }
        }

        function loadLookups() {
            //JRB 12/14/2013
            vm.categories = datacontext.getTransactionCatrgoriesLookup();
            //JRB 12/14/2013
            vm.statuses = datacontext.getTransactionStatusLookup();
            //JRB 12/14/2013
            vm.transactiontypes = datacontext.getTransactionTypesLookup();
            //JRB 12/28/2013
            vm.customers = datacontext.getCustomersLookup();
            vm.currentcustomer = datacontext.getCurrentCustomer();

            vm.txnCount = datacontext.getTxnCount();

            //  loadTransactionsAll(dashboardactiveviewmodels);
        }

        //JRB 01/26/2014
        function refreshTransactionStatusStats(dashboardviewmodel) {
            var statusstatobj = datacontext.getCountsForEachStatus(dashboardviewmodel.isbiller);
            dashboardviewmodel.pendingCount = statusstatobj.TotalPending;
            dashboardviewmodel.verifiedCount = statusstatobj.TotalVerified;
            dashboardviewmodel.approvedCount = statusstatobj.TotalApproved;
            dashboardviewmodel.disputedCount = statusstatobj.TotalDisputed;
        }

        //JRB 04/26/2014
        function getTransactionSectionId(id) {
            return 'txn_' + id;
        }

        function setTransactionsCount(dashboardviewmodel) {
            dashboardviewmodel.transactionCount = datacontext.getTransactionsCount(dashboardviewmodel.isbiller);
            refreshTransactionStatusStats(dashboardviewmodel);
            return dashboardviewmodel.transactionCount;
        }

        function setTransactionsFilteredCount(dashboardviewmodel) {
            dashboardviewmodel.transactionFilteredCount = datacontext.getFilteredCount(
                dashboardviewmodel.isbiller,
                dashboardviewmodel.transactionNumberFilter);
            dashboardviewmodel.transactionCount = dashboardviewmodel.transactionFilteredCount;
        }

        function loadTransactionsAll(dashboardviewmodels) {
            dashboardviewmodels.map(function (viewmodel) {
                //JRB 05/21/2014
                getLocalStorage(viewmodel);
                loadTransactions(viewmodel, true);
            });

        }

        function loadTransactions(dashboardviewmodel, forceRefresh) {
            if (dashboardviewmodel) {
                vm.isLoading = true;
                return datacontext.getTransactions(
                    forceRefresh,
                    dashboardviewmodel.paging.currentPage,
                    dashboardviewmodel.paging.pageSize,
                    dashboardviewmodel.isbiller,
                    dashboardviewmodel.filterBy,
                    dashboardviewmodel.transactionStatusFilter,
                    dashboardviewmodel.showingSeleted,
                    dashboardviewmodel.filterOrderBy)
                    .then(function (data) {

                        dashboardviewmodel.transactions = data;
                        vm.filteredTransactions = data;
                        if (!dashboardviewmodel.transactionCount || forceRefresh) {
                            // Only grab the full count once or on refresh
                            setTransactionsCount(dashboardviewmodel);
                        }
                        setTransactionsFilteredCount(dashboardviewmodel);
                        if (!dashboardviewmodel.isbiller) {
                            payorSetTotalSelectedAmount();
                            dashboardviewmodel.selectAllTransactions = dashboardviewmodel.pageAllSelected;
                        }
                        RefreshPagingPanelVisibility(dashboardviewmodel);
                        vm.isLoading = false;



                        return data;
                    });
            }
        }

        function getFilteredTransactions() {
            return vm.filteredTransactions;
        }

        //JRB 01/25/2014
        function changeVisibleTab(tabidx) {
            vm.billerTabActive = tabidx === 0;
        }

        //Refres Paging Panel
        function RefreshPagingPanelVisibility(dashboardviewmodel) {
            dashboardviewmodel.paging.visible = (dashboardviewmodel.paging.currentPage > 1) || (dashboardviewmodel.transactions.length >= dashboardviewmodel.paging.pageSize && dashboardviewmodel.transactionCount > dashboardviewmodel.paging.pageSize);

        }

        //JRB 01/26/2014
        function showSelectedTransactions(dashboardviewmodel) {
            if (dashboardviewmodel) {
                if (!dashboardviewmodel.showingSeleted) {
                    dashboardviewmodel.showingSeleted = true;
                    dashboardviewmodel.showSeletedBtnTitle = ' Show ALL Transactions ';
                }
                else {
                    dashboardviewmodel.showingSeleted = false;
                    dashboardviewmodel.showSeletedBtnTitle = ' Show Seleted Transactions ';
                }
                dashboardviewmodel.gotoFirstPage();
                loadTransactions(dashboardviewmodel);
                RefreshPagingPanelVisibility(dashboardviewmodel);
            }
        }

        //JRB 01/26/2014
        function checkStatusChange(dashboardviewmodel, action) {
            if (dashboardviewmodel.totalSelectedAmount === 0) {
                logger.log('No Transaction Seleted to ' + action);
                //  alert('No Transaction Seleted to ' + action);
                return false;
            }
            return true;
        }

        function setSelectedToVerified(dashboardviewmodel) {
            if (!checkStatusChange(dashboardviewmodel, 'Verify')) { return; }

            return bsDialog.confirmationDialog('Confirm', 'Change selected Transactions status to Verified?')
                .then(function () {
                    doChageStatusTo(dashboardviewmodel, transationStatuses.VERIFIED);
                });
        }

        function setSelectedToVerifiedAndApproved(dashboardviewmodel) {
            //???? --> Check with Greyes
        }

        function setSelectedToApproved(dashboardviewmodel) {
            if (!checkStatusChange(dashboardviewmodel, 'Approve')) { return; }

            var value = canApprovePayment(dashboardviewmodel);

            if (!value.canApprove) {
                return bsDialog.alertErrorDialog('Warning!', value.errorMessage, 'ok')
                 .then(function () {
                     return;
                 });
                return;
            }          
            goToBatchPayment(dashboardviewmodel);
             
        }

        //05/25/2014
        function setSelectedToDispute(dashboardviewmodel) {
            if (!checkStatusChange(dashboardviewmodel, 'Dispute')) { return; }


            var value = canDispute(dashboardviewmodel);

            if (!value.canApprove) {
                return bsDialog.alertErrorDialog('Warning!', value.errorMessage, 'ok')
                 .then(function () {
                     return;
                 });
                return;
            }

           
            goToBatchDispute(dashboardviewmodel);
        }

        function doChageStatusTo(dashboardviewmodel, newstatus) {
            datacontext.changeSeletecedTransactionStatusTo(dashboardviewmodel.isbiller, newstatus)
            .then(changestatusSuccess, changestatusfailed);

            function changestatusSuccess() {

                if (!dashboardviewmodel.isbiller) {
                    dashboardviewmodel.transactions.forEach(function (txn) {
                        if (txn.selected) {
                            sendEmail(txn, 0, 2);
                        }
                    });
                };

                loadTransactions(dashboardviewmodel);
                refreshTransactionStatusStats(dashboardviewmodel);  
            }
            function changestatusfailed(error) {
                logger.logError(error);
            }
        }

        function pageChanged(dashboardviewmodel, page) {
            if (!page) {
                return;
            }
            dashboardviewmodel.paging.currentPage = page;
            loadTransactions(dashboardviewmodel, true);
        }

        function refresh() {
            //JRB 04/12/2014 Fixing Refresh crashing issue.
            loadTransactionsAll(dashboardactiveviewmodels);
        }

        function filter() {
            loadTransactions(dashboardviewmodel, false);
        }

        //JRB 01/26/2014
        function payorSelectUnSelectAll() {
            vm.payorvm.transactions.forEach(function (txn) {
                txn.selected = vm.payorvm.selectAllTransactions;
                datacontext.postTransactionSelectedValue(txn);
            });
            payorSetTotalSelectedAmount();
        }

        //YCR 5/15/2014
        function billerSelectUnSelectAll() {
            vm.billervm.transactions.forEach(function (txn) {
                txn.selected = vm.billervm.selectAllTransactions;
                datacontext.postTransactionSelectedValue(txn);
            });
            payorSetTotalSelectedAmount();
        }

        //JRB 01/25/2014
        function payorRefreshTransactionSelection(txn) {
            if (txn.selected) {
                vm.payorvm.totalSelectedAmount += txn.amount;
            }
            else {
                vm.payorvm.totalSelectedAmount -= txn.amount;
            }
            datacontext.postTransactionSelectedValue(txn);
        };

        //YCR 5/15/2014
        function billerRefreshTransactionSelection(txn) {
            if (txn.selected) {
                vm.billervm.totalSelectedAmount += txn.amount;
            }
            else {
                vm.billervm.totalSelectedAmount -= txn.amount;
            }
            datacontext.postTransactionSelectedValue(txn);
        };

        //JRB 01/25/2014
        function payorSetTotalSelectedAmount() {
            vm.payorvm.totalSelectedAmount = datacontext.getPayorTotalSelectedAmount();
        }

        function billerSetTotalSelectedAmount() {
            vm.billervm.totalSelectedAmount = datacontext.getPayorTotalSelectedAmount();
        }

        function goToDispute(item) {
            if (item && item.id) {
                var url = '/dispute/' + item.id;
                $location.path(url)
            }
        };

        //05/25/2014
        function goToBatchDispute(view) {
            var prmviwew = view.isbiller ? "B" : "P";
            //JRB 07/27/2014
            var url = '/batchdispute/' + prmviwew;
            $location.path(url);
        };

        //YCR 11/3/2014
        function goToBatchPayment(view) {            
            var prmviwew = view.isbiller ? "B" : "P";
            $routeParams.txntyp = prmviwew;

           

            //YCR 11/3/2014
            var url = '/payment/' + prmviwew;
            $location.path(url);
        };

        function goToPayment(txn) {
            txn.selected = true;
            payorRefreshTransactionSelection(txn); 
            $routeParams.id = txn.id;
            var url = '/payment/' + txn.id;
            $location.path(url);
        };

        function filterTransactionsByNumber(dashboardviewmodel, filter) {
            dashboardviewmodel.transactionStatusFilter = null;
            dashboardviewmodel.transactionNumberFilter = filter;
            loadTransactions(dashboardviewmodel, true);
        };

        function filterTransactionsByStatus(dashboardviewmodel, statusId) {
            switch (statusId) {
                case 1:
                    if (dashboardviewmodel.isbiller) {
                        vm.billervm.selectedFilter = "Showing Pending transactions";

                    }
                    else {
                        vm.payorvm.selectedFilter = "Showing Pending transactions";
                    }
                    break;
                case 2:
                    if (dashboardviewmodel.isbiller) {
                        vm.billervm.selectedFilter = "Showing Verified transactions";
                    }
                    else {
                        vm.payorvm.selectedFilter = "Showing Verified transactions";
                    }
                    break;
                case 3:
                    if (dashboardviewmodel.isbiller) {
                        vm.billervm.selectedFilter = "Showing Approved transactions";
                    }
                    else {
                        vm.payorvm.selectedFilter = "Showing Approved transactions";
                    }
                    break;
                case 4:
                    if (dashboardviewmodel.isbiller) {
                        vm.billervm.selectedFilter = "Showing Disputed transactions";
                    }
                    else {
                        vm.payorvm.selectedFilter = "Showing Disputed transactions";
                    }
                    break;
                default:
                    vm.billervm.selectedFilter = "Showing All transactions";
                    vm.payorvm.selectedFilter = "Showing All transactions";

            }
            dashboardviewmodel.transactionNumberFilter = null;
            dashboardviewmodel.transactionStatusFilter = statusId;
            dashboardviewmodel.filterBy.statusCol = statusId;
            dashboardviewmodel.paging.currentPage = 1;
            loadTransactions(dashboardviewmodel);
        };

        //JRB 04/26/2014  Refactoring Pupilo's code.
        function toggleDetail(viewmodel, txn) {
            if (!txn) { return; }
            var visible = !txn.detailsVisbile;
            //if ( visible) {
            //    return;
            //}
            $routeParams.id = txn.id;
            vm.txn = txn;
            vm.idRequested = txn.id;
            if (!visible) {
                var divid = '#' + txn.id;
                $(divid).remove();
            }
            txn.detailsVisbile = visible;
            txn.showInlineAttchment = false;
             // txn.locked = visible;           
           // getIsLocked(txn.id);

            //if (signalR.connectionActive) {
            //    signalR.myPABHub.server.lockTxn(txn.id, visible);
            //}




        };


        //function myLockTxn(id, value) {

        //    dashboardactiveviewmodels[0].transactions.forEach(function (txn) {
        //        if (txn.id == id) {
        //            txn.locked = value;
        //            return;
        //        }
        //    });
        //    dashboardactiveviewmodels[1].transactions.forEach(function (txn) {
        //        if (txn.id == id) {
        //            txn.locked = value;
        //            return;
        //        }
        //    });
        //    vm.mylockedTxnId = id;
        //    vm.islocked = value;
           
        //    return value;
        //}

        //function getIsLocked(txn) {            
        //        return txn.locked;
        //}

        //Fixng Firefox $event not defined issue
        function search(dashboardviewmodel, $event) {
            //JRB 01/26/2014        
            if ($event) {
                switch ($event.keyCode) {
                    case keyCodes.esc:

                        break;
                    case keyCodes.enter:

                        if (!dashboardviewmodel) { return; }
                        saveLocalStorage(dashboardviewmodel);
                        loadTransactions(dashboardviewmodel);
                        break;
                    case keyCodes.backspace:

                        break;
                    case keyCodes.del:

                        break;
                    default:

                        break;
                }
                if ($event.type == "click") {
                    if (!dashboardviewmodel) { return; }

                    saveLocalStorage(dashboardviewmodel);
                    loadTransactions(dashboardviewmodel);
                }
            }


        }

        function clearFilter(dashboardviewmodel) {
            if (!dashboardviewmodel) { return; }

            dashboardviewmodel.filterBySelectedcategory = {};
            dashboardviewmodel.filterBySelectedtype = {};

            dashboardviewmodel.filterBy =
            {
                payorCol: "",
                billerCol: "",
                categoryCol: "",
                typeCol: "",
                numberCol: "",
                dueDateFromCol: "",
                dueDateToCol: "",
                amountCol: "",
                relatedNbrCol: "",
                statusCol: "",
                payorRefCol: "",
                allCol: ""
            };
            saveLocalStorage(dashboardviewmodel);
            loadTransactions(dashboardviewmodel);

        }

        function sorting(dashboardviewmodel, fieldOrder, value) {

            switch (fieldOrder) {
                case 'payorDesc':
                    dashboardviewmodel.filterOrderBy.payorSort = getSorting(value);
                    break;
                case 'billerDesc':
                    dashboardviewmodel.filterOrderBy.billerSort = getSorting(value);
                    break;
                case 'categoryDesc':
                    dashboardviewmodel.filterOrderBy.categorySort = getSorting(value);
                    break;
                case 'typeDesc':
                    dashboardviewmodel.filterOrderBy.typeSort = getSorting(value);
                    break;
                case 'numberDesc':
                    dashboardviewmodel.filterOrderBy.numberSort = getSorting(value);
                    break;
                case 'dueDateDesc':
                    dashboardviewmodel.filterOrderBy.dueDateSort = getSorting(value);
                    break;
                case 'amountDesc':
                    dashboardviewmodel.filterOrderBy.amountSort = getSorting(value);
                    break;
                case 'relatedNbrDesc':
                    dashboardviewmodel.filterOrderBy.relatedNbrSort = getSorting(value);
                    break;
                case 'statusDesc':
                    dashboardviewmodel.filterOrderBy.statusSort = getSorting(value);
                    break;
                case 'payorRefDesc':
                    dashboardviewmodel.filterOrderBy.payorRefSort = getSorting(value);
                    break;
            }
            saveLocalStorage(dashboardviewmodel);
            loadTransactions(dashboardviewmodel, true);
        }

        function getSorting(value) {
            if (value == 2)
                return 1;
            return ++value;
        }

        function sortFromMenu(dashboardviewmodel, fieldOrder, value) {

            switch (fieldOrder) {
                case 'payorDesc':
                    dashboardviewmodel.filterOrderBy.payorSort = value;
                    break;
                case 'billerDesc':
                    dashboardviewmodel.filterOrderBy.billerSort = value;
                    break;
                case 'categoryDesc':
                    dashboardviewmodel.filterOrderBy.categorySort = value;
                    break;
                case 'typeDesc':
                    dashboardviewmodel.filterOrderBy.typeSort = value;
                    break;
                case 'numberDesc':
                    dashboardviewmodel.filterOrderBy.numberSort = value;
                    break;
                case 'dueDateDesc':
                    dashboardviewmodel.filterOrderBy.dueDateSort = value;
                    break;
                case 'amountDesc':
                    dashboardviewmodel.filterOrderBy.amountSort = value;
                    break;
                case 'relatedNbrDesc':
                    dashboardviewmodel.filterOrderBy.relatedNbrSort = value;
                    break;
                case 'statusDesc':
                    dashboardviewmodel.filterOrderBy.statusSort = value;
                    break;
                case 'payorRefDesc':
                    dashboardviewmodel.filterOrderBy.payorRefSort = value;
                    break;
            }
            saveLocalStorage(dashboardviewmodel);
            loadTransactions(dashboardviewmodel, true);
        }

        function saveLocalStorage(dashboardviewmodel) {
            //JRB 05/07/2014
            dashboardviewmodel.SaveFilterSortToLocalStorage();
        }

        function getLocalStorage(dashboardviewmodel) {
            //JRB 05/07/2014
            dashboardviewmodel.LoadFilterSortFromLocalStorage();
        }

        function loadAttachment(txn) {

            if (!txn) { return; }
            $routeParams.id = txn.id;
            $routeParams.showAttachmentModal = true;
            vm.txn = txn;
            txn.isAttachmentLoad = true;

            var modalInstance = $modal.open({
                templateUrl: "attachment.html",
                controller: "attachmentCtrl"
            });

            modalInstance.result.then(function (data) {

            });

        }

        function showAttachments(txn) {
            if (!txn) { return; }
            $('#' + txn.id + 'attachmentModal').modal('show');

            return;
        }

        function makePayment(dashboardviewmodel) {

        }

        //YCR 07/05/2014
        function removeDocument(item, txn) {
            return bsDialog.confirmationDialog('Confirm', 'Remove Document:' + item.description)
             .then(function () {
                 vm.showLoading = true;
                 var myWebApi = $resource('/api/uploading/delete?id=' + item.id, {}, { upload: { method: 'POST' }, getFiles: { method: 'GET' }, deleteFile: { method: 'DELETE' } });

                 myWebApi.deleteFile(function (successResult) {
                     loadAttachments(vm.transaction);
                     vm.showLoading = false;
                 }, function (errorResult) {
                     logger.logError(errorResult.data.message);
                     vm.showLoading = false;
                 });
             });
        };

        function downloadFile(item) {
            if (!item) {
                return;
            }

            window.open('/api/uploading/' + item.id, '_blank');

        }

        function makePrivate(item, txn) {
            if (!item) {
                return;
            }
            vm.showLoading = true;
            logger.log("Making attachment " + item.description + " private!")
            var myWebApi = $resource('/api/uploading?id=' + item.id + '&toPublic=false', {}, { moveFile: { method: 'POST' }, getFiles: { method: 'GET' } });
            myWebApi.moveFile(function (successResult) {
                txn.attachment.forEach(function (attch) {
                    if (attch.id == item.id) {
                        attch.viewableByOtherParty = false;
                        logger.logSuccess("The Attachment :" + attch.description + " is private now!")
                    }

                });
            }, function (errorResult) {
                vm.showLoading = false;
                logger.logError(errorResult.data.message);
            });
        };

        function makePublic(item, txn) {
            if (!item) {
                return;
            }
            vm.loadingMsg = "";
            vm.showLoading = true;
            logger.log("Making attachment " + item.description + " public!")
            var myWebApi = $resource('/api/uploading?id=' + item.id + '&toPublic=true', {}, { moveFile: { method: 'POST' }, getFiles: { method: 'GET' } });
            myWebApi.moveFile(function (successResult) {
                txn.attachment.forEach(function (attch) {
                    if (attch.id == item.id) {
                        attch.viewableByOtherParty = true;
                        logger.logSuccess("The Attachment :" + attch.description + " is public now!")
                    }
                });

            }, function (errorResult) {
                vm.showLoading = false;
                logger.logError(errorResult.data.message);
            });
        };

        function loadAttachments(transaction) {

            if (!transaction) {
                return;
            }
            datacontext.getAttachments(transaction, attachmentDelegate);
            vm.transactionSelectedAttchment = transaction;
        };

        function attachmentDelegate(fectchedData) {
            vm.transactionSelectedAttchment.attachment = fectchedData.results;

            $rootScope.$broadcast('txnattcountchanged', { value: vm.transactionSelectedAttchment.attachment.length })
        }

        function open($event, datepickerName) {

            switch (datepickerName) {
                case 'from':
                    vm.dueDateFromOpened = !0
                    break;
                case 'to':
                    vm.dueDateToOpened = !0
                    break;
                case 'frompayorvm':
                    vm.dueDateFromOpened = !0
                    break;
                case 'topayorvm':
                    vm.dueDateToOpened = !0
                    break;
            }

            return $event.preventDefault(),
                $event.stopPropagation()

        }

        function getTxnCount() {
            return datacontext.getTxnCount();
        }

        function setTxnMouseOverTrue(viewmodel, txn) {
            viewmodel.transactions.forEach(function (txn) {
                txn.mouseOver = false;
            });
            txn.mouseOver = true;
        }

        function setTxnMouseOverFalse(txn) {
            txn.mouseOver = false;
        }

        //YCR 10-22-2014
        function sendEmail(transaction, notificationType, emailTemplate) {

            var emailObj = { emailTemplate: emailTemplate, transactionId: transaction.id, notificationType: notificationType, notifyPayorId: vm.currentcustomer.id };
            notification.email.send().sendEmail(emailObj, function (successResult) {
                if (successResult) {
                    logger.log("E-mail sent successfully");
                }
            },
            function (errorResult) {

            });

        }

        //YCR 11-3-2014
        function canApprovePayment(dashboardviewmodel)
        {          
            batchApproveService.init();
            var errorMessage = '';
            var transactionsToApprove = batchApproveService.getTransactionsToApprove(dashboardviewmodel.isbillerview);
                        
            var uniqueList = _.uniq(transactionsToApprove, function(item) { 
                return item.biller.id;
            });

            if(uniqueList.length > 1)
            {
                errorMessage += "More than one Biller are selected! \n";
            }


            var transactionStatusIdFilter = 2;

            var listFiltered = _.filter(transactionsToApprove, function (t) {
                return t.transactionStatusId === transactionStatusIdFilter;
            });

            if(listFiltered.length == 0)
            {
                errorMessage += "No Verified Transaction are selected! \r\n";
            }



            return { canApprove: uniqueList.length == 1 && listFiltered.length > 0, errorMessage: errorMessage };
        }

        //YCR 11-9-2014
        function canDispute(dashboardviewmodel) {
            batchApproveService.init();
            var errorMessage = '';
            var transactionsToApprove = batchApproveService.getTransactionsToApprove(dashboardviewmodel.isbillerview);

            var uniqueList = _.uniq(transactionsToApprove, function (item) {
                return item.biller.id;
            });

            if (uniqueList.length > 1) {
                errorMessage += "More than one Biller are selected! \n";
            }


            var transactionStatusIdFilter = 1;

            var listFiltered = _.filter(transactionsToApprove, function (t) {
                return t.transactionStatusId === transactionStatusIdFilter;
            });

            if (listFiltered.length == 0) {
                errorMessage += "Only Pending transactions can be disputed! \r\n";
            }



            return { canApprove: uniqueList.length == 1 && listFiltered.length > 0, errorMessage: errorMessage };
        }

        //YCR 11/11/2014
        function setTabSelected(selectedTab)
        {
            if (selectedTab == 0)
            {               
                vm.tabSelectText = vm.currentcustomer.legalName + ' (biller account)';
            }
            else
            {
                
                vm.tabSelectText = vm.currentcustomer.legalName + ' (payor account)';
            }

            vm.selectedBillerTab = selectedTab == 0;
            vm.selectedPayorTab = !vm.selectedBillerTab;
            
            localStorage.setItem('activeTab', selectedTab);
        }

        function loadTabSelected()
        {
            var activeTabData = localStorage.getItem('activeTab');
            if (activeTabData) {
                vm.selectedBillerTab = activeTabData == 0;
                vm.selectedPayorTab = !vm.selectedBillerTab;               
                vm.payorTabDisable = activeTabData == 1;
                if (vm.selectedBillerTab) {
                    vm.tabSelectText = vm.currentcustomer.legalName + ' (biller account)';
                }
                else {

                    vm.tabSelectText = vm.currentcustomer.legalName + ' (payor account)';
                }
            }
            else {
                setTabSelected(false);
            }
        }

       
    }
})();

var dashboardviewtypes = {
    PAYOR: 0,
    BILLER: 1
};
function DashboardTransactionView(dashboardviewtype) {
    this.isbiller = dashboardviewtype === dashboardviewtypes.BILLER;

    //JRB 05/07/2014
    var storageId = {
        filter: this.isbiller ? "dashboard.biller.filter" : "dashboard.payor.filter",
        sort: this.isbiller ? "dashboard.biller.sort" : "dashboard.payor.sort",
        activeTab : "activeTab"
    };

    //Transactions collection
    this.transactions = [];
    //YCR 11/11/2014 ACTIVE TAB
    this.activeTab = 0;

    //Counts management
    //Generic counts
    this.transactionCount = 0;
    this.transactionFilteredCount = 0;
    //Status counts 
    this.pendingCount = 0;
    this.verifiedCount = 0;
    this.approvedCount = 0;
    this.disputedCount = 0;

    //Filtering management
    this.transactionNumberFilter = null;
    this.transactionStatusFilter = null;
    this.filterOrderBy =
        {
            payorSort: 0,
            billerSort: 0,
            categorySort: 0,
            typeSort: 0,
            numberSort: 0,
            dueDateSort: 0,
            amountSort: 0,
            relatedNbrSort: 0,
            statusSort: 0,
            payorRefSort: 0
        };

    this.filterBy =
           {
               payorCol: "",
               billerCol: "",
               categoryCol: "",
               typeCol: "",
               numberCol: "",
               dueDateFromCol: "",
               dueDateToCol: "",
               amountCol: "",
               relatedNbrCol: "",
               statusCol: "",
               payorRefCol: "",
               allCol: ""
           };

    //JRB 05/07/2014
    this.SaveFilterSortToLocalStorage = function () {
        localStorage.setItem(storageId.filter, JSON.stringify(this.filterBy));
        localStorage.setItem(storageId.sort, JSON.stringify(this.filterOrderBy));        
    }

    this.LoadFilterSortFromLocalStorage = function () {
        var filterdata = localStorage.getItem(storageId.filter);
        if (filterdata) {
            this.filterBy = JSON.parse(filterdata);

        }
        var sortdata = localStorage.getItem(storageId.sort);
        if (sortdata) {
            this.filterOrderBy = JSON.parse(sortdata);
        }

        
    }

    //Selection management
    this.totalSelectedAmount = 0;

    //Transaction Selection
    this.selectAllTransactions = false;
    this.showingSeleted = false;
    this.showSeletedBtnTitle = ' Show Seleted Transactions ';

    //Paging management
    this.paging = {
        currentPage: 1,
        maxPagesToShow: 5,
        pageSize: 10,
        visible: true
    };

    //JRB 05/29/2014
    this.getById = function (id) {
        var i = 0, len = this.transactions.length;
        for (; i < len; i++) {
            if (+this.transactions[i].id == +id) {
                return this.transactions[i];
            }
        }
        return null;
    }

    Object.defineProperty(this.paging, 'pageCount', {
        get: function () {
            return Math.floor(this.transactionFilteredCount / this.paging.pageSize) + 1;
        }
    });

    Object.defineProperty(this, 'pageAllSelected', {
        get: function () {
            if (this.transactions.length < 1) { return false; }
            for (var i = 0; i < this.transactions.length; i++) {
                if (!this.transactions[i].selected) {
                    return false;
                }
            };
            return true;
        }
    });

    this.gotoFirstPage = function () {
        this.paging.currentPage = 1;
    }
}


