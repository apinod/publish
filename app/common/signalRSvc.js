(function () {
    'use strict';

    angular.module('app').factory('signalRSvc', function ($, $rootScope) {

        return {
            myPABHub: null,
            myConnetionHub: null,
            connectionActive : false,
            createConnection: function()
            {              
                this.myPABHub = $.connection.pABHub; 
                this.myConnetionHub = $.connection.hub;
            },
           
            registerMethodLockedTxn: function (callBack) {


                this.myPABHub.client.lockedTxn = callBack;
                

                ////Attaching a callback to handle lockedTxn client call
                //this.proxy.on('lockedTxn', function (id, value) {
                //    $rootScope.$apply(function () {
                //        callBack(id, value);
                //    });
                //});

                ////Attaching a callback to handle hubChangeStatus client call
                //this.proxy.on('hubChangeStatus', function (id, value) {
                //    $rootScope.$apply(function () {
                //        callBack(id, value);
                //    });                    
                //});

                ////Attaching a callback to handle hubChangeStatus client call
                //this.proxy.on('onConnected', function (id, userName, connectedUsers, currentMessage) {
                //    $rootScope.$apply(function () {
                //        callBack(id, userName, connectedUsers, currentMessage);
                //    });
                //});

                ////Attaching a callback to handle hubChangeStatus client call
                //this.proxy.on('onNewUserConnected', function (id, userName) {
                //    $rootScope.$apply(function () {
                //        callBack(id, userName);
                //    });
                //});
                                               
                
            },          
            lockTransaction: function (callback, txnId, value) {
                this.proxy.invoke('LockTxn', txnId, value);
            },
            changeStatusTxn: function (callback, txnId, value) {
                this.proxy.invoke('ChangeStatusTxn', txnId, value);
            },
            registerConnection: function (callback)
            {
                this.proxy.invoke('Connect');
            }
        }
    });
   

})();

