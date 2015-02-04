(function () {
    "use strict";
    angular.module("app.signinCtrl", [])
       .controller("signinCtrl",
        ["$scope",
            function ($scope) {
                var original;
                return $scope.user = {
                    email: "",
                    password: ""
                },
                    $scope.showInfoOnSubmit = !1,
                    original = angular.copy($scope.user),
                    $scope.revert = function () {
                        return $scope.user = angular.copy(original),
                            $scope.form_signin.$setPristine()
                    },
                    $scope.canRevert = function () {
                        return !angular.equals($scope.user, original) || !$scope.form_signin.$pristine
                    },
                    $scope.canSubmit = function () {
                        return $scope.form_signin.$valid && !angular.equals($scope.user, original)
                    },
                    $scope.submitForm = function () {
                        return $scope.showInfoOnSubmit = !0, $scope.revert()
                    }
            }])
})();