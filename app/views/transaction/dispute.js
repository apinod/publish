(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'disputeCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$route', '$location', '$routeParams', 'bootstrap.dialog','logger', disputeCtrl]);

    function disputeCtrl(common, config, datacontext, $route, $location, $routeParams, bsDialog, logger) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
      //  var getLogFn = common.logger.getLogFn;
      //  var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
     //   var logError = getLogFn(controllerId, 'error');
        var validator = common.validator.validateDispute();
        var notification = common.notification;

        vm.validator = validator;

        // Bindable properties and functions are placed on vm..
        vm.activate = activate;
        vm.save = save;

        //Transaction
        vm.disputeinfo = {
            parenttransaction: {},
            dispute: {},
            isTransactionApproved: false
        };

        //Dispute Category
        vm.disputecategories = [];
        vm.selecteddisputecategory = {};
        vm.disputecategoryIsValid = true;

        //Dispute Reson
        vm.disputereasons = [];
        vm.selecteddisputereason = {};
        vm.disputereasonIsValid = true;

        //Amount 
        vm.amountIsValid = true;

        //JRB 03/30/2014
        vm.isValid = true;
        vm.isSaving = false;

        //YCR 3/5/2014
        vm.hasChanges = hasChanges;
        vm.canSave = canSave;
        vm.goToDashboard = goToDashboard;
        //YCR 11/6/2014
        vm.currentcustomer = {};

       

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;
            vm.currentcustomer = datacontext.getCurrentCustomer();

            var logmsg = 'Activated Dispute Transaction View';
            vm.title = 'Dispute Transaction';
            var fncLoad = loadTransactionInfoAndDispute;
            var idOrtype = $routeParams.id ? $routeParams.id : $routeParams.txntype;
            common.activateController([loadLookups(), fncLoad(idOrtype)], controllerId)
                  .then(function () { logger.log(logmsg); });
        }

        function loadLookups() {
            //JRB 03/30/2014
            vm.disputereasons = datacontext.getDisputeReasonLookup();
            //JRB 03/30/2014
            vm.disputecategories = datacontext.getDisputeCategoryLookup();
        }

        //JRB 03/30/2014
        function save() {
            //TO-DO Validate
            if (canSave() && validation()) {
                vm.isSaving = true;
                vm.disputeinfo.parenttransaction.transactionStatusId = datacontext.transactionStatuses.DISPUTED;
                vm.disputeinfo.dispute.disputeCategoryId = vm.selecteddisputecategory.id;
                vm.disputeinfo.dispute.disputeReasonId = vm.selecteddisputereason.id;
                datacontext.saveChanges().fin(complete);
            };

            function complete() {
                vm.isSaving = false;
                sendEmail(vm.disputeinfo.parenttransaction, 0);
               // logger.logSuccess('Saved successfully');
            };
        }

        //JRB 12/15/2013
        function loadTransactionInfoAndDispute(id) {
            //Set Txn Info Data By Id with Defferred execution 
            //Breeze gets data from local cache when available otherwise goes to the server to fetch the data.
            return datacontext.getTransactionById(id, setTransactinInfoDelegate);
        }

        function setTransactinInfoDelegate(fectchedData) {
            vm.disputeinfo.parenttransaction = fectchedData.entity;
            if (vm.disputeinfo.parenttransaction) {
                vm.disputeinfo.isTransactionApproved = vm.disputeinfo.parenttransaction.transactionStatusId === datacontext.transactionStatuses.APPROVED;
                datacontext.getTransactionDisputeInfo(vm.disputeinfo.parenttransaction, TransactionDisputeInfoLoadedDelegate);
            }
            return vm.transaction;
        }

        //JRB 03/30/2014
        function TransactionDisputeInfoLoadedDelegate(fectchedData) {
            if (fectchedData.results && fectchedData.results.length > 0) {
                vm.disputeinfo.dispute = fectchedData.results[0];
                vm.selecteddisputereason = vm.disputeinfo.dispute.disputeReason;
                vm.selecteddisputecategory = vm.disputeinfo.dispute.disputeCategory;
            }
            else {
                var dispaddobj = { parentTxn: vm.disputeinfo.parenttransaction };
                vm.disputeinfo.dispute = datacontext.addTransactionDispute(dispaddobj);
            }
        }
        //#endregion

        //YCR 3/5/2014
        function hasChanges() {
            return datacontext.hasChanges();
        }

        //TO-DO
        function canSave() {
            return true;
        };

        function goToDashboard() {
            var url = '/dashboard';
            $location.path(url)
        };

        //YCR 02/27/2014
        function validation() {

            var result = vm.validator.isValid(vm, vm.validator.validateObject);

            if (!result.isValid) {
                logger.logError('Please check required fields');
            }
            return result.isValid;
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