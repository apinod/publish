(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'batchdisputeCtrl';
    angular.module('app').controller(controllerId,
           ['common',
            'config',
            '$route', '$routeParams',
            '$location',
            '$scope',
            'bootstrap.dialog',
            'batchdisputeService',
            'logger',
            'datacontext',
            batchdisputeCtrl]);

    function batchdisputeCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $scope,
        bsDialog,
        batchdisputeService,
        logger, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        //var getLogFn = common.logger.getLogFn;
        //var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
        var validator = common.validator.validateDisputeBatch();
        var notification = common.notification;

        vm.validator = validator;

        // Bindable properties and functions are placed on vm..
        vm.activate = activate;
        vm.goToDashboard = goToDashboard;
        vm.isFirstRow = isFirstRow;
        vm.removeFromBatch = removeFromBatch;
        vm.save = save;

        //Disputes
        vm.disputes = [];
        //Dispute Category
        vm.disputecategories = [];
        vm.selecteddisputecategory = {};
        vm.disputecategoryIsValid = true;
        //Dispute Reson
        vm.disputereasons = [];
        vm.selecteddisputereason = {};
        vm.disputereasonIsValid = true;
        //Description
        vm.description = "";

        vm.currentcustomer = {};

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;
            vm.currentcustomer = datacontext.getCurrentCustomer();

            var logmsg = 'Activated Dispute Transactions View';
            vm.title = "Disputing Transactions";
            var fncLoad = loadTransactionsToDispute;
            common.activateController([fncLoad()], controllerId)
                  .then(function () { });
        }

        //JRB 07/27/2014
        function loadTransactionsToDispute() {
            var isbillerview = $routeParams.txntyp === "B";
            batchdisputeService.init();
            vm.disputecategories = batchdisputeService.getDisputeCategories();
            vm.disputereasons = batchdisputeService.getDisputeReasons();
            vm.disputes = batchdisputeService.getTransactionsToDispute(isbillerview);
        }

        function removeFromBatch(dispute) {
            vm.disputes = batchdisputeService.removeDispute(dispute);

            if (vm.disputes.length == 0)
            {
                goToDashboard();
            }

        }

        var firstfocused;
        function isFirstRow() {
            if (firstfocused)
                return false;
            firstfocused = true;
            return firstfocused;
        };

        function save() {
            //TO-DO Validations here
            if (validation())
            {
                return batchdisputeService.saveChanges(
               {
                   resonId: vm.selecteddisputereason.id, categoryId: vm.selecteddisputecategory.id,
                   description: vm.description
               },
               function () {
                   logger.logSuccess("Batch Disputed Saved.");
                   vm.disputes.forEach(function (txn) {                     
                           sendEmail(txn.transaction, 0, 2);                      
                   });                  
               },
               function (error) {
                   var msg = 'Error saving Batch Dispute: ' + error.message;
                   logger.logError(msg, error);
               });
            }         
        };

        //YCR 02/27/2014
        function validation() {

            var result = vm.validator.isValid(vm, vm.validator.validateObject);

            if (!result.isValid) {
                logger.logError('Please check required fields');
            }
            return result.isValid;
        }

        function goToDashboard() {
            var url = '/' + 2;
            $location.path(url)
        };

       
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

        var canceldialogVisible;
        $scope.$on('$locationChangeStart', function (event, next, current) {
            if (canceldialogVisible) {
                event.preventDefault();
                return;
            }
            if (batchdisputeService.haschanges()) {
                canceldialogVisible = true;
                var dlg = bsDialog.confirmationDialog('Please Confirm', 'Cancel ' + vm.title + '?');
                dlg.then(
                    //Ok Button
                    function (btn) {
                        batchdisputeService.cancelChanges();
                        $location.path(next);
                        canceldialogVisible = false;
                        return;
                    },
                    //Cancel Button (Not needed in this case, since not processed)
                   function (btn) {
                       canceldialogVisible = false;
                   });
                event.preventDefault();
            }
        });
    }
})();

