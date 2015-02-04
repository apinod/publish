//YCR-06-19-2014
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'billerTmpltCtrl';

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
         'datacontext', 'logger', billerTmpltCtrl]);

    function billerTmpltCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        bsDialog,
        datacontext, logger) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;

        var keyCodes = config.keyCodes;

        var validator = common.validator.validateUser();
        vm.validator = validator;

        // Bindable properties and functions are placed on vm.
        vm.title = 'Biller Detail';
        vm.save = save;
        vm.cancel = cancel;
        vm.biller = {};
        vm.goToDashboard = goToDashboard;
        vm.goToUserSettings = goToUserSettings;
        vm.hasChanges = hasChanges;
        vm.currentcustomer = {};

        vm.isSaving = false;
        vm.hasChanges = hasChanges;
        vm.saved = false;
        var canceldialogVisible = false;

        //YCR 08/28/2014
        vm.cities = [];
        vm.selectedCity = {};
        vm.states = [];
        vm.selectedState = {};
        vm.countries = [];
        vm.selectedCountry = {};


        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            var id = $routeParams.id;

            common.activateController([loadLookups(), loadBillerInfo(id)], controllerId)
                  .then(function () { });

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
       
        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }

        function hasChanges() {
            return datacontext.hasUserChanges();
        }

        function canSave() {
            return vm.hasChanges() && !vm.isSaving;
        };

        function goToDashboard() {
            if (!canceldialogVisible) {
                var url = '/' + vm.returnTo;
                $location.path(url);
            }
        };

        function goToUserSettings() {
            if (!canceldialogVisible) {
                var url = '/userSettings';
                $location.path(url);
            }
        };

        function validation() {
            //TODO

            return true;
            //var result = vm.validator.isValid(vm.user, vm.validator.validateObject);

            //if (!result.isValid) {
            //    logger.logError('Please check required fields', 'error');
            //}
            //return result.isValid;
        }

        //Load Function usually used to load data
        function loadBillerInfo(id) {
            return datacontext.getBillerById(id, setBillerInfoDelegate);;
        }

        function setBillerInfoDelegate(fectchedData) {
            //This delegate is needed to sync. breeze fetch data promise with angular $scope $diggest
            //Solution delegate function setTransactinInfo() will attend the success delegate 
            //of breeze.fetchEntityByKey() asynch. method.
            vm.biller = fectchedData.entity;
            if (vm.biller) {
                vm.selectedCity = vm.biller.city;
                vm.selectedState = vm.biller.state;
                vm.selectedCountry = vm.biller.country;


            }
            return vm.biller;
        }

        function loadLookups() {
            
            vm.cities = datacontext.getCitiesLookup();
       
            vm.states = datacontext.getStatesLookup();
        
            vm.countries = datacontext.getCountriesLookup();
           
            vm.customers = datacontext.getCustomersLookup();
            vm.currentcustomer = datacontext.getCurrentCustomer();
        }

        $scope.$on('$locationChangeStart', function (event, next, current) {

            if (canceldialogVisible) {
                event.preventDefault();
                return;
            }
            if (!vm.saved) {
                canceldialogVisible = true;
                var dlg = bsDialog.confirmationDialog('Please Confirm', 'Cancel ' + vm.title + '?');
                dlg.then(
                    //Ok Button
                    function (btn) {
                        canceldialogVisible = false;
                        vm.saved = true;
                        datacontext.cancelChanges();
                        $location.path(next);
                        return;
                    },
                    //Cancel Button (Not needed in this case, since not processed)
                   function (btn) {
                       canceldialogVisible = false;
                   });
                event.preventDefault();

            }
        });


    }
})();
