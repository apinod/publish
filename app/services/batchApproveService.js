//YCR 10/31/2014
(function () {
    'use strict';
    var serviceId = 'batchApproveService';
    angular.module('app').factory(serviceId,
        ['datacontext', batchApproveService]);

    function batchApproveService(datacontext) {
        var txnToPay = [];
       

        var service = {
            cancelChanges: cancelChanges,  
            getTransactionsToApprove: getTransactionsToApprove,
            haschanges: haschanges,
            init: init,
            saveChanges: saveChanges,
            removeTxntoApprove: removeTxntoApprove
        };

        return service;

        function init() {
            txnToPay = [];           
        }

       

        function getTransactionsToApprove(isbillerview) {
            return loadTransactionsToApprove(isbillerview);
        }

     
        function loadTransactionsToApprove(isbillerview) {
            var seletedtxns = datacontext.getTransactionBatchToApprove(isbillerview);
            seletedtxns.map(function (txn) {
                txnToPay.push(txn);           
            });            
           
            return txnToPay;
        }

        function removeTxntoApprove(payment) {
            datacontext.rejectchanges(payment.transaction);
            datacontext.rejectchanges(payment);
            //dispute.transaction.entityAspect.rejectChanges();
            //dispute.entityAspect.rejectChanges();
            txnToPay = $.grep(txnToPay, function (value) {
                return value.id != payment.id;
            });
            return txnToPay;
        }

        function haschanges() {
            return datacontext.hasTransactionChanges();
        }

        function saveChanges(additional, succeeded, failed) {
            txnToPay.map(function (dispute) {
               
            });
            return datacontext.saveChanges(succeeded, failed);
        }

        function cancelChanges() {
            txnToPay = [];
            return datacontext.cancelChanges();
        }

    }
})();