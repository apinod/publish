(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'taskCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
         ['common',
         'config',
         '$route',
         '$routeParams',
         '$location',
         '$resource',
         '$scope',
         '$rootScope',
         'bootstrap.dialog',
         'datacontext',
         'logger',
         'filterFilter',
         'tasksService'
         , taskCtrl]);

    function taskCtrl(common,
        config,
        $route, $routeParams,
        $location,
        $resource,
        $scope,
        $rootScope,
        bsDialog,
        datacontext,
        logger,
        filterFilter,
        tasksService) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;

        var keyCodes = config.keyCodes;


       

        // Bindable properties and functions are placed on vm.
        vm.title = 'Tasks';
        vm.cancel = cancel;

        vm.tasks = [];
        vm.newTask = "";
        vm.remainingCount = 0;
        vm.editedTask = null;
        vm.statusFilter = { completed: !1 };
        vm.filter = filter;
        vm.add = add;
        vm.edit = edit;
        vm.doneEditing = doneEditing;
        vm.remove = remove;
        vm.completed = completed;
        vm.clearCompleted = clearCompleted;
        vm.markAll = markAll;


        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;
            vm.user = datacontext.getCurrentUser();
        
                common.activateController([loadTasksFn()], controllerId)
                  .then(
                  function () {
                     
                  });
          

        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }
        //Load Function usually used to load data
        function loadTasksFn() {
            
            tasksService.getTasks().then(function (data) {
                vm.tasks = data;
                vm.remainingCount = filterFilter(vm.tasks, { completed: !1 }).length;
            });
          

        }

        function filter(filter)
        {
            switch (filter) {
                case "all":
                    return vm.statusFilter = { active: !0 };
                case "active":
                    return vm.statusFilter = { completed: !1 };
                case "completed":
                    return vm.statusFilter = { completed: !0 }
            }
        }

        function add()
        {
            var newTask = vm.newTask.trim();

            if (0 !== newTask.length)
            {
                var initValues = { title: newTask, completed: !1, userId: vm.user.currentUserId, active:true }
                vm.tasks = tasksService.add(initValues);
                vm.newTask = "";
                vm.remainingCount++;
                save();
            }


        }

        function edit(task)
        {
            vm.editedTask = task;

        }

        function doneEditing(task)
        {
            vm.editedTask = null;
            task.title = task.title.trim();
            if (task.title) {                
                save();
            }
            else {
                vm.remove(task);
              
               
            }
            
        }

        function remove(task) {
            var index;
            vm.remainingCount -= task.completed ? 0 : 1;        
            vm.tasks = tasksService.remove(task);
            save();
        }

        function completed(task) {
            vm.remainingCount += task.completed ? -1 : 1;
            save();
            task.completed ? vm.remainingCount > 0 ?
                           logger.log(1 === vm.remainingCount ? "Almost there! Only " + vm.remainingCount + " task left" : "Good job! Only " + vm.remainingCount + " tasks left") :
                           logger.logSuccess("Congrats! All done :)") : void 0;
        }

        function clearCompleted()
        {
            vm.tasks = vm.tasks.filter(function (val) {
                return !val.completed;
            });

            save();
        }

        function markAll(completed)
        {
            vm.tasks.forEach(function (task) {
                return task.completed = completed
            });
            vm.remainingCount = completed ? 0 : vm.tasks.length;
            tasksService.put(tasks);
            completed ? logger.logSuccess("Congrats! All done :)") : void 0
        }

        function save()
        {
            tasksService.saveChanges(            
              function () {
                  logger.log("Task list Updated.");                
              },
              function (error) {
                  var msg = 'Error saving Task: ' + error.message;
                  logger.logError(msg, error);
              });
        }

        $scope.$watch("vm.remainingCount == 0", function (val) {
            return vm.allChecked = val
        });
        $scope.$watch("vm.remainingCount", function (newVal) {
            return $rootScope.$broadcast("vm.taskRemaining:changed", newVal)
        })

    }
})();
