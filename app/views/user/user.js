(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'userCtrl';

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
         'datacontext', userCtrl]);

    function userCtrl(common,
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
        vm.title = 'Users List';
        vm.save = save;
        vm.cancel = cancel;
        vm.users = [];

        vm.toggleDetail = toggleDetail;

        vm.goToUserSettings = goToUserSettings;

        //vm.goToDashboard = goToDashboard;

        $routeParams.id = 0;
        var canceldialogVisible = false;
        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {
            if (!datacontext.validSession())
                return;

                common.activateController([userLoadFn()], controllerId)
                  .then(function () { });        

        }

        function save() {
            canceldialogVisible = false;            
        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }

        function toggleDetail(user) {
            if (!user) {
                user.detailsVisbile = false;
                return;
            }
            var visible = !user.detailsVisbile;
            $routeParams.id = user.id;
            vm.user = user;
            vm.idRequested = user.id;
            if (!visible) {
                var divid = '#' + user.id;
                $(divid).remove();
            }
            //JRB 11/0
            user.detailsVisbile = visible;
            user.showInlineAttchment = false;
        };

        //Load Function usually used to load data
        function userLoadFn() {

            return datacontext.getUsers(true, 1, 20, null, null, null, null).then(function (data) {

                vm.users = data;
            });
             
        }

        function goToUserSettings() {
            if (!canceldialogVisible) {
                var url = '/userSettings';
                $location.path(url);
            }
        };
    }
})();
