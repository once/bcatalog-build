
    var f7 = require('f7'),
        constants = require('config/constants'),
        analytics= require('services/ga_analytics'),
        storage = require('services/storage'),
        utility= require('utils/utility');
    

 var bindings = [ {

                element: '#btn-getuserids',
                event: 'click',
                handler: onGetUserIDSClicked,
                onlyOnCurrentPage : true

            },
            {

                element: '#btn-setpushtag',
                event: 'click',
                handler: onSetPushTagClicked,
                onlyOnCurrentPage : true

            },
            {

                element: '#btn-gaappinfo',
                event: 'click',
                handler: onGetGAInfoClicked,
                onlyOnCurrentPage : true

            },
            {

                element: '#btn-codepushinfo',
                event: 'click',
                handler: onCodepushInfoClicked,
                onlyOnCurrentPage : true

            },
            {

                element: '#btn-codepushforce',
                event: 'click',
                handler: onCodepushForceClicked,
                onlyOnCurrentPage : true

            },
            {

                element: '#btn-codepushrestart',
                event: 'click',
                handler: onCodepushRestartClicked,
                onlyOnCurrentPage : true

            },
            {

                element: '#btn-branchinit',
                event: 'click',
                handler: onBranchInitClicked,
                onlyOnCurrentPage : true

            }
            ];


        function init (page) {

                analytics.trackView('developer');

                utility.bindEvents(f7.getCurrentView().activePage, bindings);


        }


            function onGetUserIDSClicked() {

                    window.plugins.OneSignal.getIds(function(ids) {
                                                        f7.alert('UserID: ' + ids.userId);
                                                        f7.alert('PushToken: ' + ids.pushToken);
                                                        
                                                    }); 


            }


            function onSetPushTagClicked() {

                    // It's possible to set OneSignal tags for this specific user
                    // And then use it for some purpose, if you need...

                    f7.prompt('Input push-tag to set', function (value) {
                                if (value) {

                                    f7.alert('Set push tag: ' + value + '');    
                                    window.plugins.OneSignal.sendTag(value, "true");        

                                }
                                else {
                                    f7.alert('No tag set');
                                } 
                                            
                    });

            }


            function onGetGAInfoClicked() {

                f7.alert('GA App Id: ' + constants.srf_gaAppId + '; GA Init Result: ' + window.gaInitResult);

            }

            function onCodepushInfoClicked() {

                // For Code-Push packages testing purposes...
              
                if (typeof window.codePush != "undefined") {

                          codePush.getPendingPackage(function (update) {
                        
                            if (update) {
                                var data = "Pending: YES" ;
                            }
                            else {
                                var data = "Pending: No" ;
                            }

                            showInfo(data);

                        }, function(err) {

                            var data = "Pending: ERROR : "+ err;
                            
                            showInfo(data);
                        });


            }
            else {
                      
                     var data = "window.codePush is undefined!";
                     showInfo(data);
                    
            }


                function showInfo(data) {

                        var data_html=  '<div class="popup"><div class="content-block"><p style="word-break:break-word;">'+data+'</p>'+
                                                            '<p><a href="#" class="close-popup">Close</a></p></div></div>';
                        f7.popup(data_html);

                }
                

            }

            function onCodepushForceClicked() {

                        if (typeof window.codePush != "undefined") {

                                     window.codePush.sync(
                            
                                            function (syncStatus) {
                                                switch (syncStatus) {
                                                    // Result (final) statuses
                                                    case SyncStatus.UPDATE_INSTALLED:
                                                        f7.alert("The update was installed successfully.");
                                                        break;
                                                    case SyncStatus.UP_TO_DATE:
                                                        f7.alert("The application is up to date.");
                                                        break;
                                                    case SyncStatus.UPDATE_IGNORED:
                                                        f7.alert("The user decided not to install the optional update.");
                                                        break;
                                                    case SyncStatus.ERROR:
                                                        f7.alert("An error occured while checking for updates");
                                                        break;
                                                    
                                                    // Intermediate (non final) statuses
                                                    case SyncStatus.CHECKING_FOR_UPDATE:
                                                        console.log("Checking for update.");
                                                        break;
                                                    case SyncStatus.AWAITING_USER_ACTION:
                                                        console.log("Alerting user.");
                                                        break;
                                                    case SyncStatus.DOWNLOADING_PACKAGE:
                                                        console.log("Downloading package.");
                                                        break;
                                                    case SyncStatus.INSTALLING_UPDATE:
                                                        console.log("Installing update");
                                                        break;
                                                }
                                            },
                                            {
                                                installMode: InstallMode.ON_NEXT_RESTART
                                            },
                                            function (downloadProgress) {
                                                console.log("Downloading " + downloadProgress.receivedBytes + " of " + downloadProgress.totalBytes + " bytes.");
                                            }
                                    );

                                }
                                else {
                                    f7.alert ("window.codePush is undefined!");
                                }

            }

            function onCodepushRestartClicked() {
                 
                 if (typeof window.codePush != "undefined") {

                        window.codePush.restartApplication();
                 }
                 else {

                        f7.alert ("window.codePush is undefined!");
                 }
                
                

            }

            function onBranchInitClicked() {

                Branch.initSession().then(function (res) {                  
                    f7.alert('Init Branch session Response: ' + JSON.stringify(res));
                }).catch(function (err) {
                    f7.alert('Error: ' + JSON.stringify(err));
                });



            }

            
            module.exports = {

                init : init
            }
