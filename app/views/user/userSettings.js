(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'userSettingsCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$route', '$routeParams','logger', userSettingsCtrl]);

    function userSettingsCtrl(common, config, datacontext, $route, $routeParams, logger) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;      
      
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.title = 'User Settings';
        vm.cancel = cancel;

        vm.userSettings = [];

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {
            if ($routeParams.id) {
                common.activateController([templateLoadFn()], controllerId)
                  .then(function () {  });
            }
            else {
                loadItems();
                return vm.title;
            }

        }

        function cancel() {
            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }
        //Load Function usually used to load data
        function templateLoadFn() {

            loadItems();

            vm.title = 'HERE ---> Template PayAnyBiz Activated Loaded :) --> ';
        }

        function loadItems()
        {
            var item1 = { isChecked: false, description: 'New Pending Transaction', info: 'Notification of a Newly Created Pending Transaction', email: '' };
            var item2 = { isChecked: false, description: 'Verified Transaction', info: 'Notification of a Newly Created Pending Transaction', email: '' };
            var item3 = { isChecked: false, description: 'Approved Transaction', info: 'Notification of a Transaction that has been Approved', email: '' };
            var item4 = { isChecked: false, description: 'Verified Transaction', info: 'Notification of a Newly Created Pending Transaction', email: '' };
            var item5 = { isChecked: false, description: 'Dispute Reply', info: 'Notification of Dispute Reply from Biller', email: '' };
            var item6 = { isChecked: false, description: 'Dispute', info: 'Notification of a New Dispute', email: '' };
            var item7 = { isChecked: false, description: 'Add  & Edit  Attachments', info: 'Notification of added or edited Attachment(s)', email: '' };
            var item8 = { isChecked: false, description: 'Group of Transaction', info: 'Notification when a group of Transactions changed statuses', email: '' };
            var item9 = { isChecked: false, description: 'Transaction Change', info: 'Notification when a transaction changes', email: '' };
            var item10 = { isChecked: false, description: 'New Branch Office Request', info: 'A request from one of your  Branch Office', email: '' };

            vm.userSettings.push(item1);
            vm.userSettings.push(item2);
            vm.userSettings.push(item3);
            vm.userSettings.push(item4);
            vm.userSettings.push(item5);
            vm.userSettings.push(item6);
            vm.userSettings.push(item7);
            vm.userSettings.push(item8);
            vm.userSettings.push(item9);
            vm.userSettings.push(item10);
        }
    }
})();
