(function () {
    "use strict";
    angular.module("app", [])
         .controller("headerCtrl", ["$scope",
            function ($scope) {
                return $scope.introOptions = {
                    steps: [
                        { element: "#step1", intro: "<strong>Heads up!</strong> You can change the layout here", position: "bottom" },
                        { element: "#step2", intro: "Select a different language", position: "right" },
                        { element: "#step3", intro: "Runnable task App", position: "left" },
                        { element: "#step4", intro: "Collapsed nav for both horizontal nav and vertical nav", position: "right" }]
                }
            }])
})(this);