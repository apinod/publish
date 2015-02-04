(function () {
    "use strict";

    angular.module("app", [])
       .controller("AppCtrl", ["$scope", "$rootScope",
           function ($scope, $rootScope) {
               var $window;
               return $window = $(window),
                   $scope.main = {
                       brand: "PayAnyBiz",
                       name: ""
                   },
                   $scope.admin = {
                       layout: "wide",
                       menu: "vertical",
                       fixedHeader: !0,
                       fixedSidebar: !1
                   },
                   $scope.$watch("admin",
                   function (newVal, oldVal) {
                       return "horizontal" === newVal.menu && "vertical" === oldVal.menu ?
                           void $rootScope.$broadcast("nav:reset") : newVal.fixedHeader === !1 &&
                           newVal.fixedSidebar === !0 ?
                           (oldVal.fixedHeader === !1 &&
                           oldVal.fixedSidebar === !1 &&
                           ($scope.admin.fixedHeader = !0, $scope.admin.fixedSidebar = !0),
                           void (oldVal.fixedHeader === !0 &&
                           oldVal.fixedSidebar === !0 && ($scope.admin.fixedHeader = !1,
                           $scope.admin.fixedSidebar = !1))) : (newVal.fixedSidebar === !0 && ($scope.admin.fixedHeader = !0),
                           void (newVal.fixedHeader === !1 && ($scope.admin.fixedSidebar = !1)))
                   }, !0),
                   $scope.color = {
                       primary: "#1BB7A0",
                       success: "#94B758",
                       info: "#56BDF1",
                       infoAlt: "#7F6EC7",
                       warning: "#F3C536",
                       danger: "#FA7B58"
                   }
           }])
   
})();