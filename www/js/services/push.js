
    var constants = require('config/constants');

    function init() {

             if (typeof window.plugins != "undefined")  { 

                    if (typeof window.plugins.OneSignal != "undefined")  {

                                    // Enable to debug issues.
                                    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
                                    
                                    window.plugins.OneSignal
                                        .startInit(constants.srf_OneSignalAppID)
                                        .handleNotificationOpened(NotificationOpenCallback)
                                        .endInit();

                    }

                }
            
                window.ProcessInAppAction = ProcessInAppAction;

    }


    function ProcessInAppAction(action_id) {

        switch (action_id) {

            case 'updateNotifications':
                
                // As an example:     controllers.notifications.CleanLocalNotifications();
                // Feel free to implement your own actions

                break; 


            default:
                break;
        }
    }

    function NotificationOpenCallback (jsonData) {
                
            
            // console.log("Notification opened:\n" + JSON.stringify(jsonData));

            if ((typeof jsonData.notification.payload.additionalData.action != "undefined")  && (jsonData.notification.payload.additionalData.action != null)) {
                
                    // like  {"action":"updateNotifications"}
                    ProcessInAppAction(jsonData.notification.payload.additionalData.action);

                    
                
            }
            if ((typeof jsonData.notification.payload.additionalData.link != "undefined")  && (jsonData.notification.payload.additionalData.link != null)) {
                
                    // like  {"link":"offer_item.html?type=offer&id=1109"}
                    var link = jsonData.notification.payload.additionalData.link;

                    require('app').mainView.router.loadPage(link);
                
            }
    }

    module.exports =  {

        init:  init
    }

   

             
            