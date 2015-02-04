//JRB 05/25/2014
(function () {
    'use strict';
    var serviceId = 'batchdisputeService';
    angular.module('app').factory(serviceId,
        ['datacontext', batchdisputeService]);

    function batchdisputeService(datacontext) {
        var disputes = [];
        var disputereasons = [];
        var disputecategories = [];

        var service = {
            cancelChanges: cancelChanges,
            getDisputeCategories: getDisputeCategories,
            getDisputeReasons: getDisputeReasons,
            getTransactionsToDispute: getTransactionsToDispute,
            haschanges: haschanges,
            init: init,
            saveChanges: saveChanges,
            removeDispute: removeDispute
        };

        return service;

        function init() {
            disputes = [];
            loadLookups();
        }

        function getDisputeCategories() {
            return disputecategories;
        }

        function getDisputeReasons() {
            return disputereasons;
        }

        function getTransactionsToDispute(isbillerview) {
            return loadTransactionsToDispute(isbillerview);
        }

        function loadLookups() {
            disputereasons = datacontext.getDisputeReasonLookup();
            disputecategories = datacontext.getDisputeCategoryLookup();
        }

        function loadTransactionsToDispute(isbillerview) {
            var seletedtxns = datacontext.getTransactionBatchToDispute(isbillerview);
            seletedtxns.map(function (txn) {
                txn.disputedAmount = txn.disputedAmount > 0 ? txn.disputedAmount : txn.amount;
                var result = datacontext.getTransactionDisputeInfo(txn,
                    function (fectchedData) {
                        if (fectchedData.results && fectchedData.results.length > 0) {
                            disputes.push(fectchedData.results[0]);
                        }
                        else {
                            var newdispute = datacontext.addTransactionDispute({ parentTxn: txn });
                            disputes.push(newdispute);
                        }
                    });
            });
            return disputes;
        }

        function removeDispute(dispute) {
            datacontext.rejectchanges(dispute.transaction);
            datacontext.rejectchanges(dispute);
            //dispute.transaction.entityAspect.rejectChanges();
            //dispute.entityAspect.rejectChanges();
            disputes = $.grep(disputes, function (value) {
                return value.id != dispute.id;
            });
            return disputes;
        }

        function haschanges() {
            return datacontext.hasTransactionChanges();
        }

        function saveChanges(additional, succeeded, failed) {
            disputes.map(function (dispute) {
                dispute.transaction.transactionStatusId = datacontext.transactionStatuses.DISPUTED;
                dispute.disputeReasonId = additional.resonId;
                dispute.disputeCategoryId = additional.categoryId;
                dispute.description = additional.description;
            });
            return datacontext.saveChanges(succeeded,failed);
        }

        function cancelChanges() {
            disputes = [];
            return datacontext.cancelChanges();
        }

    }
})();