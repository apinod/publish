(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'payorListCtrl';

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
         'datacontext', payorListCtrl]);

    function payorListCtrl(common,
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
        vm.title = 'payor List';
        vm.save = save;
        vm.cancel = cancel;
        vm.payors = [];

        vm.toggleDetail = toggleDetail;       

        $routeParams.id = 0;
        var canceldialogVisible = false;
        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {
            if (!datacontext.validSession())
                return;

                common.activateController([payorLoadFn()], controllerId)
                  .then(function () { });        

        }

        function save() {
            canceldialogVisible = false;            
        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }

        function toggleDetail(payor) {
            if (!payor) { return; }
            var visible = !payor.detailsVisbile;
            $routeParams.id = payor.id;
            vm.payor = payor;
            vm.idRequested = payor.id;
            if (!visible) {
                var divid = '#' + payor.id;
                $(divid).remove();
            }
            payor.detailsVisbile = visible;
          
        };

        //Load Function usually used to load data
        function payorLoadFn() {

            return datacontext.getPayors(true, 1, 20, null, null, null, null).then(function (data) {

                vm.payors = data;
            });
             
        }
      
    }
})();
