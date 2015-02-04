

    $('#password').keyup(function (e) {
        if (e.keyCode == 13) {
            submitLogin();
        }
    });

    function submitLogin() {
        var userName = $("#userName").val();
        var password = $("#password").val();
        var user = { UserName: userName, Password: password };
        $("#message").text('');
        $.ajax({
            type: "POST",
            url: "/Account/JsonLogin",
            data: user,
            success: function (successResult) {
                if (successResult.success) {
                    window.location = successResult.redirect || location.href;
                    $("#message").text('');
                }
                else {
                    $("#message").text(successResult.msg);
                }
            },

        });
    };

   // $("#reg_form").submit(formSubmitHandler);

    var formSubmitHandler = function () {
        var $form = $('form#register-form');

        // Validate the captcha and the rest of the fields
        var captcha_field = $('#captcha');
        var captcha_valid = captcha_field.val().toLowerCase() == $("#Bgv4G").val() ? true : false;

        if ($form.valid() == true && captcha_valid == true) {
                closePopup();
                $('.open-loader-popup').click();

                $.post($form.attr('action'), $form.serializeArray())
                    .done(function (json) {
                        json = json || {};

                        closePopup();

                        // In case of success
                        if (json.success) {
                            //window.location = json.redirect || location.href;
                            $('.open-info-popup').click();
                            $('div#info-popup #info-body').empty();
                            $('div#info-popup #info-body').append(json.message);
                        } else if (json.errors) {                                                        

                            if (json.handle == true)
                            {
                                //Display server validation errors                                                            
                                //$('div#notif-popup #error-body').append('The server has detected some validation errors in the information you provided.');
                                $('.open-warning-popup').click();
                                $('div#warning-popup #warning-body').empty();
                                $('div#warning-popup #warning-body').append(json.errors);

                                //reload captcha
                                captcha_field.val("");
                                generateCaptcha();
                            }
                            else {
                                //Other Errors
                                $('div#error-popup #error-title').empty();
                                $('div#error-popup #error-body').empty();
                                $('div#error-popup #error-title').append('ERROR 505');
                                $('div#error-popup #error-body').append(json.errors);
                                $('.open-error-popup').click();
                            }
                        }
                    })
                    .error(function (error) {
                        //Display server errors
                        $('div#notif-popup #error-title').empty();
                        $('div#notif-popup #error-body').empty();
                        $('div#notif-popup #error-title').append('ERROR 505');
                        $('div#notif-popup #error-body').append(error.errors);
                        $('.open-notif-popup').click();
                    });
        }
        else
        {
            $("#register-form li.current").addClass("error");
            
            //If captcha it's invalid request new challenge
            if (captcha_valid == false && captcha_field.hasClass("valid"))
            {
                captcha_field.closest('.form-group').find('.error-div').html(
                    '<em class="error" style="display: block;">Failed Captcha Challenge!!</em>');

                //captcha_field.removeClass('valid');
                //captcha_field.addClass('error');
                captcha_field.val("");
                generateCaptcha();

            }
        }

        // Prevent the normal behavior since we opened the dialog
        //e.preventDefault();
        return false;
    };

    var validator =
        $('form#register-form').validate({
            rules: {
                v_companyname: {
                    required: true,
                    maxlength: 25,
                    minlength: 2
                },
                v_address: {
                    required: true,
                    maxlength: 50,
                    minlength: 2
                },
                v_phone: {
                    required: true,
                    regex: "^([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
                },
                v_fax: {
                    regex: "^([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$"
                },
                v_dba: {
                    maxlength: 25,
                    minlength: 2
                },
                v_tin: {
                    required: true,
                    regex: "^([0-9]{11})$"
                },
                v_duns: {
                    regex: "^([0-9]+)$"
                },
                v_city: {
                    required: true,
                    regex: "^([A-Za-z ]+)$",
                    maxlength: 25,
                    minlength: 2
                },
                v_zipcode: {
                    required: true,
                    regex: "^([0-9]{5})$"
                },
                PhoneExt: {
                    regex: "^([0-9])*$"
                },
                v_email: {
                    required: true,
                    email: true
                },
                r_username: {
                    required: true,
                    maxlength: 15,
                    minlength: 8
                },
                v_name: {
                    required: true,
                    maxlength: 25,
                    minlength: 2
                },
                v_lastname: {
                    required: true,
                    maxlength: 25,
                    minlength: 2
                },
                v_bba: {
                    required: true,
                    regex: "^([0-9]+)$"
                },
                v_bba_confirm: {
                    equalTo: "#v_bba"
                },
                v_routingNumber: {
                    required: true,
                    regex: "^([0-9]{9})$"
                },
                v_routingNumber_confirm: {
                    equalTo: "#v_routingNumber"
                },
                v_cba: {
                    required: true,
                    regex: "^([0-9]+)$"
                },
                v_cba_confirm: {
                    equalTo: "#v_cba"
                },
                v_cr_routingNumber: {
                    required: true,
                    regex: "^([0-9]{9})$"
                },
                v_cr_routingNumber_confirm: {
                    equalTo: "#v_cr_routingNumber"
                },
                agree: "required",
                captcha: {
                    required: true,
                    //equalTo: "#Bgv4G"
                }
            },

            messages: {
                v_companyname: {
                    required: "Company Name is required!",
                    maxlength: "(2 - 25) characters!",
                    minlength: "(2 - 25) characters!"
                },
                v_address: {
                    required: "Company Address is required!",
                    maxlength: "(2 - 50) characters!",
                    minlength: "(2 - 50) characters!"
                },
                v_phone: {
                    required: "Company Phone is required!",
                    regex: "Provided phone number not valid. Must have 10 digits!"
                },
                v_fax: {
                    regex: "Provided fax number not valid Must have 10 digits!"
                },
                v_dba: {
                    maxlength: "(2 - 25) characters!",
                    minlength: "(2 - 25) characters!"
                },
                v_tin: {
                    required: "Fed Tax ID Number is required!",
                    regex: "Provided Fed Tax ID Number not valid. Must have 11 digits!"
                },
                v_duns: {
                    regex: "Provided D.U.N.S Number not valid!"
                },
                v_city: {
                    required: "City is required!",
                    regex: "Provided city not valid!",
                    maxlength: "(2 - 25) characters!",
                    minlength: "(2 - 25) characters!"
                },
                v_zipcode: {
                    required: "Zip Code is required!",
                    regex: "Provided zip code not valid!"
                },
                PhoneExt: {
                    regex: "Provided phone ext# not valid!"
                },
                v_email: {
                    required: "Email is required",
                    email: "Provided email address not valid"
                },
                r_username: {
                    required: "UserName is required!",
                    maxlength: "(8 - 15) characters!",
                    minlength: "(8 - 15) characters!"
                },
                v_name: {
                    required: "First Name is required!",
                    maxlength: "(2 - 25) characters!",
                    minlength: "(2 - 25) characters!"
                },
                v_lastname: {
                    required: "Last Name is required!",
                    maxlength: "(2 - 25) characters!",
                    minlength: "(2 - 25) characters!"
                },
                v_bba: {
                    required: "Bank Account Number is required!",
                    regex: "Provided Bank Account not valid!"
                },
                v_bba_confirm: {
                    equalTo: "Bank Account Number do not match!"
                },
                v_routingNumber: {
                    required: "Routing Number is required!",
                    regex: "Routing Number not valid. Must have 9 digits!"
                },
                v_routingNumber_confirm: {
                    equalTo: "Routing Number do not match!"
                },
                v_cba: {
                    required: "Bank Account Number is required!",
                    regex: "Provided Bank Account Number not valid!"
                },
                v_cba_confirm: {
                    equalTo: "Bank Account Number do not match!"
                },
                v_cr_routingNumber: {
                    required: "Routing Number is required!",
                    regex: "Routing Number not valid. Must have 9 digits!"
                },
                v_cr_routingNumber_confirm: {
                    equalTo: "Routing Number do not match!"
                },
                agree: "You must accept the terms and conditions to proceed!!",
                captcha: {
                    required: "You must type the captcha challenge!!",
                    //equalTo: "Failed Captcha Challenge!!"
                }
            },
            errorElement: "em",            errorPlacement: function (error, element) {
                $(element).closest('.form-group').find('.error-div').append(error);
            },

            invalidHandler: function(event, validator) {
            
                //var captcha = $.grep(validator.currentElements, function (e) { return e.id == 'captcha'; })
                //if (captcha.length != 0)
                $('#captcha').val("");
                generateCaptcha();
            }
        });

    $.validator.addMethod(
            "regex",
            function (value, element, regexp) {
                var re = new RegExp(regexp);
                return this.optional(element) || re.test(value);
            },
            "Please check your input."
    );

    $('#register-form1').validate({

        onfocusout: function (element) { $(element).valid(); },
        errorClass: 'error',
        validClass: 'valid',
        rules: {
            //r_username: { required: true, minlength: 3 },
            //r_password: { required: true, minlength: 5 },
            'v_companyname': { required: true, minlength: 3 },
            //'v_email': { email: true, required: true },
            //'v_dba': 'required',
            //'v_address': 'required',
            //'v_name': 'required',
            //'v_lastname': 'required',
            //'v_state': 'required',
            //'v_zipcode': 'required',
            //'v_tin': 'required',
            //'v_confirmPassword': { required: true, minlength: 5, equalTo: '#r_password' },
            //'v_city': 'required',
            //'v_country': 'required',
            //'v_terms': 'required',
            //'v_bank': 'required',
            //'v_accountNumber': 'required',
            //'v_confirmAccountNumber': { required: true, equalTo: '#v_accountNumber' },
            //'v_routingNumber': 'required',
            //'v_bank2': 'required',
            //'v_accountNumber2': 'required',
            //'v_confirmAccountNumber2': { required: true, equalTo: '#v_accountNumber2' },
            //'v_routingNumber2': 'required'

        },
        messages: {
            //'r_username': { required: 'Username is required!' },
            'v_companyname': { required: 'Company Name is required!' },
            //'v_email': { email: 'Invalid e-mail!' },
            //'v_dba': { required: 'DBA field is required!' },
            //'v_address': { required: 'Address field is required!' },
            //'v_name': { required: 'Name field is required!' },
            //'v_lastname': { required: 'Last name field is required!' },
            //'v_state': { required: 'State field is required!' },
            //'v_zipcode': { required: 'Zip Code field is required!' },
            //'v_tin': { required: 'TIN field is required!' },
            //'r_password': { required: 'Password is required!' },
            //'v_retypePassword': { required: 'Confirm password field is required!' },
            //'v_city': { required: 'City field is required!' },
            //'v_country': { required: 'Country field is required!' },
            //'v_terms': { required: 'Must accept Terms of Service!' },
            //'v_bank': { required: 'Bank field is required!' },
            //'v_accountNumber': { required: 'Dedit account number is required!' },
            //'v_confirmAccountNumber': { required: 'Please confirm the Account Number!' },
            //'v_routingNumber': { required: 'Routing Number is required!' },
            //'v_bank2': { required: 'Bank field is required!' },
            //'v_accountNumber2': { required: 'Credit account number is required!' },
            //'v_confirmAccountNumber2': { required: 'Please confirm the Account Number!' },
            //'v_routingNumber2': { required: 'Routing Number is required!' }
        },
        highlight: function (element) {
            $(element).closest('div').addClass("f_error");
            setTimeout(function () {
                boxHeight("#reg_form")
            }, 200)
        },
        unhighlight: function (element) {
            $(element).closest('div').removeClass("f_error");
            setTimeout(function () {
                boxHeight("#reg_form")
            }, 200)
        },
        errorPlacement: function (error, element) {
            $(element).closest('div').append(error);
        }
    });





