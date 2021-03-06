﻿(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'payAnyBizTemplateCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
         ['common',
         'config',
         '$route', '$routeParams',
         '$location',
         '$resource',
         '$scope',
         'bootstrap.dialog',
         'datacontext', payAnyBizTemplateCtrl]);

    function payAnyBizTemplateCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        bsDialog,
        datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;       
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.title = 'ALUKO....';
        vm.cancel = cancel;


        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;

            if ($routeParams.id) {
                common.activateController([templateLoadFn()], controllerId)
                  .then(function () { log('Template PayAnyBiz Activated View'); });
            }
            else {
                return vm.title;
            }

        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }
        //Load Function usually used to load data
        function templateLoadFn() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }
    }
})();
