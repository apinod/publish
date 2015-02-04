(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'userProfileCtrl';

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
         'datacontext',
         'logger',
         userProfileCtrl]);

    function userProfileCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        bsDialog,
        datacontext,
        logger) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var validator = common.validator.validateUser();
        vm.validator = validator;
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.title = '';
        vm.save = save;
        vm.cancel = cancel;      

        vm.user = {};
        
        vm.lockPassword = $scope.main.lockPassword;
        vm.passIsEmpty = false;

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            //var currentUser = datacontext.getCurrentUser();
            common.activateController([loadCurrentUserInfo()], controllerId)
                 .then(function () { });

        }

        //Load Function usually used to load data
        //JRB 11/09/2014
        function loadCurrentUserInfo() {
            return datacontext.getUserProfile(setUserInfoDelegate);
        }

        //JRB 11/09/2014
        function setUserInfoDelegate(fectchedData) {
            //This delegate is needed to sync. breeze fetch data promise with angular $scope $diggest
            //Solution delegate function setTransactinInfo() will attend the success delegate 
            //of breeze.fetchEntityByKey() asynch. method.
            vm.user = datacontext.getUserInfoEnt(fectchedData);
            return vm.user;
        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }

        function save() {
            if (validation()) {

                vm.isSaving = true;
                vm.showLoading = true;
                datacontext.saveChanges().fin(complete);
            }

            function complete() {
                vm.isSaving = false;
                vm.showLoading = false;
            };
        }
      
        function validation() {

            var result = vm.validator.isValid(vm.user, vm.validator.validateObject);

            if (!result.isValid) {
                logger.logError('Please check required fields', 'error');
            }
            return result.isValid;
        }


    }
})();

