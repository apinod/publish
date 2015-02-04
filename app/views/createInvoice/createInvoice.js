(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'createInvoiceCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$route', '$routeParams', createInvoiceCtrl]);

    function createInvoiceCtrl(common, config, datacontext, $route, $routeParams) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.title = 'Create Invoice';
        vm.cancel = cancel;


        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {
            if (!datacontext.validSession())
                return;

            if ($routeParams.id) {
                common.activateController([templateLoadFn()], controllerId)
                  .then(function () { log('Create Invoice Activated View'); });
            }
            else {
                return vm.title;
            }

        }

        function cancel() {
            vm.title = 'Create Invoice';
        }
        //Load Function usually used to load data
        function templateLoadFn() {
            vm.title = 'Create Invoice';
        }
    }
})();
