(function () {
    'use strict';

    angular.module('common').factory('myResource', ['$resource', myResource]);

    function myResource($resource) {
        var service = {
         documents:  $resource('/api/uploading/', {}, { upload: { method: 'POST' }, getFiles: { method: 'GET' }})
        };

        return service;

    }

})();