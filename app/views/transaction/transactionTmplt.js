(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'transactionTmpltCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    //JRB 08/16/2014
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$route', '$location', '$routeParams', 'bootstrap.dialog', '$resource', '$rootScope', '$scope', 'logger', 'filterFilter', 'signalRSvc', transactionTmpltCtrl]);

    function transactionTmpltCtrl(common, config, datacontext, $route, $location, $routeParams, bsDialog, $resource, $rootScope, $scope, logger, filterFilter, signalRSvc) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).      
        var vm = this;
        //  var getLogFn = common.logger.getLogFn;
        //  var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
        // var logError = getLogFn(controllerId, 'error');
        var transationStatuses = datacontext.transactionStatuses;
        var loadResource = common.myResource.documents;
        var notification = common.notification;
        var validator = common.validator.validateTransaction();

        vm.validator = validator;

        // Bindable properties and functions are placed on vm..
        vm.activate = activate;
        vm.save = save;
        vm.addRelatedNumber = addRelatedNumber;
        vm.removeRelatedNumber = removeRelatedNumber;

        //YCR 12-5-2014
        vm.exportToPDF = exportToPDF;

        //vm.title = 'Transaction Edition';
        vm.relatedNumberTotalAmount = 0;
        vm.getRelatedNumberTotalAmount = getRelatedNumberTotalAmount;
        vm.getRelatedNumberTotalRemaining = getRelatedNumberTotalRemaining;

        //JRB 12/15/2013 Lookups
        //Txn Category (Biz Area)
        vm.categories = [];
        vm.selectedcategory = {};

        //Txn Status 
        vm.statuses = [];
        vm.selectedstatus = {};

        //Txn Type
        vm.transactiontypes = [];
        vm.selectedtransactiontype = {};

        //JRB 12/28/2013 
        //Current Customer
        vm.currentcustomer = {};
        //Payors / Billers Customers 
        vm.customers = [];
        vm.selectedpayor = {};
        vm.selectedbiller = {};

        //JRB 12/28/2013
        vm.ispayorcurrent = false;
        vm.isbillercurrent = false;

        //YCR 1/26/2014
        //JRB 02/01/2014
        vm.relatednumbers = [];
        vm.relatedNumber = { parentTxn: {}, number: "", container: "", amount: 0 };

        vm.history = [];
        //JRB 08/16/2014
        vm.disputehistory = [];
        vm.attachments = [];

        //PaymentMethod     
        vm.goToPayment = goToPayment;


        //YCR 2/27/2014
        vm.isValid = true;
        vm.payorIsValid = true;
        vm.billerIsValid = true;
        vm.categoryIsValid = true;
        vm.typeIsValid = true;
        vm.numberIsValid = true;
        vm.payorRefIsValid = true;
        vm.amountIsValid = true;
        vm.isSaving = false;
        vm.relatedTotalAmountIsValid = true;

        //YCR 9/11/2014
        vm.allowPartialPayment = allowPartialPayment;

        vm.showLoading = false;
        vm.loadingMsg = "Saving...";



        //YCR 04/22/2014
        vm.docIspublic = false;
        vm.fileDescription = '';

        //YCR 3/5/2014
        vm.hasChanges = hasChanges;
        vm.canSave = canSave;
        vm.setSelectedToVerified = setSelectedToVerified;
        vm.setSelectedToApproved = setSelectedToApproved;

        //JRB 03/28/2014 ability to disable Payor / biller selection lists 
        //when Transation Status is APPROVED
        vm.isTransactionApproved = false;

        //YCR 04/22/0214
        vm.sendEmail = sendEmail;

        //JRB 06/04/2014 subscribe to txn total att change event
        vm.attchedfilescount = 0;
        $scope.$on('txnattcountchanged', function (event, args) {
            vm.attchedfilescount = args.value;
        });


        //YCR 8/26/2014
        vm.open = open;
        vm.departureDateOpened = false;
        vm.dueDateOpened = false;

        //YCR 08/27/2014
        vm.disputeinfo = {};
        vm.selecteddisputereason = {};
        vm.selecteddisputecategory = {};

        vm.goToDispute = goToDispute;

        //YCR 08/29/2014
        //SignalR Section  
        //vm.hubChangeStatus = hubChangeStatus;
        //vm.myLockTxn = function () { };
        //vm.onConnectedCallBack = onConnectedCallBack;
        //vm.onNewUserConnectedCallBack = onNewUserConnectedCallBack;

        //signalRSvc.startConnection();      
        //signalRSvc.initialize(vm.myLockTxn, vm.hubChangeStatus, vm.onConnectedCallBack, vm.onNewUserConnectedCallBack);

        // signalRSvc.registerConnection();


        //YCR 11/10/2014
        vm.user = {};
        vm.refreshTransactionInfo = refreshTransactionInfo;
        //YCR 11/11/2014
        vm.disputeComments = [];
        vm.newComment = {};
        vm.showReply = false;
        vm.addDisputeComment = addDisputeComment;
        vm.saveDisputeComment = saveDisputeComment;

        //Call Controller Init Method
        activate();

        function onConnectedCallBack(id, userName, connectedUsers, currentMessage) {
         //   alert(id + ' ' + userName);
        }

        function onNewUserConnectedCallBack(id, userName) {
          //  alert(id + ' ' + userName);
        }

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;
            vm.user = datacontext.getCurrentUser();

            var logmsg = $routeParams.id ? 'Activated Edit Transaction View' : 'Activated Add New Transaction View';
            vm.title = $routeParams.id ? 'Transaction Edition' : 'Adding new Transaction';
            var fncLoad = $routeParams.id ? loadTransactionInfo : addNewTransaction;
            var idOrtype = $routeParams.id ? $routeParams.id : $routeParams.txntype;

            if ($routeParams.txntype == "P") {
                vm.returnTo = 2;
            } else if ($routeParams.txntype == "B") {
                vm.returnTo = 1;
            };

            common.activateController([loadLookups(), fncLoad(idOrtype)], controllerId)
                  .then(function () { });
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
        }

        function save() {
            if (validation() && canSave()) {
                vm.isSaving = true;
                vm.showLoading = true;
                datacontext.saveChanges().fin(complete);

            };

            function complete() {
                vm.isSaving = false;
                vm.showLoading = false;
                datacontext.getTransactionHistory(vm.transaction, transactionHistoryDelegate);
            };
        }

        //JRB 02/02/2014
        function addRelatedNumber($event) {
            if ($event) {
                switch ($event.keyCode) {                   
                    case keyCodes.enter:
                        //JRB 09/09/2014 (C#20140817-1)          
                        vm.relatednumbers = datacontext.addTransactionAddtionalRefNbr(vm.relatedNumber);
                        setRelatedNumberTotalAmount();
                        vm.relatedNumber.number = "";
                        vm.relatedNumber.container = "";
                        vm.relatedNumber.amount = 0;
                        vm.relatedNumber.userId = vm.user.currentUserId;
                        break;
                    case keyCodes.backspace:

                        break;
                    case keyCodes.del:

                        break;
                    default:

                        break;
                }
                if ($event.type == "click") {
                    //JRB 09/09/2014 (C#20140817-1)          
                    vm.relatednumbers = datacontext.addTransactionAddtionalRefNbr(vm.relatedNumber);
                    setRelatedNumberTotalAmount();
                    vm.relatedNumber.number = "";
                    vm.relatedNumber.container = "";
                    vm.relatedNumber.amount = 0;
                    vm.relatedNumber.userId = vm.user.currentUserId;
                }
            }

        
        }

        //YCR 04/02/2014
        //JRB 09/09/2014 (C#20140817-1)
        function removeRelatedNumber(relNumb) {
            //var index = vm.relatednumbers.indexOf(relNumb);
            //vm.relatednumbers.splice(index, 1);
            vm.relatednumbers = datacontext.removeTransactionAddtionalRefNbr(relNumb);
            setRelatedNumberTotalAmount();
        }


        //YCR 04/22/2014
        function addAttchment(attachment) {
            var newAttachment = datacontext.addAttchment(attachment);
            if (newAttachment) {
                //I don't like code below. Not elegant solution, 
                //it defeats the beauty of AngularJS and Breeze :(. To be refactored A.S.A.P
                // vm.attachments.push(newrelnbr);
            }
        }

        //YCR 11/10/2014
        function refreshTransactionInfo(id)
        {
            return datacontext.getTransactionByIdFromServer(id, setTransactinInfoDelegate);
        }
        
        //JRB 12/15/2013
        function loadTransactionInfo(id) {
            //Set Txn Info Data By Id with Defferred execution 
            //Breeze gets data from local cache when available otherwise goes to the server to fetch the data.
            return datacontext.getTransactionById(id, setTransactinInfoDelegate);
        }

        function addNewTransaction(type) {
            var initpayorbiller = {};
            if (type === "B") {
                initpayorbiller = { billerId: vm.currentcustomer.id, transactionStatusId: datacontext.transactionStatuses.PENDING };
                vm.isbillercurrent = true;
            }
            else {
                initpayorbiller = { payorId: vm.currentcustomer.id, transactionStatusId: datacontext.transactionStatuses.PENDING };
                vm.ispayorcurrent = true;
            }
            vm.transaction = datacontext.addNewTransaction(initpayorbiller);
            //Set Payor from lookup
            vm.selectedpayor = vm.transaction.payor;
            //Set Biller from lookup
            vm.selectedbiller = vm.transaction.biller;
            //Set Txn Type from lookup
            vm.selectedstatus = vm.transaction.transactionStatus;
            //Set Additionsal refnbr active record Transactrion Id
            vm.relatedNumber.parentTxn = vm.transaction;
        }

        function setTransactinInfoDelegate(fectchedData) {
            //This delegate is needed to sync. breeze fetch data promise with angular $scope $diggest
            //Solution delegate function setTransactinInfo() will attend the success delegate 
            //of breeze.fetchEntityByKey() asynch. method.
            vm.transaction = fectchedData.entity;
            if (vm.transaction.transactionStatusId === 4) {

                datacontext.getTransactionDisputeInfo(vm.transaction, TransactionDisputeInfoLoadedDelegate);
                datacontext.getTransactionComments(vm.transaction, TransactionCommentsLoadedDelegate);//Load Comments
            }

            if (vm.transaction) {
                datacontext.getTransactionRelatedNumbers(vm.transaction, transrelnumbersloadedDelegate);

                datacontext.getTransactionHistory(vm.transaction, transactionHistoryDelegate);
                datacontext.getAttachments(vm.transaction, attachmentDelegate);

                //Set Txn Category from lookup
                vm.selectedcategory = vm.transaction.bizArea;
                //Set Txn Status from lookup
                vm.selectedtransactiontype = vm.transaction.transactionType;
                //Set Txn Type from lookup
                vm.selectedstatus = vm.transaction.transactionStatus;
                //Set Payor from lookup
                vm.selectedpayor = vm.transaction.payor;
                //Set Biller from lookup
                vm.selectedbiller = vm.transaction.biller;
                //Define how current user org. s acting as on the txn.
                vm.ispayorcurrent = vm.transaction.payorId === vm.currentcustomer.id;
                vm.isbillercurrent = vm.transaction.billerId === vm.currentcustomer.id;
                //Set Additionsal refnbr active record Transactrion Id
                vm.relatedNumber.parentTxn = vm.transaction;
                $routeParams.id = vm.transaction.id;
                vm.isTransactionApproved = (vm.transaction.transactionStatusId === datacontext.transactionStatuses.APPROVED);
            }
            getRelatedNumberTotalAmount();
            return vm.transaction;
        }

        function TransactionDisputeInfoLoadedDelegate(fectchedData) {
            if (fectchedData.results && fectchedData.results.length > 0) {
                vm.disputeinfo = fectchedData.results[0];
                vm.selecteddisputereason = vm.disputeinfo.disputeReason;
                vm.selecteddisputecategory = vm.disputeinfo.disputeCategory;
            }
        }

        function TransactionCommentsLoadedDelegate(fectchedData) {
            if (fectchedData.results && fectchedData.results.length > 0) {  
                vm.disputeComments = fectchedData.results;
            }
        }

        //JRB 02/02/2014
        function transrelnumbersloadedDelegate(fectchedData) {
            vm.relatednumbers = fectchedData.results;
            setRelatedNumberTotalAmount();
        }

        //JRB 02/02/2014
        //JRB 08/16/2014
        function transactionHistoryDelegate(fectchedData) {
            vm.history = filterFilter(fectchedData.results, { disputing: false });
            vm.disputehistory = filterFilter(fectchedData.results, { disputing: true });
        }


        function attachmentDelegate(fectchedData) {
            vm.attachments = fectchedData.results;
        }

        //JRB 02/02/2014
        function setRelatedNumberTotalAmount() {
            vm.relatedNumberTotalAmount = 0;
            vm.relatednumbers.forEach(function (r) {
                vm.relatedNumberTotalAmount += r.amount;
            });
        }

        //YCR 05/29/2014
        function getRelatedNumberTotalAmount() {
            vm.relatedNumberTotalAmount = 0;
            vm.relatednumbers.forEach(function (r) {
                vm.relatedNumberTotalAmount += r.amount;
            });
            return vm.relatedNumberTotalAmount;
        }

        //YCR 08/11/2014
        function getRelatedNumberTotalRemaining() {
            vm.relatedNumberTotalAmount = 0;
            var totalRemain = vm.relatedNumberTotalAmount;
            vm.relatednumbers.forEach(function (r) {
                vm.relatedNumberTotalAmount += r.amount;
            });
            if (vm.transaction) {
                totalRemain = vm.transaction.amount - vm.relatedNumberTotalAmount;
            }

            return totalRemain;
        }

        function setSelectedToApproved() {
            return bsDialog.confirmationDialog('Confirm', 'Change status to Approved?')
                .then(function () {
                    doChageStatusTo(vm.transaction, transationStatuses.APPROVED);
                });
        }
        //JRB 03/28/2014 ability to disable Payor / biller selection lists 
        //when Transation Status is APPROVED

        //#endregion

        //YCR 02/27/2014
        function validation() {

            var result = vm.validator.isValid(vm, vm.validator.validateObject);

            if (!result.isValid) {
                logger.logError('Please check required fields');
            }
            return result.isValid;
        }

        //YCR 3/5/2014
        function hasChanges() {
            return datacontext.hasChanges();
        }

        function canSave() {
            return vm.hasChanges && !vm.isSaving;
        };

        //YCR 03/06/2014
        function setSelectedToVerified() {
            return bsDialog.confirmationDialog('Confirm', 'Change status to Verified?')
                .then(function () {
                    doChageStatusTo(vm.transaction, transationStatuses.VERIFIED);
                });
        }

        function doChageStatusTo(transaction, newstatus) {

            datacontext.changeTransactionStatusTo(vm.transaction.id, newstatus)
            .then(changestatusSuccess, changestatusfailed);

            function changestatusSuccess() {
                //05/29/2014 Raise Event for scopes listening/subscribed
                $rootScope.$broadcast('txnstatuschanged', { value: { id: vm.transaction.id, newstatus: newstatus } })

             //   signalRSvc.changeStatusTxn(hubChangeStatus, vm.transaction.id, newstatus);
              
                sendEmail(vm.transaction, 0);
                loadTransactionInfo($routeParams.id);
            }
            function changestatusfailed(error) {
                logger.logError(error);

            }
        }              

        function sendEmail(transaction, notificationType) {

            var emailObj = { emailTemplate: 2, transactionId: transaction.id, notificationType: notificationType, notifyPayorId: vm.currentcustomer.id };



            notification.email.send().sendEmail(emailObj, function (successResult) {
                if (successResult) {
                    logger.log("E-mail sent successfully");
                }
            },
            function (errorResult) {

            });

        }

        function exportToPDF(txn) {
            var pdf = new jsPDF('p', 'in', 'letter');

            // source can be HTML-formatted string, or a reference
            // to an actual DOM element from which the text will be scraped.
            var source = $('#' + txn.id)[0];

            // we support special element handlers. Register them with jQuery-style 
            // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
            // There is no support for any other type of selectors 
            // (class, of compound) at this time.
            var specialElementHandlers = {
                // element with id of "bypass" - jQuery style selector
                '#bypassme': function (element, renderer) {
                    // true = "handled elsewhere, bypass text extraction"
                    return true
                }
            }

            // all coords and widths are in jsPDF instance's declared units
            // 'inches' in this case
            pdf.fromHTML(
                source // HTML string or DOM elem ref.
                , 0.5 // x coord
                , 0.5 // y coord
                , {
                    'width': 7.5 // max width of content on PDF
                    , 'elementHandlers': specialElementHandlers
                }
            )

            pdf.save('Test.pdf');

        }
                
        function goToPayment(txn) {
            txn.selected = true;           
            datacontext.postTransactionSelectedValue(txn);
            $routeParams.id = txn.id;
            var url = '/payment/' + txn.id;
            $location.path(url);
        };

        function open($event, datepickerName) {

            switch (datepickerName) {
                case 'departureDateOpened':
                    vm.departureDateOpened = !0
                    break;
                case 'dueDateOpened':
                    vm.dueDateOpened = !0
                    break;
                case 'arrivalDateOpened':
                    vm.arrivalDateOpened = !0
                    break;
                case 'topayorvm':
                    vm.dueDateToOpened = !0
                    break;
            }

            return $event.preventDefault(),
                $event.stopPropagation()

        }

        function allowPartialPayment(txn) {

            txn.amount = txn.amount - txn.disputedAmount;

            doChageStatusTo(txn, transationStatuses.APPROVED);

            createPartialTransaction(txn);

        }

        function createPartialTransaction(txn) {
            var initpayorbiller = { billerId: vm.currentcustomer.id, transactionStatusId: datacontext.transactionStatuses.PENDING, amount: 0 };

            var newTxn = datacontext.addNewTransaction(initpayorbiller);

            newTxn.DisputedRefNumber = txn.number;
            newTxn.bizArea = txn.bizArea;
            newTxn.transactionType = txn.transactionType;
            newTxn.payor = txn.payor;
            newTxn.biller = txn.biller;
            newTxn.number = datacontext.getNextTxnNumber(txn);
            newTxn.relatedNumber = txn.relatedNumber;
            newTxn.payorRefNumber = txn.payorRefNumber;
            newTxn.amount = txn.disputedAmount;          

            datacontext.saveChanges().fin(complete);

            function complete() {
                vm.isSaving = false;
                vm.showLoading = false;
                datacontext.getTransactionHistory(vm.transaction, transactionHistoryDelegate);
            };
            
        }

        function goToDispute(item) {
            if (item && item.id) {
                var url = '/dispute/' + item.id;
                $location.path(url)
            }
        };

        //YCR 11/11/2014
        function addDisputeComment(txn)
        {
            vm.showReply = true;
            var initValues = { transactionId: txn.id, customerId: vm.currentcustomer.id, userId: vm.user.currentUserId, active: true };
            vm.comment = datacontext.addTxnComment(initValues);
        }
        //YCR 11/11/2014
        function saveDisputeComment()
        {
         
            
           vm.isSaving = true;           
           datacontext.saveChanges().fin(complete);

          

            function complete() {
                vm.isSaving = false;
                vm.showLoading = false;
                vm.showReply = false;
                vm.comment = {};
                datacontext.getTransactionComments(vm.transaction, TransactionCommentsLoadedDelegate);
            };
        }
    };
})();

//#region Validations

//#endregion