(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'paymentCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$route', '$location', '$routeParams', 'bootstrap.dialog', '$resource', '$rootScope', 'logger', 'batchApproveService', paymentCtrl]);

    function paymentCtrl(common, config, datacontext, $route, $location, $routeParams, bsDialog, $resource, $rootScope, logger, batchApproveService) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).      
        var vm = this;

        var numer2text = {
            ones: ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'],
            tens: ['', '', 'TWENTY', 'THIRTY', 'FOURTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'],
            sep: ['', ' THOUSAND ', ' MILLION ', ' BILLION ', ' TRILLION ', ' QUADRILLION ', ' QUINTILLION ', ' SEXTILLION ']
        };
        var keyCodes = config.keyCodes;

        var transationStatuses = datacontext.transactionStatuses;
        var loadResource = common.myResource.documents;
        var notification = common.notification;

        // Bindable properties and functions are placed on vm..
        vm.activate = activate;
        vm.save = save;

        //Current Customer
        vm.currentcustomer = {};
        //Payors / Billers Customers 
        vm.customers = [];
        vm.selectedpayor = {};
        vm.selectedbiller = {};

        vm.payment = {};



        //JRB 12/28/2013
        vm.ispayorcurrent = false;
        vm.isbillercurrent = false;
        vm.typeIsValid = true;

        vm.proccessingDate = new Date();
        vm.toBePaid = toBePaid;
        vm.dateToPrint = '';

        vm.sameDayPayment = vm.proccessingDate;
        vm.selectPaymentMethod = selectPaymentMethod;
        vm.selectedPaymentMethod = '(PayAnyBiz Credit)';
        vm.selectedPaymentId = 1;
        vm.selectedtransactiontype = {};

        vm.TotalAmount = '';
        vm.relatednumbers = [];
        vm.transaction = {};

        //Wizard
        vm.finished = finished;
        vm.nextTab = nextTab;
        vm.selectedTab = 0;

        //YCR 2/27/2014
        vm.isSaving = false;

        vm.showLoading = false;
        vm.loadingMsg = "Loading...";

        //YCR 04/22/0214
        vm.sendEmail = sendEmail;

        vm.txnId = $routeParams.id;
              

        //YCR 11/3/2014
        vm.transactions = [];
        //YCR 11/3/2014
        vm.billersSelected = [];
        //YCR 11/4/2014
        vm.subTotalAmount = 0;
        vm.fee = 2;
        vm.grandTotal = 0;
        vm.printInvoice = printInvoice;
        vm.open = open;
        vm.proccessingDateOpened = false;
        vm.toBePaidDateOpened = false;
        vm.currentcustomer = {};


        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;
            vm.currentcustomer = datacontext.getCurrentCustomer();

            vm.title = 'Transaction Payment Method' + $routeParams.id;
            var fncLoad = loadTransactionsToApprove;
            var idOrtype = $routeParams.id;
            common.activateController([fncLoad()], controllerId)
                  .then(function () {
                  });
        }

        function finished() {           

            vm.transactions.forEach(function (x) {
                doChageStatusTo(x, transationStatuses.APPROVED);              
            });

           

            nextTab(2);
            sendEmail(vm.transactions,0)
            return void 0
        }

        function save() {
            if (validation()) {
                vm.isSaving = true;
                vm.showLoading = true;
                datacontext.saveChanges().fin(complete);

            };
            function complete() {
                vm.isSaving = false;
                vm.showLoading = false;
            };
        }

        function canSave() {
            return !vm.isSaving;
        };
        
        function loadTransactionsToApprove() {

            var isbillerview = $routeParams.txntyp === "B";

            batchApproveService.init();
            vm.transactions = batchApproveService.getTransactionsToApprove(isbillerview);

            vm.transactions.forEach(function (t) {
                vm.subTotalAmount += t.amount;
            });

            var transactionStatusIdFilter = 2;

            var listFiltered = _.filter(vm.transactions, function (t) {
                return t.transactionStatusId === transactionStatusIdFilter;
            });

            vm.transactions = listFiltered;


            return vm.transactions;
            // return datacontext.getTransactionById(id, setTransactinInfoDelegate);
        }
            
        //YCR 02/27/2014
        function validation() {
            var error = 0;

            //Transaction type
            if (!$.isEmptyObject(vm.selectedattachmenttype)) {
                vm.typeIsValid = true;
            }
            else {
                vm.typeIsValid = false;
                error++;
            };

            if (error > 0) {
                logError('Please select an attachment type', 'error');
                vm.isValid = false;
                return false;
            }
            return true;;
        }

        function doChageStatusTo(transaction, newstatus) {

            datacontext.changeTransactionStatusTo(transaction.id, newstatus)
            .then(changestatusSuccess, changestatusfailed);
            function changestatusSuccess() {
              
                //05/29/2014 Raise Event for scopes listening/subscribed IIFE
                $rootScope.$broadcast('txnstatuschanged', { value: { id: transaction.id, newstatus: newstatus } });
              
                loadTransactionInfo($routeParams.id);
            }
            function changestatusfailed(error) {
                logError(error, 'error');

            }
        }              

        function selectPaymentMethod(paymentMethod) {
            switch (paymentMethod) {
                case 1:
                    vm.selectedPaymentMethod = '(PayAnyBiz Credit)';
                    vm.selectedPaymentId = 1;                  
                    break;
                case 2:
                    vm.selectedPaymentMethod = '(Next Day Pay)';                
                    vm.selectedPaymentId = 2;                   
                    break;
                case 3:
                    vm.selectedPaymentMethod = '(Same Day Pay)';
                    vm.selectedPaymentId = 3;                 
                    break;
                case 4:
                    vm.selectedPaymentMethod = '(Credit Card)';
                    vm.selectedPaymentId = 4;                  
                    break;
            }
        }

        function nextTab(tabIndex) {
            vm.selectedTab = tabIndex;

            if (tabIndex == 1) {
                if (vm.selectedPaymentId == 1) {
                    vm.fee = vm.subTotalAmount * 0.02;
                    vm.grandTotal = vm.subTotalAmount + vm.fee;
                }
                else {
                    vm.fee = vm.transactions.length * 2;
                    vm.grandTotal = vm.subTotalAmount + vm.fee;
                }
            }

            if (vm.selectedPaymentId == 3) {
                vm.dateToPrint = vm.proccessingDate;
            }
            else {
                vm.dateToPrint = toBePaid();
            }

        }
        
        function getNumberText(val) {
            var arr = [],
                   str = '',
                   i = 0,
                   result = '';



            if (val.length === 0) {
                result = 'Please type a number into the text-box.';
                return result;
            }
            val = parseInt(val, 10);
            if (isNaN(val)) {
                result = 'Invalid Amount.';
                return result;
            }
            while (val) {
                arr.push(val % 1000);
                val = parseInt(val / 1000, 10);
            }
            while (arr.length) {
                str = (function (a) {
                    var x = Math.floor(a / 100),
                        y = Math.floor(a / 10) % 10,
                        z = a % 10;

                    return (x > 0 ? numer2text.ones[x] + ' hundred ' : '') +
                           (y >= 2 ? numer2text.tens[y] + ' ' + numer2text.ones[z] : numer2text.ones[10 * y + z]);
                })(arr.shift()) + numer2text.sep[i++] + str;
            }
            result = str;
            return result;

        }

        function printInvoice() {
            var originalContents,
                popupWin,
                brand,
                printContents;

        
          return  printContents = document.getElementById("invoice").innerHTML,
            originalContents = document.body.innerHTML,
            popupWin = window.open(),
            brand = 'Test',
            popupWin.document.open(),
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="http://test.payanybiz.com/styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"),
            popupWin.document.close();
        }

        function open($event, datepickerName) {

            switch (datepickerName) {
                case 'proccessingDateOpened':
                    vm.proccessingDateOpened = !0
                    break;
                case 'toBePaidDateOpened':
                    vm.toBePaidDateOpened = !0
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

        function toBePaid()
        {
            var tomorrow = new Date();
            tomorrow.setDate(vm.proccessingDate.getDate() + 1);      
            return tomorrow;
        }

        //YCR 10-22-2014
        function sendEmail(transactions, notificationType) {

            var txnIds = [];

            transactions.forEach(function (x) {
                txnIds.push(x.id);
            });

            var printContents = document.getElementById("invoice").innerHTML;


            var emailBodyHTML = '<html><head><link rel="stylesheet" type="text/css" href="http://test.payanybiz.com/styles/main.css" /></head><body >' + printContents + "</html>";

            var emailObj = {emailTemplate: 0, transactionId: transactions[0].id, emailTransactionIds: txnIds, notificationType: notificationType, notifyPayorId: vm.currentcustomer.id, emailBodyHTML: emailBodyHTML };
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