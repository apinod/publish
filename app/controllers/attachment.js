(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'attachmentCtrl';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', '$route', '$location', '$routeParams', 'bootstrap.dialog', '$resource', '$rootScope','logger', attachmentCtrl]);

    function attachmentCtrl(common, config, datacontext, $route, $location, $routeParams, bsDialog, $resource, $rootScope,logger) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).      
        var vm = this;
       // var getLogFn = common.logger.getLogFn;
      //  var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;
     //   var logError = getLogFn(controllerId, 'error');
        var transationStatuses = datacontext.transactionStatuses;
      //  var loadResource = common.myResource.documents;


        // Bindable properties and functions are placed on vm..
        vm.activate = activate;
        vm.save = save;       
        vm.makePrivate = makePrivate;
        vm.makePublic = makePublic;
        vm.downloadFile = downloadFile;       
        vm.showAttachments = showAttachments;
     

        //Txn Type
        vm.attachmenttypes = [];//[{ id: 1, description: 'BOL' }, { id: 2, description: 'Invoice' }, { id: 3, description: 'Dispute' }, { id: 4, description: 'Other' }];
        vm.selectedattachmenttype = {};

        //JRB 12/28/2013 
        //Current Customer
        vm.currentcustomer = {};
        //Payors / Billers Customers 
        vm.customers = [];
        vm.selectedpayor = {};
        vm.selectedbiller = {};

        //JRB 12/28/2013
        vm.ispayorcurrent = false;
        vm.isbillercurrent = false;
        vm.typeIsValid = true;      
        vm.attachments = [];


        //YCR 2/27/2014
      
        vm.isSaving = false;
       
        vm.showLoading = false;
        vm.loadingMsg = "Loading...";

        //YCR 04/22/2014
        vm.docIspublic = false;
        vm.fileDescription = '';
      
        //YCR 03/12/2014
        vm.uploadFile = uploadFile;

        //YCR 03/24/2014
        vm.removeDocument = removeDocument;
      
        //YCR 04/22/0214
        vm.sendEmail = sendEmail;

        vm.fileNameChaged = fileNameChaged;

        vm.txnId = $routeParams.id;

        //Call Controller Init Method
        activate();

        //Controller Init Method
        function activate() {

            if (!datacontext.validSession())
                return;

            vm.title = 'Transaction Attachments' + $routeParams.id;
            var fncLoad = loadTransactionInfo ;
            var idOrtype = $routeParams.id;    
            common.activateController([loadLookups(), fncLoad(idOrtype)], controllerId)
                  .then(function () 
                      {
                      });
        }

        $('#' + $routeParams.id + 'Attachmentfile').change(function () {

            uploadFile();
        });

        function loadLookups() {    
            //JRB 12/14/2013
            vm.attachmenttypes = datacontext.getTransactionTypesLookup();

            if (vm.attachmenttypes.length < 3){
            vm.attachmenttypes.push({ id: 3, description: 'Dispute' });
            vm.attachmenttypes.push({ id: 4, description: 'Other' });
            }
            //JRB 12/28/2013
            vm.customers = datacontext.getCustomersLookup();
            vm.currentcustomer = datacontext.getCurrentCustomer();
        }


        function save() {
            if (validation()) {
                vm.isSaving = true;
                vm.showLoading = true;
                datacontext.saveChanges().fin(complete);

            };
            function complete() {
                vm.isSaving = false;
                vm.showLoading = false;             
            };
        }
      
        function canSave() {
            return !vm.isSaving;
        };
        //YCR 04/22/2014
        function addAttchment(attachment) {
            var newAttachment = datacontext.addAttchment(attachment);
            if (newAttachment) {
                //I don't like code below. Not elegant solution, 
                //it defeats the beauty of AngularJS and Breeze :(. To be refactored A.S.A.P
                // vm.attachments.push(newrelnbr);
            }
        }

        //JRB 12/15/2013
        function loadTransactionInfo(id) {
            //Set Txn Info Data By Id with Defferred execution 
            //Breeze gets data from local cache when available otherwise goes to the server to fetch the data.
            if (!id)
                return;

            return datacontext.getTransactionById(id, setTransactinInfoDelegate);
        }
        
        function setTransactinInfoDelegate(fectchedData) {
            //This delegate is needed to sync. breeze fetch data promise with angular $scope $diggest
            //Solution delegate function setTransactinInfo() will attend the success delegate 
            //of breeze.fetchEntityByKey() asynch. method.
            vm.transaction = fectchedData.entity;
            if (vm.transaction) {
             
                datacontext.getAttachments(vm.transaction, attachmentDelegate);

             
        
                vm.selectedattachmenttype = vm.transaction.transactionType;            
             
                //Define how current user org. s acting as on the txn.
                vm.ispayorcurrent = vm.transaction.payorId === vm.currentcustomer.id;
                vm.isbillercurrent = vm.transaction.billerId === vm.currentcustomer.id;
                //Set Additionsal refnbr active record Transactrion Id
 
                //Load Documents
               // loadAttachments(vm.transaction);
                vm.isTransactionApproved = (vm.transaction.transactionStatusId === datacontext.transactionStatuses.APPROVED);
            }
            return vm.transaction;
        }

        function attachmentDelegate(fectchedData) {
            vm.attachments = fectchedData.results;
            vm.showLoading = false;
            //06/04/2014 Raise Event for scopes listening/subscribed
            $rootScope.$broadcast('txnattcountchanged', { value: vm.attachments.length })
        }      

        function uploadFile(value) {

            vm.showLoading = true;
            var files = $('#' + vm.transaction.id + 'Attachmentfile');
            if (files.length > 0) {
                if (window.FormData !== undefined) {
                    var formData = new FormData();
                    var opmlFile = $('#' + vm.transaction.id + 'Attachmentfile')[0];
                    formData.append("opmlFile", opmlFile.files[0]);
                    formData.append("txnId", vm.transaction.id);
                    formData.append("txnType", vm.selectedattachmenttype.id);
                    formData.append("isPublic", vm.docIspublic);
                    formData.append("customerId", vm.currentcustomer.id);
                    formData.append("fileDescription", vm.fileDescription);

                    $.ajax({
                        type: "POST",
                        url: "/api/uploading",
                        contentType: false,
                        processData: false,
                        data: formData,
                        cache: false,
                        success: function (res) {

                            logger.log('Uploaded Successfully');
                           
                            vm.fileDescription = "";
                            $('#' + vm.transaction.id + 'Attachmentfile').val("");
                           
                            loadAttachments(vm.transaction);
                           // datacontext.getAttachments(vm.transaction, attachmentDelegate);                      
                            vm.showLoading = false;
                        },
                        error: function (err) {
                            vm.showLoading = false;
                            logger.logError('Error:' + err.message);
                        }
                    });
                } else {
                    logger.log("Browser issue!");
                }
            }
        };

        function loadAttachments(transaction) {
            vm.showLoading = true;
            if (!transaction) {
                return;
            }
            datacontext.getAttachments(transaction, attachmentDelegate);
        };

        function removeDocument(item) {
            return bsDialog.confirmationDialog('Confirm', 'Remove Document:' + item.description)
             .then(function () {
                 vm.showLoading = true;
                 var myWebApi = $resource('/api/uploading/delete?id=' + item.id , {}, { upload: { method: 'POST' }, getFiles: { method: 'GET' }, deleteFile: { method: 'DELETE' } });

                 myWebApi.deleteFile(function (successResult) {
                     loadAttachments(vm.transaction);
                     vm.showLoading = false;
                 }, function (errorResult) {
                     logger.logError(errorResult.data.message);
                     vm.showLoading = false;
                 });
             });
        };

        function downloadFile(item) {
            if (!item) {
                return;
            }
 
            window.open('/api/uploading/' + item.id, '_blank');

        }

        function makePrivate(item) {
            if (!item) {
                return;
            }
            vm.showLoading = true;
            var myWebApi = $resource('/api/uploading?id=' + item.id +'&toPublic=false', {}, { moveFile: { method: 'POST' }, getFiles: { method: 'GET' } });
            myWebApi.moveFile(function (successResult) {
                loadAttachments(vm.transaction);
            }, function (errorResult) {
                vm.showLoading = false;
                logger.logError(errorResult.data.message);
            });
        };

        function makePublic(item) {
            if (!item) {
                return;
            }
            vm.loadingMsg = "";
            vm.showLoading = true;
            var myWebApi = $resource('/api/uploading?id=' + item.id + '&toPublic=true', {}, { moveFile: { method: 'POST' }, getFiles: { method: 'GET' } });
            myWebApi.moveFile(function (successResult) {
                loadAttachments(vm.transaction);
            }, function (errorResult) {
                vm.showLoading = false;
                logger.logError(errorResult.data.message);
            });
        };

        function sendEmail(transaction) {

            var resource = $resource('/api/notification', {}, { sendEmail: { method: 'POST' } });
            var emailObj = { emailTemplate: 2, transactionId: transaction.id };

            resource.sendEmail(emailObj, function (successResult) {

            },
            function (errorResult) {

            });
        }
    
        function fileNameChaged(value)
        {
            if (validation()) {
                uploadFile(value);
            }
        }

        //YCR 02/27/2014
        function validation() {
            var error = 0;
           
            //Transaction type
            if (!$.isEmptyObject(vm.selectedattachmenttype)) {
                vm.typeIsValid = true;               
            }
            else {
                vm.typeIsValid = false;
                error++;
            };          

            if (error > 0) {
                logger.logError('Please select an attachment type', 'error');
                vm.isValid = false;
                return false;
            }
            return true;;
        }

        function showAttachments(txn) {
            if (!txn) { return; }
            $('#' + txn.id + 'attachmentModal').modal({
                    backdrop: 'static',
                    keyboard: true
                });
                return;              
        }

    };
})();

//#region Validations

//#endregion