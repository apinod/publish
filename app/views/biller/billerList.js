(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'billerListCtrl';

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
         'datacontext', billerListCtrl]);

    function billerListCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        bsDialog,
        datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        //var getLogFn = common.logger.getLogFn;
        // var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.title = 'Biller List';
        vm.save = save;
        vm.cancel = cancel;
        vm.billers = [];

        vm.toggleDetail = toggleDetail;

        $routeParams.id = 0;
        var canceldialogVisible = false;
        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {
            if (!datacontext.validSession())
                return;

            common.activateController([billerLoadFn()], controllerId)
           .then(function () { });

        }

        function save() {
            canceldialogVisible = false;
        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }

        function toggleDetail(biller) {
            if (!biller) { return; }
            var visible = !biller.detailsVisbile;
            $routeParams.id = biller.id;
            vm.biller = biller;
            vm.idRequested = biller.id;
            if (!visible) {
                var divid = '#' + biller.id;
                $(divid).remove();
            }
            biller.detailsVisbile = visible;

        };

        //Load Function usually used to load data
        function billerLoadFn() {

            return datacontext.getBillers(true, 1, 20, null, null, null, null).then(function (data) {

                vm.billers = data;
            });

        }

    }
})();
