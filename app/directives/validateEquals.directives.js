(function () {
	"use strict";
	angular.module("app.validation.validateEquals.directives", [])
	.directive("validateEquals", [function () {
		return {
			require: "ngModel",
			link: function (scope, ele, attrs, ngModelCtrl) {
				var validateEqual;
				return validateEqual = function (value) {
					var valid;
					return valid = value === scope.$eval(attrs.validateEquals),
						ngModelCtrl.$setValidity("equal", valid),
						"function" == typeof valid ? valid({ value: void 0 }) : void 0
				},
					ngModelCtrl.$parsers.push(validateEqual),
					ngModelCtrl.$formatters.push(validateEqual),
					scope.$watch(attrs.validateEquals,
					function (newValue, oldValue) {
						return newValue !== oldValue ? ngModelCtrl.$setViewValue(ngModelCtrl.$ViewValue) : void 0
					})
			}
		}
	}])
})();