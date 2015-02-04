(function () {
    "use strict";
    angular.module("app.signupCtrl", [])
      .controller("signupCtrl",
        ["$scope",
            function ($scope) {
                var original;
                return $scope.user = {
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    age: ""
                },
                    $scope.showInfoOnSubmit = !1,
                    original = angular.copy($scope.user),
                    $scope.revert = function () {
                        return $scope.user = angular.copy(original), $scope.form_signup.$setPristine(), $scope.form_signup.confirmPassword.$setPristine()
                    },
                    $scope.canRevert = function () {
                        return !angular.equals($scope.user, original) || !$scope.form_signup.$pristine
                    },
                    $scope.canSubmit = function () {
                        return $scope.form_signup.$valid && !angular.equals($scope.user, original)
                    },
                    $scope.submitForm = function () {
                        return $scope.showInfoOnSubmit = !0, $scope.revert()
                    }
            }])
})();