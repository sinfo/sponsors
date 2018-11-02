/*
--------------------------------
Ajax Contact Form
--------------------------------
+ https://github.com/mehedidb/Ajax_Contact_Form
+ A Simple Ajax Contact Form developed in PHP with HTML5 Form validation.
+ Has a fallback in jQuery for browsers that do not support HTML5 form validation.
+ version 1.0.1
+ Copyright 2016 Mehedi Hasan Nahid
+ Licensed under the MIT license
+ https://github.com/mehedidb/Ajax_Contact_Form
*/

// TODO change me
const serverUrl = 'http://localhost:8888';

(function ($, window, document, undefined) {
    'use strict';

    var $form = $('#contact-form');

    $form.submit(function (e) {

        var recaptchaCode = grecaptcha.getResponse(widgetId)

        if (recaptchaCode === '') {
            $form.prepend('<div class="alert alert-danger">Please fill reCaptcha</div>');
        } else {
            // remove the error class
            $('.form-group').removeClass('has-error');
            $('.help-block').remove();

            // get the form data
            var formData = {
                'name' : $('input[name="form-name"]').val(),
                'email' : $('input[name="form-email"]').val(),
                'subject' : $('input[name="form-subject"]').val(),
                'message' : $('textarea[name="form-message"]').val(),
                'recaptcha' : recaptchaCode
            };

            // process the form
            $.ajax({
                type : 'POST',
                url  : serverUrl,
                data : formData,
                dataType : 'json',
                encode : true
            }).done(function (data) {
                // handle errors
                if (!data.success) {
                    if (data.errors.name) {
                        $form.prepend('<div class="alert alert-danger">' + data.errors.name + '</div>');
                    }

                    if (data.errors.email) {
                        $form.prepend('<div class="alert alert-danger">' + data.errors.email + '</div>');
                    }

                    if (data.errors.subject) {
                        $form.prepend('<div class="alert alert-danger">' + data.errors.subject + '</div>');
                    }

                    if (data.errors.message) {
                        $form.prepend('<div class="alert alert-danger">' + data.errors.message + '</div>');
                    }

                    if (data.errors.recaptcha) {
                        $form.prepend('<div class="alert alert-danger">' + data.errors.recaptcha + '</div>');
                    }

                    console.log(JSON.stringify(data.errors));
                } else {
                    // display success message
                    $form.html('<div class="alert alert-success">Message sent</div>');
                }
            }).fail(function (data) {
                // for debug
                console.log(data);
                e.preventDefault();
            });
        }

        e.preventDefault();
    });
}(jQuery, window, document));
