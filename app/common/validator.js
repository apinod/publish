(function () {
    'use strict';

    angular.module('common').factory('validator', [validator]);


    function validator() {
        var service = {
            validateTransaction: validateTransaction,
            validateDispute: validateDispute,
            validateDisputeBatch: validateDisputeBatch,
            validateUser: validateUser
        };

        return service;

        function validateTransaction() {
            var result = {
                validateObject: {
                    payorIsValid: true,
                    billerIsValid: true,
                    categoryIsValid: true,
                    typeIsValid: true,
                    numberIsValid: true,
                    payorRefIsValid: true,
                    amountIsValid: true,
                    relatedTotalAmountIsValid: true,
                    relatedNumberIsValid: true,
                    messages: {
                        payorMessage: '',
                        billerMessage: '',
                        categoryMessage: '',
                        typeMessage: '',
                        numberMessage: '',
                        payorRefMessage: '',
                        amountMessage: '',
                        relatedTotalAmountMessage: '',
                        relatedNumberMessage: ''
                    }
                }
                , isValid: isValid
            };



            function isValid(vm, validateObject) {
                var result = { isValid: true, validateObject: validateObject }

                //Category
                if (!$.isEmptyObject(vm.selectedcategory)) {
                    result.validateObject.categoryIsValid = true;
                    vm.transaction.bizArea = vm.selectedcategory;
                    result.validateObject.messages.categoryMessage = '';
                }
                else {
                    result.validateObject.categoryIsValid = false;
                    result.validateObject.messages.categoryMessage = 'Category field is required!'
                    result.isValid = false;
                };
                //Transaction type
                if (!$.isEmptyObject(vm.selectedtransactiontype)) {
                    result.validateObject.typeIsValid = true;
                    vm.transaction.transactionType = vm.selectedtransactiontype;
                    result.validateObject.messages.typeMessage = '';
                }
                else {
                    result.validateObject.typeIsValid = false;
                    result.validateObject.messages.typeMessage = 'Type field is required!'
                    result.isValid = false;
                };
                //Payor
                if (!$.isEmptyObject(vm.selectedpayor)) {
                    result.validateObject.payorIsValid = true;
                    vm.transaction.payor = vm.selectedpayor;
                    result.validateObject.messages.payorMessage = '';
                }
                else {
                    result.validateObject.payorIsValid = false;
                    result.validateObject.messages.payorMessage = 'Payor field is required!'
                    result.isValid = false;     
                };
                //Biller
                if (!$.isEmptyObject(vm.selectedbiller)) {
                    result.validateObject.billerIsValid = true;
                    vm.transaction.biller = vm.selectedbiller;
                    result.validateObject.messages.billerMessage = '';
                }
                else {                   
                    result.validateObject.billerIsValid = false;
                    result.validateObject.messages.billerMessage = 'Biller field is required!'
                    result.isValid = false;
                };
                //Transaction Number
                if (vm.transaction.number == null || $.isEmptyObject(vm.transaction.number) || vm.transaction.number == "") {
                    result.validateObject.messages.numberMessage = 'Transaction Number field is required!';
                    result.validateObject.numberIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.numberIsValid = true;
                    result.validateObject.messages.numberMessage = '';
                };

                //Related Number
                if ((vm.transaction.relatedNumber == null || $.isEmptyObject(vm.transaction.relatedNumber) || vm.transaction.relatedNumber == "") && (vm.selectedtransactiontype != null && vm.selectedtransactiontype.id == 2 ) ) {
                    result.validateObject.messages.relatedNumberMessage = 'Related Number field is required!';
                    result.validateObject.relatedNumberIsValid = false;
                    result.isValid = false;                  
                }
                else {                   
                    result.validateObject.relatedNumberIsValid = true;
                    result.validateObject.messages.relatedNumberMessage = '';
                };
                //Payor Ref Number
                if (!vm.isbillercurrent) {
                    if (vm.transaction.payorRefNumber == null || $.isEmptyObject(vm.transaction.payorRefNumber) && vm.transaction.payorRefNumber == "") {
                        result.validateObject.messages.payorRefMessage = 'Payor Ref Number field is required!';
                        result.validateObject.payorRefIsValid = false;
                        result.isValid = false;
                    }
                    else {
                        result.validateObject.messages.payorRefIsValid = '';
                        result.validateObject.payorRefIsValid = true;
                    };
                }
               
                //Amount
                if (vm.transaction.amount == null || $.isEmptyObject(vm.transaction.amount) && vm.transaction.amount == 0) {                   
                    result.validateObject.messages.amountMessage = 'Amount field is required!';
                    result.validateObject.amountIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.messages.amountMessage = '';
                    result.validateObject.amountIsValid = true;
                };
                //Budget Detail
                if (vm.transaction.amount < vm.relatedNumberTotalAmount) {
                    // vm.amountIsValid = false;
                    result.validateObject.messages.relatedTotalAmountMessage = 'A"Related Budget Amount" have to be equal to "Transaction Amount"';
                    result.validateObject.relatedTotalAmountIsValid = false;
                    result.isValid = false;                   
                }
                else {
                    result.validateObject.messages.relatedTotalAmountMessage = '';
                    result.validateObject.relatedTotalAmountIsValid = true;                   
                };

              


                return result;
            }

            return result;

        }

        function validateDispute() {
            var result = {
                validateObject: {              
                    disputereasonIsValid: true,
                    typeIsValid: true,                  
                    amountDiputedIsValid: true,
                    relatedTotalAmountIsValid: true,
                    categoryIsValid: true,
                    messages: {
                        payorMessage: '',
                        relatedNumberMessage: ''
                    }
                }
             , isValid: isValid
            };

            function isValid(vm, validateObject) {
                var result = { isValid: true, validateObject: validateObject }
                //Amount
                if (vm.disputeinfo.parenttransaction.disputedAmount == null || $.isEmptyObject(vm.disputeinfo.parenttransaction.disputedAmount) && vm.disputeinfo.parenttransaction.disputedAmount == 0) {
                    result.validateObject.messages.amountDiputedMessage = 'Amount field is required!';
                    result.validateObject.amountDiputedIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.messages.amountDiputedMessage = '';
                    result.validateObject.amountDiputedIsValid = true;
                };
                //Dispute Reason
                if (!$.isEmptyObject(vm.selecteddisputereason)) {
                    result.validateObject.disputereasonIsValid = true;                  
                    result.validateObject.messages.disputereasonMessage = '';
                }
                else {
                    result.validateObject.disputereasonIsValid = false;
                    result.validateObject.messages.disputereasonMessage = 'Category field is required!'
                    result.isValid = false;
                };
                //Category For Dispute
                if (!$.isEmptyObject(vm.selecteddisputecategory)) {
                    result.validateObject.categoryIsValid = true;
                    result.validateObject.messages.categoryMessage = '';
                }
                else {
                    result.validateObject.categoryIsValid = false;
                    result.validateObject.messages.categoryMessage = 'Category field is required!'
                    result.isValid = false;
                };

            

                return result;
            }

            return result;

        }

        function validateDisputeBatch() {
            var result = {
                validateObject: {
                    disputereasonIsValid: true,               
                    categoryIsValid: true,
                    messages: {
                        disputereasonMessage: '',
                        categoryMessage: ''
                    }
                }
             , isValid: isValid
            };

            function isValid(vm, validateObject) {
                var result = { isValid: true, validateObject: validateObject }
              
                //Dispute Reason
                if (!$.isEmptyObject(vm.selecteddisputereason)) {
                    result.validateObject.disputereasonIsValid = true;
                    result.validateObject.messages.disputereasonMessage = '';
                }
                else {
                    result.validateObject.disputereasonIsValid = false;
                    result.validateObject.messages.disputereasonMessage = 'Category field is required!'
                    result.isValid = false;
                };
                //Category For Dispute
                if (!$.isEmptyObject(vm.selecteddisputecategory)) {
                    result.validateObject.categoryIsValid = true;
                    result.validateObject.messages.categoryMessage = '';
                }
                else {
                    result.validateObject.categoryIsValid = false;
                    result.validateObject.messages.categoryMessage = 'Category field is required!'
                    result.isValid = false;
                };

                return result;
            }

            return result;

        }

        function validateUser()
        {
            var result = {
                validateObject: {
                    nameIsValid: true,
                    lastNameIsValid: true,
                    emailIsValid: true,
                    userNameIsValid: true,
                    phoneNumberIsValid: true,
                    passwordIsValid: true,
                    passwordConfirmIsValid: true,                    
                    messages: {
                        nameMessage: '',
                        lastNameMessage: '',
                        emailMessage: '',
                        userNameMessage: '',
                        phoneNumberMessage: '',
                        passwordMessage: '',
                        passwordConfirmMessage: ''                     
                    }
                }
                , isValid: isValid
            };

            function isValid(user, validateObject) {
                var result = { isValid: true, validateObject: validateObject }
          
                //Name
                if (user.name == null || $.isEmptyObject(user.name) || user.name == "" ) {
                    result.validateObject.messages.nameMessage = 'Name field is required!';
                    result.validateObject.nameIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.nameIsValid = true;
                    result.validateObject.messages.nameMessage = '';
                };
                //Last Name
                if (user.lastName == null || $.isEmptyObject(user.lastName) || user.lastName == "") {
                    result.validateObject.messages.lastNameMessage = 'Last Name field is required!';
                    result.validateObject.lastNameIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.lastNameIsValid = true;
                    result.validateObject.messages.lastNameMessage = '';
                };
                //Email
                if (user.email == null || $.isEmptyObject(user.email) || user.email == "") {
                    result.validateObject.messages.emailMessage = 'Email field is required!';
                    result.validateObject.emailIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.emailIsValid = true;
                    result.validateObject.messages.emailMessage = '';
                };
                //UserName
                if (user.userName == null || $.isEmptyObject(user.userName) || user.userName == "") {
                    result.validateObject.messages.userNameMessage = 'User Name field is required!';
                    result.validateObject.userNameIsValid = false;
                    result.isValid = false;
                }
                else {
                    result.validateObject.userNameIsValid = true;
                    result.validateObject.messages.userNameMessage = '';
                };


                return result;
            }

            return result;
        }
    }


})();