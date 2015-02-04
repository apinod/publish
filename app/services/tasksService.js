//YCR 11/13/2014
(function () {
    'use strict';
    var serviceId = 'tasksService';
    angular.module('app').factory(serviceId,
        ['datacontext','filterFilter', tasksService]);

    function tasksService(datacontext, filterFilter) {
       
        function getTasks() {           
            return datacontext.getTasks().then(function (data) {
                return data;
            });
        }      

        function add(task)
        {
          return  datacontext.addTask(task);
        }

        function remove(task){
           return datacontext.removeTask(task);
        }

        function save()
        {
            return datacontext.save();
        }
        function saveChanges(succeeded, failed) {          
            return datacontext.saveChanges(succeeded, failed);
        }

        function taskRemainingCount()
        {
            var tasks = getTasks();
            return filterFilter(tasks, { completed: !1 }).length;
        }

        return {
            getTasks: getTasks,
            add: add,
            remove: remove,
            saveChanges: saveChanges,
            taskRemainingCount: taskRemainingCount
        }

    }
})();