(function () {
    'use strict';

    angular.module('common').factory('notification', ['$resource', notification]);

    function notification($resource) {
        var service = {           
            email: { send: sendEmail }
        };


        var transactionList = [];

        function sendEmail() {
            var send = $resource('/api/notification', {}, { sendEmail: { method: 'POST' } });

            return send;
        }

        return service;

    }

})();