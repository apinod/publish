(function () {
    "use strict";
    angular.module("app.formConstraintsCtrl", [])
      .controller("formConstraintsCtrl",
        ["$scope",
         function ($scope) {
             var original;
             return $scope.form = {
                 required: "",
                 minlength: "",
                 maxlength: "",
                 length_rage: "",
                 type_something: "",
                 confirm_type: "",
                 foo: "",
                 email: "",
                 url: "",
                 num: "",
                 minVal: "",
                 maxVal: "",
                 valRange: "",
                 pattern: ""
             },
                 original = angular.copy($scope.form),
                 $scope.revert = function () {
                     return $scope.form = angular.copy(original),
                         $scope.form_constraints.$setPristine()
                 },
                 $scope.canRevert = function () {
                     return !angular.equals($scope.form, original) || !$scope.form_constraints.$pristine
                 },
                 $scope.canSubmit = function () {
                     return $scope.form_constraints.$valid && !angular.equals($scope.form, original)
                 }
         }])
})();