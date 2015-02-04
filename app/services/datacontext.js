(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['$q', 'entityManagerFactory', 'model', 'logger', '$location', datacontext]);

    function datacontext($q, emFactory, model, logger, $location) {
        var Predicate = breeze.Predicate;
        var EntityQuery = breeze.EntityQuery;
        var entityNames = model.entityNames;
        var manager = emFactory.newManager();
        var primePromise;
        var txnCount = {};


        //JRB 12/28/2013
        manager.enableSaveQueuing(true);

        //JRB 5/24/2014
        manager.hasChangesChanged.subscribe(function (eventArgs) {
            storeMeta.changedData.transactions = eventArgs.hasChanges;
        });

        //YCR 6/20/2014
        manager.hasChangesChanged.subscribe(function (eventArgs) {
            storeMeta.changedData.users = eventArgs.hasChanges;
        });

        //JRB 12/15/2013
        var lookupCachedData = {};

        var storeMeta = {
            isLoaded: {
                transactions: false,
                users: false
            },
            changedData: {
                transactions: false,
                users: false
            }
        };

        //JRB 12/29/2013
        var transactionStatuses = {
            PENDING: 1,
            VERIFIED: 2,
            APPROVED: 3,
            DISPUTED: 4
        };

        var service = {
            addNewTransaction: addNewTransaction,
            addTransactionAddtionalRefNbr: addTransactionAddtionalRefNbr,
            addAttchment: addAttchment,
            addNewUser: addNewUser,
            addNewBiller: addNewBiller,
            addNewPayor: addNewPayor,
            addRelation: addRelation,
            //JRB 05/24/2014
            cancelChanges: cancelChanges,
            changeSeletecedTransactionStatusTo: changeSeletecedTransactionStatusTo,
            changeTransactionStatusTo: changeTransactionStatusTo,
            //
            getTransactions: getTransactions,
            getTransactionById: getTransactionById,
            addTransactionDispute: addTransactionDispute,
            getTransactionByIdLocally: getTransactionByIdLocally,
            getTransactionByIdFromServer: getTransactionByIdFromServer,
            getTransactionsCount: getTransactionsCount,
            getFilteredCount: getFilteredCount,
            getCountsForEachStatus: getCountsForEachStatus,
            getTransactionCatrgoriesLookup: getTransactionCatrgoriesLookup,
            getTransactionTypesLookup: getTransactionTypesLookup,
            getTransactionStatusLookup: getTransactionStatusLookup,
            getCustomersLookup: getCustomersLookup,
            getCurrentCustomer: getCurrentCustomer,
            getDisputeReasonLookup: getDisputeReasonLookup,
            getDisputeCategoryLookup: getDisputeCategoryLookup,
            getCitiesLookup: getCitiesLookup, //YCR 08/28/2014
            getStatesLookup: getStatesLookup, //YCR 08/28/2014
            getCountriesLookup: getCountriesLookup, //YCR 08/28/2014
            getPayorTotalSelectedAmount: getPayorTotalSelectedAmount,
            getTransactionRelatedNumbers: getTransactionRelatedNumbers,
            getTransactionDisputeInfo: getTransactionDisputeInfo,
            getTransactionHistory: getTransactionHistory,
            getAttachments: getAttachments,
            getTransactionBatchToDispute: getTransactionBatchToDispute, //JRB 05/25/2014.
            getTransactionBatchToApprove: getTransactionBatchToApprove,
            getStatusDescription: getStatusDescription, //JRB 05/29/2014 
            getUsers: getUsers,
            getUserById: getUserById,
            getBillerById: getBillerById,
            getBillers: getBillers,
            getPayors: getPayors,
            getNextTxnNumber: getNextTxnNumber,
            //
            hasTransactionChanges: hasTransactionChanges,
            hasUserChanges: hasUserChanges,
            //
            postTransactionSelectedValue: postTransactionSelectedValue,
            prime: prime,
            getTxnCount: getTxnCount,
            primeTxnCount: primeTxnCount,

            validSession: validSession,

            //05/25/2014
            rejectchanges: rejectchanges,
            //
            //JRB 09/09/2014 (C#20140817-1)
            removeTransactionAddtionalRefNbr: removeTransactionAddtionalRefNbr,
            //
            saveChanges: saveChanges,
            //
            transactionStatuses: transactionStatuses,
            getCurrentUser: getCurrentUser,
            //JRB 11/09/2014
            getUserProfile: getUserProfile,
            getUserInfoEnt: getUserInfoEnt,
            //YCR 11/11/2014
            getTransactionComments: getTransactionComments,
            addTxnComment: addTxnComment,
            getTasks: getTasks,
            addTask: addTask,
            removeTask: removeTask,

            //ANGEL
            test: test
        };

        return service;

        function hasTransactionChanges() {
            return storeMeta.changedData.transactions;
        }

        //YCR 06/20/2014
        function hasUserChanges() {
            return storeMeta.changedData.users;
        }

        function getTransactions(forceRemote, page, size, isbillerview, filtersValue, statusfiltervalue, selectionfiltervalue, orderBy) {
            var orderBy = _getTransactionSorting(orderBy);

            // Only return a page worth of attendees
            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;

            var predicate = _getTransactionViewPredicate(isbillerview);

            //YCR 04/2014 Prepare All Filters
            predicate = _getTransactionFilters(filtersValue, predicate)
            //if (filtersValue) {
            //    predicate = predicate.and(_transNumberPredicate(numberfiltervalue));
            //}
            if (statusfiltervalue) {
                predicate = predicate.and(_getTransactionStatusPredicate(statusfiltervalue));
            }

            // Load all transactions to cache via remote query
            //JRB 12/14/2013
            return EntityQuery.from('Transactions')
                .where(predicate)
                .orderBy(orderBy)
                .toType(entityNames.transaction)
                .take(take).skip(skip)
                .using(manager)
                .execute()
                .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {

                _areTransactionsLoaded(true);
                var predicate = _getTransactionViewPredicate(isbillerview);


                //YCR 04/2014 Prepare All Filters
                predicate = _getTransactionFilters(filtersValue, predicate)
                //if (filtersValue) {
                //    predicate = predicate.and(_transNumberPredicate(numberfiltervalue));
                //}
                if (statusfiltervalue) {
                    predicate = predicate.and(_getTransactionStatusPredicate(statusfiltervalue));
                }

                ////JRB 01/26/2014
                if (selectionfiltervalue) {
                    predicate = predicate.and(_getTransactionSelectionPredicate(true));
                }

                var transactionlist = EntityQuery.from(entityNames.transaction)
                   .where(predicate)
                   .select("id, recordType, biller.legalName, payor.legalName, number, dueDate, amount, bizArea.bizAreaDescription, transactionType.description,transactionType.id, transactionStatus.description, relatedNumber, payorRefNumber, selected, departureDate, arrivalDate, description, disputedAmount, transactionStatus.id, attachment")
                   .orderBy(orderBy)
                   .take(take).skip(skip)
                   .using(manager)
                   .executeLocally();
                return transactionlist;

            }

            function getByPage(filtersValue) {

                //JRB 12/14/2013 - 05/25/2014

            }
        }

        // YCR 06/19/2014
        function getUsers(forceRemote, page, size, filtersValue, selectionfiltervalue, orderBy) {
            var orderBy = _getUserSorting(orderBy);
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (_areUsersLoaded() && !forceRemote) {
                // Get the page of Users from local cache
                return $q.when(getByPage(filtersValue));
            }

            return EntityQuery.from('Users')
                .orderBy(orderBy)
                .toType(entityNames.user)
                .using(manager)
                .execute()
                .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {

                _areUsersLoaded(true);
                return getByPage(filtersValue);
            }

            function getByPage(filtersValue) {
                var predicate = _getUserViewPredicate();
                predicate = _getUserFilters(filtersValue, predicate)
                var userlist = EntityQuery.from(entityNames.user)
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(manager)
                    .executeLocally();
                return userlist;
            }
        }

        //JRB 11/09/2014
        function _getUserInfoById(id, userloadedDelagate) {
            var predUsr = breeze.Predicate.create("id", "==", id);
            return EntityQuery.from("Users")
               .where(predUsr)
               .toType(entityNames.user)
               .using(manager)
               .execute()
               .to$q(userloadedDelagate, _queryFailed);
        }

        //YCR 08-08-2014
        //JRB 11/09/2014
        function getUserById(id, userloadedDelagate) {
            var usr = manager.getEntityByKey(entityNames.user, id);
            if (usr != null) {
                return userloadedDelagate(usr);
            }
            return _getUserInfoById(id, userloadedDelagate);
        }

        //JRB 11/09/2014
        function getUserInfoEnt(fetchedData) {
            if (fetchedData.results) {
                return fetchedData.results[0];
            }
            return fetchedData;
        }

        //JRB 11/09/2014
        function getUserProfile(userloadedDelagate) {
            var id = getCurrentUser().currentUserId;
            getUserById(id, userloadedDelagate);
        }

        //YCR 08/22/2014
        function getBillerById(id, billerloadedDelagate) {
            return manager.fetchEntityByKey(entityNames.customer, id, true)
            .to$q(billerloadedDelagate, _queryFailed);
        }

        // YCR 08/11/2014
        function getBillers(forceRemote, page, size, filtersValue, selectionfiltervalue, orderBy) {
            var orderBy = _getBillerSorting(orderBy);
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            var predicate = _getBillerViewPredicate();

            predicate = _getBillerFilters(filtersValue, predicate)

            //if (_areBillersLoaded() && !forceRemote) {
            //    // Get the page of Users from local cache
            //    return $q.when(getByPage(filtersValue));
            //}

            return EntityQuery.from('Billers')
                .where(predicate)
                .orderBy(orderBy)
                .toType(entityNames.customer)
                .using(manager)
                .execute()
                .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {
                _areBillersLoaded(true);
                return getByPage(filtersValue);
            }

            function getByPage(filtersValue) {
                var predicate = _getBillerViewPredicate();


                predicate = _getBillerFilters(filtersValue, predicate)

                var billerList = EntityQuery.from(entityNames.customer)
                    .where(predicate)
                    .select('id, legalName, dba, tin, address, zipPostal, phone, fax, email, url, oFACStatus, registrationStatus, city.name, country.name, state.name, active')
                    //.expand('City')
                    //.expand('Country')
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(manager)
                    .executeLocally();
                return billerList;
            }

        }

        // YCR 08/11/2014
        function getPayors(forceRemote, page, size, filtersValue, selectionfiltervalue, orderBy) {
            var orderBy = _getPayorSorting(orderBy);
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (_arePayorsLoaded() && !forceRemote) {
                // Get the page of Users from local cache
                return $q.when(getByPage(filtersValue));
            }

            return EntityQuery.from('Payors')
                .orderBy(orderBy)
                .toType(entityNames.customer)
                .using(manager)
                .execute()
                .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {
                _arePayorsLoaded(true);
                return getByPage(filtersValue);
            }

            function getByPage(filtersValue) {
                var predicate = _getBillerViewPredicate();


                predicate = _getBillerFilters(filtersValue, predicate)

                var payorList = EntityQuery.from(entityNames.customer)
                    .where(predicate)
                    .select('id, legalName, dba, tin, address, zipPostal, phone, fax, email, url, oFACStatus, registrationStatus, city.name, country.name')
                    //.expand('City')
                    //.expand('Country')
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(manager)
                    .executeLocally();
                return payorList;
            }
        }

        //JRB 01/26/2014
        function getTransactionByIdLocally(id) {
            return manager.getEntityByKey(entityNames.transaction, id);
        }

        //JRB 12/15/2013
        function getTransactionById(id, transactionloadedDelagate) {
            return manager.fetchEntityByKey(entityNames.transaction, id, true)
            .to$q(transactionloadedDelagate, _queryFailed);
        }

        //YCR 11/10/2014
        function getTransactionByIdFromServer(id, transactionloadedDelagate) {
            return manager.fetchEntityByKey(entityNames.transaction, id, false)
            .to$q(transactionloadedDelagate, _queryFailed);
        }

        //JRB 02/01/2014
        function getTransactionRelatedNumbers(selectedTransaction, transrelnumbersloadedDelegate) {
            return selectedTransaction
                .entityAspect.loadNavigationProperty("transactionRelatedNumbers")
                .to$q(transrelnumbersloadedDelegate, _queryFailed);
        }

        //YCR 04/03/2014
        function getTransactionHistory(selectedTransaction, transactionHistoryDelegate) {
            return selectedTransaction
                .entityAspect.loadNavigationProperty("transactionHistory")
                .to$q(transactionHistoryDelegate, _queryFailed);
        }


        //YCR 04/03/2014
        function getAttachments(selectedTransaction, attachmentDelegate) {
            return selectedTransaction
                .entityAspect.loadNavigationProperty("attachment")
                .to$q(attachmentDelegate, _queryFailed);;
        }

        //JRB 03/30/2014
        function getTransactionDisputeInfo(selectedTransaction, transdisputeloadedDelegate) {
            return selectedTransaction
                .entityAspect.loadNavigationProperty("transactionDisputeDetails")
                .to$q(transdisputeloadedDelegate, _queryFailed);;
        }

        //YCR 06/20/2014
        function addTxnComment(initvalues) {
            var comment = manager.createEntity(entityNames.transactionComment, initvalues);
            return comment;
        }
        //YCR 11/11/2014
        function getTransactionComments(selectedTransaction, transCommentsloadedDelegate) {
            var predicate = _getTxnCommentPredicate(selectedTransaction.id); 

            return EntityQuery.from('TransactionComments')
                .where(predicate)
                .expand('User')
                .orderBy('id desc')
                .toType(entityNames.transactionComment)
                .using(manager)                
                .execute()
                .to$q(transCommentsloadedDelegate, _queryFailed);          
        }

       

        //YCR 11/13/2014
        function getTasks() {
            var predicate = _getTaskPredicate();

          return  EntityQuery.from('Tasks')
                .where(predicate)
                .expand('User')
                .orderBy('id desc')
                .toType(entityNames.pabTask)
                .using(manager)
                .execute()
                .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {
              
                return data.results;
            }
        }


        //YCR 11/13/2014
        function addTask(initvalues) {         
            var task = manager.createEntity(entityNames.pabTask, initvalues);         
            //Add new entity to the local cache
            manager.addEntity(task);        
            //Refresh VM with the updated Entity cache
            return manager.getEntities(entityNames.pabTask);
        }

        //YCR 11/13/2014 
        function removeTask(task) {
            manager.detachEntity(task);
            var retval = manager.getEntities(entityNames.pabTask);
            if (task.id > 0) {
                var delObj = manager.createEntity(entityNames.pabTask,
                            { id: task.id },              // use initializer to set the key
                              breeze.EntityState.Deleted);  // creates the entity in the Deleted state
            }
            return retval;
        }



      

      
        

        //12/26/2013
        function addNewTransaction(initvalues) {
            var txn = manager.createEntity(entityNames.transaction, initvalues);
            return txn;
        }

        //YCR 06/20/2014
        function addNewUser(initvalues) {
            var user = manager.createEntity(entityNames.user, initvalues);
            return user;
        }

        //YCR 06/20/2014
        function addNewBiller(initvalues) {
            var biller = manager.createEntity(entityNames.customer, initvalues);
            return biller;
        }
        //YCR 09/03/2014
        function addNewPayor(initvalues) {
            var payor = manager.createEntity(entityNames.customer, initvalues);
            return payor;
        }

        //YCR 10/22/2014
        function addRelation(initvalues) {
            var relation = manager.createEntity(entityNames.customerRelation, initvalues);
            return relation;
        }

        function getTransactionsCount(isbillerview) {
            if (_areTransactionsLoaded()) {
                var viewpredicate = _getTransactionViewPredicate(isbillerview);
                return _getLocalEntityCount(entityNames.transaction, viewpredicate);
                //return $q.when(_getLocalEntityCount(entityNames.transaction, viewpredicate));
            }
            // Transactions aren't loaded; ask the server for a count.
            return EntityQuery.from('Transactions').take(0).inlineCount()
                .using(manager).execute()
                .to$q(_getInlineCount);
        }

        //JRB 12/29/2013
        function getFilteredCount(isbillerview, nameFilter) {
            var predicate = _getTransactionViewPredicate(isbillerview);
            if (nameFilter) {
                predicate = predicate.and(_transNumberPredicate(nameFilter));
            }
            return _getLocalEntityCount(entityNames.transaction, predicate);
        }

        //JRB 12/29/2013
        function getCountsForEachStatus(isbillerview) {
            var predicate = _getTransactionViewPredicate(isbillerview);
            return {
                TotalPending: _getLocalEntityCount(entityNames.transaction,
                    predicate.and(_getTransactionStatusPredicate(transactionStatuses.PENDING))),
                TotalApproved: _getLocalEntityCount(entityNames.transaction,
                    predicate.and(_getTransactionStatusPredicate(transactionStatuses.APPROVED))),
                TotalDisputed: _getLocalEntityCount(entityNames.transaction,
                    predicate.and(_getTransactionStatusPredicate(transactionStatuses.DISPUTED))),
                TotalVerified: _getLocalEntityCount(entityNames.transaction,
                    predicate.and(_getTransactionStatusPredicate(transactionStatuses.VERIFIED))),
            };
        }

        //JRB 12/15/2013
        function getTransactionCatrgoriesLookup() {
            return lookupCachedData.bizareas;
        }

        function getTransactionTypesLookup() {
            return lookupCachedData.transactiontypes;
        }

        function getTransactionStatusLookup() {
            return lookupCachedData.transactionstatuses;
        }

        function getStatusDescription(id) {
            var i = 0, len = lookupCachedData.transactionstatuses.length;
            for (; i < len; i++) {
                if (+lookupCachedData.transactionstatuses[i].id == +id) {
                    return lookupCachedData.transactionstatuses[i].description;
                }
            }
            return '';
        }

        //JRB 12/28/2013
        function getCustomersLookup() {
            return lookupCachedData.customers;
        }

        //JRB 03/29/2019
        function getDisputeReasonLookup() {
            return lookupCachedData.disputereasons;
        }

        //JRB 03/29/2019
        function getDisputeCategoryLookup() {
            return lookupCachedData.disputecategories;
        }

        //YCR 08/28/2014
        function getCitiesLookup() {
            return lookupCachedData.cities;
        }

        //YCR 08/28/2014
        function getCountriesLookup() {
            return lookupCachedData.countries;
        }

        //YCR 08/28/2014
        function getStatesLookup() {
            return lookupCachedData.states;
        }

        function getCurrentCustomer() {
            return lookupCachedData.currentcustomer;
        }

        //JRB 01/25/2014
        function postTransactionSelectedValue(txn) {
            //For Some reason Angular will not notify Breeze Entity about the unmapped property "selected" being changed 
            //I hate to do this: Work around until find a more elegant approach. change manually. :(
            var data = getTransactionByIdLocally(txn.id);
            if (data) {
                data.selected = txn.selected;
            };
        }

        //JRB 05/25/2014
        function getTransactionBatchToDispute(isbillerview) {
            var predicate = _getTransactionViewPredicate(isbillerview);
            var predicateForSelected = _getTransactionSelectionPredicate(true);
            return EntityQuery.from(entityNames.transaction)
                      .where(predicate.and(predicateForSelected))
                      .using(manager)
                      .executeLocally();
        }

        //YCR 10/31/2014
        function getTransactionBatchToApprove(isbillerview) {
            var predicate = _getTransactionViewPredicate(isbillerview);
            var predicateForSelected = _getTransactionSelectionPredicate(true);
            return EntityQuery.from(entityNames.transaction)
                      .where(predicate.and(predicateForSelected))
                      .using(manager)
                      .executeLocally();
        }

        //JRB 01/26/2014
        function _getSelectedTransactions(isbillerview) {
            var predicate = _getTransactionViewPredicate(isbillerview);
            var predicateForSelected = _getTransactionSelectionPredicate(true);
            var result = EntityQuery.from(entityNames.transaction)
                   //   .select("id, amount, number, ")                     //#I commented this select because for save the entity have mandatory fields like (Number, BizTypeId... etc)  YCR 08/080/2014  
                      .where(predicate.and(predicateForSelected))
                      .using(manager)
                      .executeLocally();
            return result;
        }

        //JRB 01/25/2014
        function getPayorTotalSelectedAmount() {
            if (!_areTransactionsLoaded) { return 0; }
            var seltxns = _getSelectedTransactions(false);
            if (seltxns && seltxns.length > 0) {
                var totamt = 0;
                seltxns.forEach(function (t) {
                    totamt += t.amount;
                });
                return totamt;
            }
            return 0;
        }

        function getBillerTotalSelectedAmount() {
            if (!_areTransactionsLoaded) { return 0; }
            var seltxns = _getSelectedTransactions(false);
            if (seltxns && seltxns.length > 0) {
                var totamt = 0;
                seltxns.forEach(function (t) {
                    totamt += t.amount;
                });
                return totamt;
            }
            return 0;
        }

        //JRB 01/26/2014
        function changeSeletecedTransactionStatusTo(isbillerview, newstatus) {
            var selectedtxns = _getSelectedTransactions(isbillerview);
            if ((!selectedtxns) || selectedtxns.length === 0) { return $q.when(null); } // Must return a promise 
            selectedtxns.forEach(function (txn) {
                var txnent = getTransactionByIdLocally(txn.id);
                if (txnent) {
                    txnent.transactionStatusId = newstatus;
                }
            });
            return saveChanges();
        }

        //JRB 03/08/2014
        function changeTransactionStatusTo(id, newstatus) {
            var txnent = getTransactionByIdLocally(id);
            if (txnent) {
                txnent.transactionStatusId = newstatus;
            }
            return saveChanges();
        }

        //JRB 02/02/2014
        function addTransactionAddtionalRefNbr(relObj) {
            var initvals = { transactionId: relObj.parentTxn.id, number: relObj.number, container: relObj.container, amount: relObj.amount };
            var refNbr = manager.createEntity(entityNames.transactionrelatednumber, initvals);
            //JRB 09/09/2014 (C#20140817-1)
            //Add new entity to the local cache
            manager.addEntity(refNbr);
            //JRB 09/09/2014 (C#20140817-1)
            //Refresh VM with the updated Entity cache
            return manager.getEntities(entityNames.transactionrelatednumber);
        }

        //JRB 09/09/2014 (C#20140817-1)
        function removeTransactionAddtionalRefNbr(relObj) {
            manager.detachEntity(relObj);
            var retval = manager.getEntities(entityNames.transactionrelatednumber);
            if (relObj.id > 0) {
                var delObj = manager.createEntity(entityNames.transactionrelatednumber,
                            { id: relObj.id },              // use initializer to set the key
                              breeze.EntityState.Deleted);  // creates the entity in the Deleted state

            }
            return retval;
        }

        //YCR
        function addAttchment(attchmentObj) {
            var initvals = { transactionId: attchmentObj.transactionId, description: attchmentObj.description, filePath: attchmentObj.filePath, viewableByOtherParty: attchmentObj.viewableByOtherParty };
            var attachment = manager.createEntity(entityNames.attachment, initvals);
            return attachment;
        }


        //JRB 03/30/2014
        function addTransactionDispute(dispObj) {
            if (dispObj.parentTxn) {
                var initvals = {
                    transactionId: dispObj.parentTxn.id, disputeReasonId: dispObj.disputeReasonId,
                    disputeCategoryId: dispObj.disputeCategoryId, description: dispObj.description
                };
                var newdisp = manager.createEntity(entityNames.transactiondisputedetail, initvals);
            }
            return newdisp;
        }

        function saveChanges(extsaveSucceeded, extsaveFailed) {
            var successfn = extsaveSucceeded ? extsaveSucceeded : saveSucceeded;
            var failfn = extsaveFailed ? extsaveFailed : saveFailed;
            return manager.saveChanges()
            .then(successfn)
            .fail(failfn);

            function saveSucceeded(saveResult) {
                //JRB 05/25/2014
                storeMeta.changedData.transactions = false;
                //JRB 06/20/2014
                storeMeta.changedData.users = false;
                logger.logSuccess('Saved data successfully', saveResult, true);
                primeTxnCount();
                //JRB 05/25/2014
                return true;
            }

            function saveFailed(error) {
                var msg = 'save failed: ' + error.message;
                logger.logError(msg);
                error.message = msg;
                throw error;
            }
        };

        //JRB 05/25/2014
        function cancelChanges() {
            manager.rejectChanges();
        }

        //JRB 05/25/2015
        function rejectchanges(ent) {
            ent.entityAspect.rejectChanges();
        }

        function _transNumberPredicate(filterValue) {
            return Predicate.create('number', 'contains', filterValue);
        }

        function _getTransactionViewPredicate(isbillerview) {
            var custprop = isbillerview ? "billerId" : "payorId";
            return breeze.Predicate.create(custprop, "eq", lookupCachedData.currentcustomer.id);
        }

        function _getUserViewPredicate() {
            var custprop = "customerId";
            return breeze.Predicate.create(custprop, "eq", lookupCachedData.currentcustomer.id);
        }

        function _getTxnCommentPredicate(id) {
            var custprop = "transactionId";
            return breeze.Predicate.create(custprop, "eq", id);
        }
        //YCR 11/13/2014
        function _getTaskPredicate() {
            var custprop = "userId";
            return breeze.Predicate.create(custprop, "eq", lookupCachedData.currentUser.currentUserId);
        }

        function _getBillerViewPredicate() {
            //TODO
            var custprop = "id";
            return breeze.Predicate.create(custprop, "!=", lookupCachedData.currentcustomer.id);
        }


        function _getTransactionStatusPredicate(statusid) {
            return breeze.Predicate.create("transactionStatusId", "eq", statusid);
        }

        //JRB 01/26/2014
        function _getTransactionSelectionPredicate(selection) {
            return breeze.Predicate.create("selected", "==", selection)
        }

        function _getLocalEntityCount(resource, predicate) {
            var entities = EntityQuery.from(resource)
                .where(predicate)
                .using(manager)
                .executeLocally();
            return entities.length;
        }

        function _getInlineCount(data) {
            return data.inlineCount;
        }

        function prime() {
            if (primePromise) return primePromise;

            primePromise = $q.all([getLookups()])
                .then(extendMetadata)
                .then(success);
            return primePromise;

            function success(data) {
                setLookups();
                // log('Primed the data');
            }

            function extendMetadata() {
                var metadataStore = manager.metadataStore;
                var types = metadataStore.getEntityTypes();
                types.forEach(function (type) {
                    if (type instanceof breeze.EntityType) {
                        set(type.shortName, type);
                    }
                });
                function set(resourceName, entityName) {
                    metadataStore.setEntityTypeForResourceName(resourceName, entityName);
                }
            }
        }

        function primeTxnCount() {
            return EntityQuery.from('TransactionCounters')
               .using(manager)
               .execute()
               .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {
                txnCount = data.results[0];
                return true;
            }

        }

        function getTxnCount() {
            return txnCount;
        }

        function validSession() {
            if (!lookupCachedData.currentcustomer) {
                var url = '/pages/lock-screen';
                $location.path(url)
                return;
            }

            return true;
        }

        //JRB 11/10/2014
        function getCurrentUser() {
            return lookupCachedData.currentUser;

        }

        //JRB 12/25/2013
        function setLookups(main) {

            if (!validSession())
                return;


            lookupCachedData.bizareas = _getAllLocal(entityNames.bizarea, 'bizAreaDescription');
            lookupCachedData.transactionstatuses = _getAllLocal(entityNames.transactionstatus, 'description');
            lookupCachedData.transactiontypes = _getAllLocal(entityNames.transactiontype, 'description');
            //JRB 03/29/2014
            lookupCachedData.disputereasons = _getAllLocal(entityNames.disputereason, 'description');
            lookupCachedData.disputecategories = _getAllLocal(entityNames.disputecategory, 'description');
            //JRB 12/28/2013 filter customers list to exclude current

            //YCR 08/28/2014
            lookupCachedData.cities = _getAllLocal(entityNames.city, 'name');
            lookupCachedData.states = _getAllLocal(entityNames.state, 'name');
            lookupCachedData.countries = _getAllLocal(entityNames.country, 'name');

            var pExcludeCurrent = breeze.Predicate.create("id", "ne", lookupCachedData.currentcustomer.id);
            lookupCachedData.customers = _getAllLocal(entityNames.customer, "legalName", pExcludeCurrent);

            //JRB 11/06/2014
            //lookupCachedData.currentUser = _getAllLocal(entityNames.user, "userName");
        }

        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager)
                .execute()
                .to$q(querySucceeded, _queryFailed);

            function querySucceeded(data) {
                lookupCachedData.currentcustomer = data.results[0].current;
                //JRB 11/06/2014
                lookupCachedData.currentUser = data.results[0].user;
                //log('Retrieved [Lookups]', data, true);
                return true;
            }
        }

        function _getAllLocal(resource, ordering, predicate) {
            return EntityQuery.from(resource)
                .orderBy(ordering)
                .where(predicate)
                .using(manager)
                .executeLocally();
        }

        function _queryFailed(error) {
            //var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
            var msg = 'PAB: Error retrieving data.' + error.message;
            logger.logError(msg);
            throw error;
        }

        function _areTransactionsLoaded(value) {
            return _areItemsLoaded('transactions', value);
        }

        function _areUsersLoaded(value) {
            return _areItemsLoaded('users', value);
        }

        function _areBillersLoaded(value) {
            return _areItemsLoaded('billers', value);
        }

        function _arePayorsLoaded(value) {
            return _areItemsLoaded('payors', value);
        }

        function _areItemsLoaded(key, value) {
            if (value === undefined) {
                return storeMeta.isLoaded[key]; // get
            }
            return storeMeta.isLoaded[key] = value; // set
        }

        //JRB 07/27/2014
        function _getColumnAndFilterPredicate(columnName, expression, value, valueEvalFnc) {
            if (!value || value.length == 0) {
                return null;
            }
            var valueEval = valueEvalFnc ? valueEvalFnc() : value;
            return Predicate.create(columnName, expression, valueEval);
        }

        function _getTransactionFilters(filtersValue, predicate) {
            if (!predicate) { return ''; }
            if (!filtersValue) { return predicate; }

            if (filtersValue.allCol.length > 0) {
                var allcolValFix = "'" + filtersValue.allCol.replace("'", "''") + "'";
                var predicate2 = _getColumnAndFilterPredicate('payor.legalName', 'contains', allcolValFix);
                predicate2 = predicate2.or(_getColumnAndFilterPredicate('bizArea.bizAreaDescription', 'contains', allcolValFix));
                predicate2 = predicate2.or(_getColumnAndFilterPredicate('transactionType.description', 'contains', allcolValFix));

                predicate2 = predicate2.or(_getColumnAndFilterPredicate('number', 'contains', allcolValFix));
                //  predicate2 = predicate2.or(Predicate.create('dueDate', 'eq', new Date(filtersValue.allCol) ));

                //JRB 08/03/2014
                if ($.isNumeric(filtersValue.allCol)) {
                    predicate2 = predicate2.or(Predicate.create('amount', 'eq', filtersValue.allCol));
                }
                predicate2 = predicate2.or(_getColumnAndFilterPredicate('relatedNumber', 'contains', allcolValFix));
                predicate2 = predicate2.or(_getColumnAndFilterPredicate('transactionStatus.description', 'contains', allcolValFix));
                predicate2 = predicate2.or(_getColumnAndFilterPredicate('payorRefNumber', 'contains', allcolValFix));
                predicate = predicate.and(predicate2);
                return predicate;
            }

            //JRB 07/27/2014
            var filterpredicates = [];
            filterpredicates.push(_getColumnAndFilterPredicate('payor.legalName', 'contains', filtersValue.payorCol, function () {
                return "'" + filtersValue.payorCol.replace("'", "''") + "'";
            }));

            filterpredicates.push(_getColumnAndFilterPredicate('bizArea.bizAreaDescription', 'contains', filtersValue.categoryCol, function () {
                return "'" + filtersValue.categoryCol.replace("'", "''") + "'";
            }));

            filterpredicates.push(_getColumnAndFilterPredicate('transactionType.description', 'contains', filtersValue.typeCol, function () {
                return "'" + filtersValue.typeCol.replace("'", "''") + "'";
            }));

            filterpredicates.push(_getColumnAndFilterPredicate('number', 'contains', filtersValue.numberCol, function () {
                return "'" + filtersValue.numberCol.replace("'", "''") + "'";
            }));

            filterpredicates.push(_getColumnAndFilterPredicate('dueDate', '>=', filtersValue.dueDateFromCol, function () {
                return new Date(moment(filtersValue.dueDateFromCol).year(), moment(filtersValue.dueDateFromCol).month(), moment(filtersValue.dueDateFromCol).date(), 0, 0, 0, 0);
            }));

            filterpredicates.push(_getColumnAndFilterPredicate('dueDate', '<', filtersValue.dueDateToCol, function () {
                return new Date(moment(filtersValue.dueDateToCol).year(), moment(filtersValue.dueDateToCol).month(), moment(filtersValue.dueDateToCol).date(), 0, 0, 0, 0);
            }));

            //if ($.isNumeric(filtersValue.amountCol)) {
            //    filterpredicates.push(_getColumnAndFilterPredicate('amount', 'eq', filtersValue.amountCol));
            //}

            filterpredicates.push(_getColumnAndFilterPredicate('relatedNumber', 'contains', filtersValue.relatedNbrCol, function () {
                return "'" + filtersValue.relatedNbrCol.replace("'", "''") + "'";
            }));

            filterpredicates.push(_getColumnAndFilterPredicate('transactionStatus.id', 'eq', filtersValue.statusCol));

            filterpredicates.push(_getColumnAndFilterPredicate('payorRefNumber', 'contains', filtersValue.payorRefCol, function () {
                return "'" + filtersValue.payorRefCol.replace("'", "''") + "'";
            }));

            angular.forEach(filterpredicates, function (fliterpred) {
                if (fliterpred) {
                    predicate = predicate.and(fliterpred);
                }
            });

            return predicate;
        }

        function _getUserFilters(filtersValue, predicate) {
            if (!predicate) { return ''; }
            if (!filtersValue) { return predicate; }
        }

        function _getBillerFilters(filtersValue, predicate) {
            if (!predicate) { return ''; }
            if (!filtersValue) { return predicate; }

            var filterpredicates = [];
            filterpredicates.push(_getColumnAndFilterPredicate('legalName', 'contains', filtersValue.legalNameCol, function () {
                return "'" + filtersValue.legalNameCol.replace("'", "''") + "'";
            }));
            //filterpredicates.push(_getColumnAndFilterPredicate('legalName', 'eq', filtersValue.legalNameCol, function () {
            //    return "'" + filtersValue.legalNameCol.replace("'", "''") + "'";
            //}));
            //filterpredicates.push(_getColumnAndFilterPredicate('legalName', 'eq', filtersValue.legalNameCol, function () {
            //    return "'" + filtersValue.legalNameCol.replace("'", "''") + "'";
            //}));

            angular.forEach(filterpredicates, function (fliterpred) {
                if (fliterpred) {
                    predicate = predicate.and(fliterpred);
                }
            });

            return predicate;
        }

        function _getTransactionSorting(orderBy) {

            // var result = "dueDate desc";
            //if (!orderBy)
            //{
            //    return result;
            //}
            var result = '';

            if (orderBy.dueDateSort > 0) {

                result = _getSortField('dueDate', orderBy.dueDateSort, result);
            }
            if (orderBy.payorSort > 0) {

                result = _getSortField('payor.legalName', orderBy.payorSort, result);
            }
            if (orderBy.categorySort > 0) {

                result = _getSortField('bizArea.bizAreaDescription', orderBy.categorySort, result);
            }
            if (orderBy.typeSort > 0) {

                result = _getSortField('transactionType.description', orderBy.typeSort, result);
            }
            if (orderBy.numberSort > 0) {

                result = _getSortField('number', orderBy.numberSort, result);
            }
            if (orderBy.amountSort > 0) {

                result = _getSortField('amount', orderBy.amountSort, result);
            }
            if (orderBy.relatedNbrSort > 0) {

                result = _getSortField('relatedNumber', orderBy.relatedNbrSort, result);
            }
            if (orderBy.statusSort > 0) {

                result = _getSortField('transactionStatus.description', orderBy.statusSort, result);
            }
            if (orderBy.payorRefSort > 0) {

                result = _getSortField('payorRefNumber', orderBy.payorRefSort, result);
            }

            if (result == '')
                result = 'id desc';

            return result;
        }

        function _getUserSorting(orderBy) {
            // var result = "dueDate desc";
            //if (!orderBy)
            //{
            //    return result;
            //}
            var result = '';
            if (result == '')
                result = 'id desc';
            return result;
        }

        function _getBillerSorting(orderBy) {
            var result = '';
            if (result == '')
                result = 'id desc';
            return result;
        }

        function _getPayorSorting(orderBy) {
            var result = '';
            if (result == '')
                result = 'id desc';
            return result;
        }

        function _getSortField(field, oderBy, result) {
            if (result.length > 0) {
                result += ', ' + field + ' ' + _getOrderToString(oderBy);
            }
            else {
                result += field + ' ' + _getOrderToString(oderBy);
            }
            return result;
        }

        function _getOrderToString(value) {
            if (value == 2)
                return 'desc';
            return '';
        }

        function _removeSort(field, result) {
            result = result.replace(", " + field + " desc", "");
            result = result.replace(field + " desc", "");
            result = result.replace(field, "");
            return result;
        }
        //YCR 9/12/2014
        function getNextTxnNumber(txn) {
            return txn.number + "-1";
        }

        //test
        function test(successcb, errorcb) {

            console.log('KOKO');
            var query = EntityQuery
                    .from("Test");

            var promise = manager.executeQuery(query).then(successcb).catch(errorcb);
            return promise;
        }
    }
})();