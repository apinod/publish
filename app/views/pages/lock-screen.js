(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'lockScreenCtrl';

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
         lockScreenCtrl]);

    function lockScreenCtrl(common,
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
      
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.title = 'ALUKO....';
        vm.cancel = cancel;
        vm.submitLogin = submitLogin;
        vm.enterLogin = enterLogin;

      //  var currentUser = datacontext.getCurrentUser();

        vm.userName = '';// currentUser.userName;
        vm.lockPassword = '';// currentUser.lockPassword;
        vm.passIsEmpty = true;

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if ($scope.main.debugMode) {
                window.location.href = "http://localhost:60802";
            }
            else {
                window.location.href = "http://test.payanybiz.com";
            }
           
            if ($routeParams.id) {
                common.activateController([templateLoadFn()], controllerId)
                  .then(function () {  });
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

        function submitLogin() {

            if (vm.lockPassword == '') {
                vm.passIsEmpty = true;
                return;
            }

            var user = { UserName: vm.userName, Password: vm.lockPassword };           

            $.ajax({
                type: "POST",
                url: "/Account/JsonLogin",
                data: user,
                success: function (successResult) {
                    if (successResult.success) {
                        window.location = successResult.redirect || location.href;

                    }
                    else {
                        logger.logError(successResult.msg);
                    }
                },

            }); 
       
        }

        function enterLogin($event)
        {
            if ($event) {
                switch ($event.keyCode) {
                    case keyCodes.esc:

                        break;
                    case keyCodes.enter:
                        submitLogin();
                        break;
                    case keyCodes.backspace:

                        break;
                    case keyCodes.del:

                        break;
                    default:

                        break;
                }

            }
        }




    }
})();



//$('#lock-password').keyup(function (e) {
//    if (e.keyCode == 13) {
//        submitLogin();
//    }
//});

//function submitLogin() {
//    var userName = $("#lock-userName").val();
//    var password = $("#lock-password").val();
//    var user = { UserName: userName, Password: password };
//    $("#lock-message").text('');
//    $.ajax({
//        type: "POST",
//        url: "/Account/JsonLogin",
//        data: user,
//        success: function (successResult) {
//            if (successResult.success) {
//                window.location = successResult.redirect || location.href;
//                $("#lock-message").text('');
//            }
//            else {
//                $("#lock-message").text(successResult.msg);
//            }
//        },

//    });
//};