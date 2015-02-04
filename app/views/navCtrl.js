(function () {
    "use strict";
    angular.module("app", [])
     .controller("NavCtrl", ["$scope", "tasksService", "filterFilter", function ($scope, tasksService, filterFilter) {
         var tasks;      


         return tasks =   tasksService.getTasks().then(function (data) {
             $scope.tasks = data;
             $scope.taskRemainingCount = filterFilter(vm.tasks, { completed: !1 }).length;
             }),      
             $scope.$on("taskRemaining:changed",         
             function (event, count) {
                 return $scope.taskRemainingCount = count
             })
     }])
})(); 