(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'transactionCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common',
         'config',
         '$route', '$routeParams',
         '$location',
         '$resource',
         '$scope',
         'bootstrap.dialog',
         'logger',
         'datacontext',
         transactionCtrl]);

    function transactionCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        bsDialog,        
        logger,
        datacontext
        ) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).      
        var vm = this;
       // var getLogFn = common.logger.getLogFn;
       // var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
       // var logError = getLogFn(controllerId, 'error');
        var transationStatuses = datacontext.transactionStatuses;
        var loadResource = common.myResource.documents;
        var validator = common.validator.validateTransaction();
        var notification = common.notification;
       
        vm.validator = validator;
        // Bindable properties and functions are placed on vm..
        vm.activate = activate;
        vm.save = save;
        vm.addRelatedNumber = addRelatedNumber;
        vm.removeRelatedNumber = removeRelatedNumber;

        //vm.title = 'Transaction Edition';
        vm.relatedNumberTotalAmount = 0;

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

        vm.isSaving = false;
        vm.isSaved = false;
        //YCR 3/5/2014
        vm.hasChanges = hasChanges;
        vm.canSave = canSave;
        vm.setSelectedToVerified = setSelectedToVerified;
        vm.setSelectedToApproved = setSelectedToApproved;
        vm.returnTo = $routeParams.isbillercurrent ? $routeParams.isbillercurrent : 1;
        vm.goToDashboard = goToDashboard;

        //JRB 03/28/2014 ability to disable Payor / biller selection lists 
        //when Transation Status is APPROVED
        vm.isTransactionApproved = false;

        //YCR-06-09-2014
        vm.getRelatedNumberTotalAmount = getRelatedNumberTotalAmount;


        //YCR 07/08/2014
        vm.open = open;
        vm.departureDateOpened = false;
        vm.dueDateOpened = false;


        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;

            var logmsg = $routeParams.id ? 'Activated Edit Transaction View' : 'Activated Add New Transaction View';
            //JRB 04/12/2014: (Dropbox doc: Issues reviewed on Meeting from 04-09-2014.docx)
            //PAYOR ISSUES Section
            //1.When you try to change the dollar amount in the Transaction Edition screen. 
            //  The dollar amount does not come in properly. 
            //DISPUTE TRANSACTION Section
            //1.The dollar amount does not go in property. 
            //  When you click the field it should allow you to type the dollar amount.
            vm.title = $routeParams.id ? 'Edit Transaction' : 'New Transaction';
            var fncLoad = $routeParams.id ? loadTransactionInfo : addNewTransaction;
            var idOrtype = $routeParams.id ? $routeParams.id : $routeParams.txntype;

            if ($routeParams.txntype == "P") {
                vm.returnTo = 2;
            } else if ($routeParams.txntype == "B") {
                vm.returnTo = 1;
            };

            common.activateController([loadLookups(), fncLoad(idOrtype)], controllerId)
                  .then(function () { logger.log(logmsg); });
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
                datacontext.saveChanges().fin(complete);

            };

            function complete() {
                vm.isSaving = false;
                vm.isSaved = true;
                $routeParams.id = vm.transaction.id;
                sendEmail(vm.transaction, 0);
               // logger.logSuccess('Saved successfully');
                datacontext.getTransactionHistory(vm.transaction, transactionHistoryDelegate);
               
            };
        }

        //JRB 02/02/2014
        function addRelatedNumber() {
            var newrelnbr = datacontext.addTransactionAddtionalRefNbr(vm.relatedNumber);
            if (newrelnbr) {
                //I don't like code below. Not elegant solution, 
                //it defeats the beauty of AngularJS and Breeze :(. To be refactored
                vm.relatednumbers.push(newrelnbr);
            }
            setRelatedNumberTotalAmount();
            vm.relatedNumber.number = "";
            vm.relatedNumber.container = "";
            vm.relatedNumber.amount = 0;
        }

        //YCR 04/02/2014
        function removeRelatedNumber(relNumb) {
            vm.relatednumbers.splice(relNumb, 1);
            setRelatedNumberTotalAmount();
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
                initpayorbiller = { billerId: vm.currentcustomer.id, transactionStatusId: datacontext.transactionStatuses.PENDING,  amount: 0};
                vm.isbillercurrent = true;
            }
            else {
                initpayorbiller = { payorId: vm.currentcustomer.id, transactionStatusId: datacontext.transactionStatuses.PENDING, amount: 0};
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
            if (vm.transaction) {
                datacontext.getTransactionRelatedNumbers(vm.transaction, transrelnumbersloadedDelegate);

                datacontext.getTransactionHistory(vm.transaction, transactionHistoryDelegate);
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
                //Load Documents
                loadAttachments(vm.transaction);
                vm.isTransactionApproved = (vm.transaction.transactionStatusId === datacontext.transactionStatuses.APPROVED);
            }
            return vm.transaction;
        }

        //JRB 02/02/2014
        function transrelnumbersloadedDelegate(fectchedData) {
            vm.relatednumbers = fectchedData.results;
            setRelatedNumberTotalAmount();
        }

        //JRB 02/02/2014
        function transactionHistoryDelegate(fectchedData) {
            vm.history = fectchedData.results;
        }

        //JRB 02/02/2014
        function setRelatedNumberTotalAmount() {
            vm.relatedNumberTotalAmount = 0;
            vm.relatednumbers.forEach(function (r) {
                vm.relatedNumberTotalAmount += r.amount;
            });
        }

        //JRB 03/28/2014 ability to disable Payor / biller selection lists 
        //when Transation Status is APPROVED

        //#endregion

        //YCR 02/27/2014
        function validation() {

            var result = vm.validator.isValid(vm, vm.validator.validateObject);
                   
            if (!result.isValid) {
                logger.logError('Please check required fields', 'error');
            }
            return result.isValid;
        }

        //YCR 3/5/2014
        //JRB 5/24/2015
        function hasChanges() {
            return datacontext.hasTransactionChanges();
        }

        function canSave() {
            return !vm.isSaving;
        };

        //YCR 03/06/2014
        function setSelectedToVerified() {
            return bsDialog.confirmationDialog('Confirm', 'Change status to Verified?')
                .then(function () {
                    doChageStatusTo(vm.transaction, transationStatuses.VERIFIED);
                });
        }

        //JCR 04/12/2014
        //1.	In Edit transaction screen the Approve button does not work.
        function setSelectedToApproved() {
            return bsDialog.confirmationDialog('Confirm', 'Change status to Approved?')
                .then(function () {
                    doChageStatusTo(vm.transaction, transationStatuses.APPROVED);
                });
        }


        function doChageStatusTo(transaction, newstatus) {

            datacontext.changeTransactionStatusTo(vm.transaction.id, newstatus)
            .then(changestatusSuccess, changestatusfailed);

            function changestatusSuccess() {
                logger.log('Done');
                loadTransactionInfo($routeParams.id);
            }
            function changestatusfailed(error) {
                logger.logError(error, 'error');

            }
        }

        //YCR 06/09/2014
        function getRelatedNumberTotalAmount() {
            vm.relatedNumberTotalAmount = 0;
            vm.relatednumbers.forEach(function (r) {
                vm.relatedNumberTotalAmount += r.amount;
            });
            return vm.relatedNumberTotalAmount;
        }

        function goToDashboard() {
            if (!canceldialogVisible) {
                var url = '/dashboard';
                $location.path(url);
            }
        };

        //JRB 05/24/2014
        var canceldialogVisible;
        $scope.$on('$locationChangeStart', function (event, next, current) {
            if (canceldialogVisible) {
                event.preventDefault();
                return;
            }
            if (vm.hasChanges()) {
                canceldialogVisible = true;
                var dlg = bsDialog.confirmationDialog('Please Confirm', 'Cancel ' + vm.title + '?');
                dlg.then(
                    //Ok Button
                    function (btn) {
                        canceldialogVisible = false;
                        datacontext.cancelChanges();
                        $location.path('/dashboard');
                        return;
                    },
                    //Cancel Button (Not needed in this case, since not processed)
                   function (btn) {
                       canceldialogVisible = false;
                   });
                event.preventDefault();
            }
        });

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

        //YCR 10-22-2014
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
    };
})();

//#region Validations

//#endregion