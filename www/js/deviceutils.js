
var f7 = require('f7'),
    leftnav = require('modules/navigation/leftnav'),
    constants = require('config/constants'),
    appState = require('config/appstate');

    function hideSplashScreen() {

        if(navigator && navigator.splashscreen)  {
                navigator.splashscreen.hide();
        }
    }


    function bindHardwareButtonHandlers() {

        var platform = GetDevicePlatform();

        if (platform == 'android') {

                    // prevent BackButton exit application on Android
                    document.addEventListener("backbutton", onBackButtonAndroid, false);

                    // menu-button handler on Android
                    if (typeof(navigator.app.overrideButton) == 'function') {

                           navigator.app.overrideButton("menubutton", true);
                           document.addEventListener("menubutton", onMenuButtonAndroid, false);
                    }

        }
        
        
    }


    function onBackButtonAndroid() {

                            // if any modal window open, we should close it first
                            if ($$('.modal-overlay-visible').length) {
                                    f7.closeModal();
                                    return false;
                            }
                        
                            if (leftnav.isVisible()) {

                                    f7.closePanel('left');
                                    return false;
                            }
                            
                            var current_view = f7.getCurrentView();
                           
                            switch (current_view.activePage.name) {
                                    
                                    // while at offer page, or complain page - button Back takes us to list
                                    case 'offer_item':
                                    case 'complain':
                                    case 'complain_form':
                                    
                                        current_view.router.back();
                                        return false;
                                    break;

                                    // at other page - confirm exit application
                                    default:
                                        
                                            exitAppWithConfirm();
                                        
                                    break;

                            }
                        
                            
                                return false;
                                            
                            
    }

    function onMenuButtonAndroid() {
             
             
        if (!leftnav.isVisible()) {

                f7.openPanel('left');
           }
           else {
                f7.closePanel('left');
                
           }
                        
        return false;
    }



            function exitApp() {

                if (navigator.app) {
                    navigator.app.exitApp();
                }
                else if (navigator.device) {
                    navigator.device.exitApp();
                }
                else {
                    window.close();
                }


            }   

            function exitAppWithConfirm () {
                
                    f7.modal({
                            title:  constants.messages.quit_confirmation,
                            
                            buttons: [
                            
                            {
                                text: constants.messages.general_no,
                                onClick: function() {
                                // do nothing
                                
                                }
                            },
                            {
                                text: constants.messages.general_yes,
                                onClick: function() {
                                
                                    exitApp();
                                    
                                }
                            }
                            
                            ]
                        });

            }

            function GetDevicePlatform() {

                var platform = "undefined";
                
                if (typeof(device) != 'undefined') {

                    if (device.platform.toLowerCase() == 'android') {
                        platform = "android";
                    }
                    else if (device.platform.toLowerCase() == 'ios') {
                        platform = "ios";
                    }
                    
                }
                
                
                appState.set("device_platform", platform);
                
                return platform; 
        }



    module.exports =  {

      hideSplashScreen : hideSplashScreen,
      bindHardwareButtonHandlers : bindHardwareButtonHandlers,
      GetDevicePlatform : GetDevicePlatform
    }

