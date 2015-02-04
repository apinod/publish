(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'AppCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
         ["$scope",
         "$rootScope",        
         'datacontext', appCtrl]);

    function appCtrl($scope, $rootScope, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;

        var $window;
        var keyCodes = config.keyCodes;

        vm.main = {
            brand: "PayAnyBiz",
            name: " "
        };
        vm.admin = {
            layout: "wide",
            menu: "vertical",
            fixedHeader: !0,
            fixedSidebar: !1
        };

        $scope.$watch("admin", function (newVal, oldVal) {
            return "horizontal" === newVal.menu && "vertical" === oldVal.menu ?
                void $rootScope.$broadcast("nav:reset") : newVal.fixedHeader === !1 && newVal.fixedSidebar === !0 ? (oldVal.fixedHeader === !1 && oldVal.fixedSidebar === !1 && (vm.admin.fixedHeader = !0, vm.admin.fixedSidebar = !0),
                void (oldVal.fixedHeader === !0 && oldVal.fixedSidebar === !0 && (vm.admin.fixedHeader = !1, vm.admin.fixedSidebar = !1))) : (newVal.fixedSidebar === !0 && (vm.admin.fixedHeader = !0),
                void (newVal.fixedHeader === !1 && (vm.admin.fixedSidebar = !1)))
        }, !0);

        vm.color = {
            primary: "#1BB7A0",
            success: "#94B758",
            info: "#56BDF1",
            infoAlt: "#7F6EC7",
            warning: "#F3C536",
            danger: "#FA7B58"
        }

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {
          
        }
    }
})();
