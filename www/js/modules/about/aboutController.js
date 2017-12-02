
    var f7 = require('f7'),
        app = require('app'),
        analytics = require('services/ga_analytics'),
        constants = require('config/constants'),
        aboutView = require('modules/about/aboutView'),
        browser = require('services/browser');


      var bindings = [ {

                element: '.prompt-console',
                event: 'click',
                handler: onDeveloperConsoleOpen,
                onlyOnCurrentPage : true

            },
            {
                element: '.external.open-inappbrowser',
                event: 'click',
                handler:  browser.HandleExternalLink,
                onlyOnCurrentPage : true

            }
            ];

 

     function init (page) {
            
            // Track page only when opened throug menu, not when returned back
            if (page.from == "right")  {
                    analytics.trackView('contacts');

            }

            var versionCodePushUpdate = 0; // get version of over-the-air update, received by code-push last time
            
            if (typeof window.codePush != "undefined") {

                window.codePush.getCurrentPackage(function (update) {
                
                        if (update) versionCodePushUpdate = update.label.replace("v","");    // CodePush assigns versions like "v5" , we want remove v to show our version as 3.11 (5) for example
                        renderAboutView();
    
                },
                function(error) {
                    
                    console.log(constants.messages.error_codepush_errorwithdetails + error);
                    renderAboutView();
                });

            }
            else {
                    
                    console.log (constants.messages.error_codepush_undefined);
                    renderAboutView();
            }
            
                    function renderAboutView() {

                        contact_data = {
                            appversion: constants.srf_app_version + " (" + versionCodePushUpdate + ")",
                            apptitle: constants.srf_app_name,
                            email: constants.srf_contact_email,
                            phone: constants.srf_contact_phone,
                            webpage1: constants.srf_contact_webpage1
                            };
                
                            aboutView.render(contact_data, bindings);


                    }

            }



            function onDeveloperConsoleOpen() {

                   
                f7.prompt('Type "password" to open', function (value) {

                            if (value == 'password') {   // DON'T FORGET TO CHANGE !!!!!!!!
                                app.mainView.router.loadPage('developer.html');
                            }
                            
                });

            }

            module.exports =  {

                init : init

        }
