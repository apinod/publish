(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'model';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, model);

    function model() {
        // Define the functions and properties to reveal.
        //JRB 02/01/2014
        //JRB 03/29/2014
        var entityNames = {
            transaction: 'Transaction',
            bizarea: 'BizArea',
            city: 'City',
            country: 'Country',
            transactionstatus: 'TransactionStatus',
            transactiontype: 'TransactionType',
            customer: 'Customer',
            transactionrelatednumber: 'TransactionRelatedNumber',
            transactiondisputedetail: 'TransactionDisputeDetail',
            disputereason: 'DisputeReason',
            disputecategory: 'DisputeCategory',
            transactionHistory: 'TransactionHistory',
            attachment: 'TransactionAttachment',
            user: 'User',
            state: 'State',
            customerRelation: 'CustomerRelation',
            transactionComment: 'TransactionComment',
            pabTask: 'PABTask',

            permission: 'Permission'          

        };

        var service = {
            configureMetadataStore: configureMetadataStore,
            entityNames: entityNames
        };

        return service;

        //JRB 12/14/2013
        function configureMetadataStore(metadataStore) {
            registerTransaction(metadataStore);
            registerBizArea(metadataStore);
            registerTransactionStatus(metadataStore);
            registerTransactionType(metadataStore);
            registerCustomer(metadataStore);
            registerTransactionRelatedNumber(metadataStore);
            registerTransactionDisputeDetail(metadataStore);
            registerTransactionHistory(metadataStore);
            registerAttachment(metadataStore);
            registerUser(metadataStore);
            registerCity(metadataStore);
            registerCountry(metadataStore);
            registerState(metadataStore);
            registerCustomerRelations(metadataStore);
            registerTransactionComment(metadataStore);
            registerPABTask(metadataStore);

            registerPermission(metadataStore);
        }

        //#region Internal Methods       
        //Register Transaction Entity
        function registerTransaction(metadataStore) {
            metadataStore.registerEntityTypeCtor('Transaction', Transaction);
            function Transaction() {
                this.selected = false;
                this.detailsVisbile = false;
            }
        }

        //--------------------------------------------------------------------
        //JRB 12/14/2013 lookups - primes register in Breeze MetadataStorage
        //--------------------------------------------------------------------
        //BizAreas
        function registerBizArea(metadataStore) {
            metadataStore.registerEntityTypeCtor('BizArea', BizArea);
            function BizArea() { }
        }

        //Transaction Status
        function registerTransactionStatus(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionStatus', TransactionStatus);
            function TransactionStatus() { }
        }

        //Transaction Type
        function registerTransactionType(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionType', TransactionType);
            function TransactionType() { }
        }

        //JRB 12/25/2013
        //Transaction Type
        function registerCustomer(metadataStore) {
            metadataStore.registerEntityTypeCtor('Customer', Customer);
            function Customer() { }
        }

        //JRB 02/01/2014
        //Transaction Related Numbers
        function registerTransactionRelatedNumber(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionRelatedNumber', TransactionRelatedNumber);
            function TransactionRelatedNumber() { }
        }

        //JRB 03/29/2014
        function registerDisputeReason(metadataStore) {
            metadataStore.registerEntityTypeCtor('DisputeReason', DisputeReason);
            function DisputeReason() { }
        }

        //JRB 03/29/2014
        function registerDisputeCategory(metadataStore) {
            metadataStore.registerEntityTypeCtor('DisputeCategory', DisputeCategory);
            function DisputeCategory() { }
        }

        //JRB 03/29/2014
        function registerTransactionDisputeDetail(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionDisputeDetail', TransactionDisputeDetail);
            function TransactionDisputeDetail() { }
        }

        //YCR 04/03/2014
        function registerTransactionHistory(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionHistory', TransactionHistory);
            function TransactionHistory() { }
        }

        //YCR 04/03/2014
        function registerAttachment(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionAttachment', Attachment);
            function Attachment() { }
        }

        //YCR 06/19/2014
        function registerUser(metadataStore) {
            metadataStore.registerEntityTypeCtor('User', User);
            function User() {
             
            }
        }

        //YCR 08/28/2014
        function registerCity(metadataStore) {
            metadataStore.registerEntityTypeCtor('City', City);
            function City() { }
        }

        //YCR 08/28/2014
        function registerCountry(metadataStore) {
            metadataStore.registerEntityTypeCtor('Country', Country);
            function Country() { }
        }

        //YCR 08/28/2014
        function registerState(metadataStore) {
            metadataStore.registerEntityTypeCtor('State', State);
            function State() { }
        }

        //YCR 10/22/2014
        function registerCustomerRelations(metadataStore) {
            metadataStore.registerEntityTypeCtor('CustomerRelation', CustomerRelation);
            function CustomerRelation() { }
        }
        
        //YCR 11/11/2014
        function registerTransactionComment(metadataStore) {
            metadataStore.registerEntityTypeCtor('TransactionComment', TransactionComment);
            function TransactionComment() { }
        }
        //YCR 11/13/2014
        function registerPABTask(metadataStore) {
            metadataStore.registerEntityTypeCtor('PABTask', PABTask);
            function PABTask() { }
        }
        
        //ANGEL
        function registerPermission(metadataStore) {
            metadataStore.registerEntityTypeCtor('Permission', Permission);
            function Permission() { }
        }

        //#endregion
    }
})();