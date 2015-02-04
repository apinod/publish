//YCR-06-19-2014
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'testCtrl';

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
         '$modal',testCtrl]);

    function testCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        bsDialog,
        datacontext, logger,$modal) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;

        //vm.test = "COSA";

        vm.user = datacontext.getCurrentUser();

        datacontext.test(

            function (data) {
                vm.test = data.results[0];
                $scope.$apply();
                console.log(vm.test);
                logger.logSuccess('Access Granted');
            },

            function (error) {
                console.log(error);
                logger.logError('Access Denied:' + error);
            }
        );

        vm.show = function () {

        };

        //var getLogFn = common.logger.getLogFn;

        //var keyCodes = config.keyCodes;

        //var validator = common.validator.validateUser();
        //vm.validator = validator;

        //// Bindable properties and functions are placed on vm.
        //vm.title = 'New Biller';
        //vm.save = save;
        //vm.cancel = cancel;
        //vm.biller = {};
        //vm.goToDashboard = goToDashboard;
        //vm.goToUserSettings = goToUserSettings;
        //vm.hasChanges = hasChanges;
        //vm.currentcustomer = {};

        //vm.isSaving = false;
        //vm.hasChanges = hasChanges;
        //vm.saved = false;

        ////YCR 10/21/2014
        //vm.search = search;
        //vm.filterby = {
        //    legalNameCol: '',
        //    debitAccountCol: '',
        //    creditAccountCol: ''
        //};
        //vm.billers = [];
        //vm.clearFilter = clearFilter;
        //vm.link = link;


        //$routeParams.id = 0;
        //var canceldialogVisible = false;

        ////YCR 08/29/2014
        //vm.cities = [];
        //vm.selectedCity = {};
        //vm.states = [];
        //vm.selectedState = {};
        //vm.countries = [];
        //vm.selectedCountry = {};

        ////Call Controller Init Method
        //activate();

        ////Controller Init Method
        //function activate() {
        //    if (!datacontext.validSession())
        //        return;

        //    common.activateController([loadLookups()], controllerId)
        //      .then(function () { });

        //}

        //function save() {
        //    if (validation() && canSave()) {
        //        vm.isSaving = true;
        //        // datacontext.saveChanges().fin(complete);
        //        vm.currentcustomer = datacontext.getCurrentCustomer();

        //        vm.biller.cityId = vm.selectedCity.id;
               
        //        datacontext.saveChanges().fin(complete);

        //    };
        //    function complete() {
        //        vm.isSaving = false;             
        //    };
        //}

        //function hasChanges() {
        //    return datacontext.hasUserChanges();
        //}

        //function canSave() {
        //    return vm.hasChanges() && !vm.isSaving;
        //};

        //function goToDashboard() {
        //    if (!canceldialogVisible) {
        //        var url = '/' + vm.returnTo;
        //        $location.path(url);
        //    }
        //};

        //function goToUserSettings() {
        //    if (!canceldialogVisible) {
        //        var url = '/userSettings';
        //        $location.path(url);
        //    }
        //};
                
        //function validation() {
        //    return true;


        //    var result = vm.validator.isValid(vm.user, vm.validator.validateObject);

        //    if (!result.isValid) {
        //        logger.logError('Please check required fields', 'error');
        //    }
        //    return result.isValid;
        //}

        ////Load Function usually used to load data
        //function addNewBiller() {
        //    vm.showInsert = true;
        //    vm.currentcustomer = datacontext.getCurrentCustomer();
        //    var initBiller = { active: true, url: '_' };
        //    vm.biller = datacontext.addNewBiller(initBiller);
        //}
        
        //$scope.$on('$locationChangeStart', function (event, next, current) {

        //    if (canceldialogVisible) {
        //        event.preventDefault();
        //        return;
        //    }
        //    if (!vm.saved) {
        //        canceldialogVisible = true;
        //        var dlg = bsDialog.confirmationDialog('Please Confirm', 'Cancel ' + vm.title + '?');
        //        dlg.then(
        //            //Ok Button
        //            function (btn) {
        //                canceldialogVisible = false;
        //                vm.saved = true;
        //                datacontext.cancelChanges();
        //                $location.path(next);
        //                return;
        //            },
        //            //Cancel Button (Not needed in this case, since not processed)
        //           function (btn) {
        //               canceldialogVisible = false;
        //           });
        //        event.preventDefault();

        //    }
        //});
        
        //function loadLookups() {

        //    vm.cities = datacontext.getCitiesLookup();

        //    vm.states = datacontext.getStatesLookup();

        //    vm.countries = datacontext.getCountriesLookup();

        //    vm.customers = datacontext.getCustomersLookup();
        //    vm.currentcustomer = datacontext.getCurrentCustomer();
        //}

        ////YCR 10/21/2014 SEARCH REGION 
        //function search() {
        //    vm.billers = [];
           
        //    if (vm.filterby.legalNameCol || vm.filterby.debitAccountCol || vm.filterby.creditAccountCol )
        //    { billerLoadFn(); }
        //}

        //function clearFilter()
        //{
        //    vm.billers = [];
        //    vm.filterby = {
        //        legalNameCol: '',
        //        debitAccountCol: '',
        //        creditAccountCol: ''
        //    };
        //};

        //function billerLoadFn() {


        //    return datacontext.getBillers(true, 1, 20, vm.filterby, null, null, null).then(function (data) {
              
        //        vm.billers = data;
        //        vm.canInsert = data.length == 0;
              
        //    });

        //}

        //function cancel() {
           
        //}

        //function link(biller)
        //{
        //    var initRelation = { relation: 1, createdOn: new Date().toISOString(), modifiedOn: new Date().toISOString(), active: true, customerId: vm.currentcustomer.id, customer1Id: biller.id };
        //    var result = datacontext.addRelation(initRelation);

        //    if (result)
        //        save();

        //}

    }
})();
