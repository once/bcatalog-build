
var f7= require('f7'),
    constants = require('config/constants'),
    appConfig= require('config/appconfig'),
    analytics= require('services/ga_analytics'),
    storage= require('services/storage'),
    utility= require('utils/utility');

      var bindings = [{

                element: '#btn-clearcache',
                event: 'click',
                handler: onClearCache,
                onlyOnCurrentPage : true

            }];

            
     function init (page) {

            if (page.from == "right") analytics.trackView('settings'); // Track only if page opened through main menu

            utility.bindEvents(f7.getCurrentView().activePage, bindings);
     }


     function onClearCache() {

           var buttons1 = [
                            {
                                text: constants.messages.settings_data_reload,
                                label: true
                            },
                            {
                                text: constants.messages.general_ok,
                                color: 'red',
                                onClick: function() {
                                    storage.CleanLocalStorageData();
                                    f7.alert(constants.messages.settings_data_reload);
                                }
                            }
                        ];
                        var buttons2 = [
                            {
                                text: constants.messages.general_cancel,
                                bold: true,
                                onClick: function() {
                                }
                            }
                        ];
                        var groups = [buttons1, buttons2];
                        
                        f7.actions(groups);

     }


 
     module.exports = {

         init : init
     }
    
             
            