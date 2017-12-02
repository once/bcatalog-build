(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.srf_app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var f7 = require('f7'),
    template_helpers = require('templates/template_helpers'),
    deviceutils = require('deviceutils'),
    constants = require('config/constants'),
    appConfig = require('config/appconfig'),
    storage = require('services/storage'),
    leftnav = require('modules/navigation/leftnav'),
    push = require('services/push'),
    branchlinks = require('services/branchlinks'),
    analytics = require('services/ga_analytics'),
    version = require('services/version'),
    welcomescreen = require('modules/welcomescreen/welcomescreenController'),
    ads = require('services/ads');

               
        var mainView = f7.addView('.view-main', {
            
            dynamicNavbar: true,
            swipeBackPage: false,
            domCache: true
        });

        window.$$ = Dom7;

       
        var appMain = {

                initialize: function() {

                        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
                        document.addEventListener('pause', this.onPause.bind(this), false);
                        document.addEventListener('resume', this.onResume.bind(this), false);

                },

                onDeviceReady: function() {
                
                        // these actions are performed, while Splash screen is displayed....
                        
                                appConfig.load();

                                push.init(); // OneSignal Push Notification service init
                                branchlinks.init(); // Branch service init
                                analytics.init();  // Init Google Analytics Plugin

                                deviceutils.bindHardwareButtonHandlers();
                                
                                leftnav.init();

                                if (storage.ShouldUpdateDataFromServer()) storage.CleanLocalStorageData();

                                this.syncCodePush();    // update www-contents if available                  
                                
                                this.bindControllers(); 
                                
                                f7.init();
                                
                                saveAppFirstLaunchTimestamp();

                                ads.init();


                        // then we hide Splash Screen

                                deviceutils.hideSplashScreen();
                            
                                welcomescreen.init();

                                version.checkUpdate();

                        
                },

                
                onResume : function() {

                  
                        ads.showInterstitialIfAppropriate(); 

                        branchlinks.BranchResumeSession();

                        this.syncCodePush();    // update www-contents if available
                
                },

                onPause : function() {

                        
                        // warning! on iOS any code, placed into this handler, which calls ANY CORDOVA PLUGiNS, will be executed only after Resume event !!!!
                     

                },


                bindControllers: function () {


                    var moduleControllers = {
                        "offers" : require("modules/list/offerlistController"),
                        "index" : require("modules/list/offerlistController"),
                        "offer_item" : require("modules/offer/offeritemController"),
                        "about" : require("modules/about/aboutController"),
                        "complain" : require("modules/complain/complainController"),
                        "complain_form" : require("modules/complain/complainFormController"),
                        "settings" : require("modules/settings/settings"),
                        "developer" : require("modules/developer/developer"),
                        "favourites" : require("modules/favourites/favouritesController"),

                    };

                        
                    for (pageName in moduleControllers) {

                        f7.onPageInit(pageName, function(page) { 

                               moduleControllers[page.name].init(page);
                               
                        });
                        
                    }


                     f7.onPageReinit("favourites", function(page) {            
                                
                                // required to refresh favourites list when going back from page of Offer, that was removed from favourites!

                               require('modules/favourites/favouritesController').reInit(page);
                        
                     });


                },

                syncCodePush: function() {

                                if (typeof window.codePush != "undefined") {

                                     window.codePush.sync(
                            
                                            function (syncStatus) {
                                                switch (syncStatus) {
                                                    // Result (final) statuses
                                                    case SyncStatus.UPDATE_INSTALLED:
                                                        console.log("The update was installed successfully. For InstallMode.ON_NEXT_RESTART, the changes will be visible after application restart. ");
                                                        break;
                                                    case SyncStatus.UP_TO_DATE:
                                                        console.log("The application is up to date.");
                                                        break;
                                                    case SyncStatus.UPDATE_IGNORED:
                                                        console.log("The user decided not to install the optional update.");
                                                        break;
                                                    case SyncStatus.ERROR:
                                                        console.log("An error occured while checking for updates");
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
                                    console.log ("Problem with codePush: window.codePush is undefined!");
                                }
                }

    };

  

    function saveAppFirstLaunchTimestamp() {
        
        var existingTimestamp = appConfig.get(constants.storage.app_first_launch_timestamp);
        
        if ((existingTimestamp) && (existingTimestamp > 0)) return;

        appConfig.set(constants.storage.app_first_launch_timestamp, Date.now());

    }



module.exports =  {
	
		mainView: mainView,
		appMain : appMain
};




      


    
    
},{"config/appconfig":2,"config/constants":4,"deviceutils":5,"f7":6,"modules/about/aboutController":7,"modules/complain/complainController":9,"modules/complain/complainFormController":10,"modules/developer/developer":11,"modules/favourites/favouritesController":12,"modules/list/offerlistController":16,"modules/navigation/leftnav":24,"modules/offer/offeritemController":32,"modules/settings/settings":36,"modules/welcomescreen/welcomescreenController":37,"services/ads":40,"services/branchlinks":41,"services/ga_analytics":74,"services/push":75,"services/storage":78,"services/version":79,"templates/template_helpers":80}],2:[function(require,module,exports){

    var constants = require('config/constants'),
        storage = require('services/storage');

    var appConfig = {};



    function save() {
        
        storage.setItem(constants.storage.config_persisted,JSON.stringify(appConfig));
    }



    function load() {

        appConfig = JSON.parse(storage.getItem(constants.storage.config_persisted)) || {};

    }


    function set(key, value) {
        
        appConfig[key] = value;
        save();
    }


    function get(key) {
        
        if (typeof appConfig[key] == "undefined") return null;

        return appConfig[key];
    }


    module.exports =  {
        
        save : save,
        load : load,
        get : get,
        set : set


    }

},{"config/constants":4,"services/storage":78}],3:[function(require,module,exports){

    var appState = {};

        init();

        function init(){

            appState.device_platform = "undefined";
            appState.UserPushID = "";  //will be set later in BranchInitSession!!!
    
            window.srfAppState = appState;
        };

    

    function has(key) {

        if ((appState.hasOwnProperty(key)) && (appState[key] != null)) {
            return true;


        }
        else {

            return false;
        }
    }

    function get(key) {

       if (has(key)) {
            return appState[key];
        }
        else {
            return null;
    }

       
    }

    function set(key, value) {

       appState[key] = value; 
       window.srfAppState = appState;
    }
        

    window.as_set = set;
    window.as_get = get;

    module.exports = {

                
        init : init,
        get : get,
        set : set
    
    }

},{}],4:[function(require,module,exports){
// ProductCatalog app constants

module.exports = {

        
            srf_app_name : "Product Catalog",
            srf_app_version : "4.0",


            // Data update intervals
            srf_data_update_interval : 43200000, // 12h * 60min * 60sec * 1000 msec = 43200000 msec
            // app will check and udpdate local cache data from server if last update time exceeds this value


            // API Config
            srf_api_uri : 'https://yoursite.com/api/',   // set to your server API after implementing it. It should return JSON
            server_api_request_timeout : 20000,  // msec


            //About page
            srf_contact_email : 'support@yoursite.com',
            srf_contact_phone : '+21 (922) 700-10-10',
            srf_contact_webpage1  : 'https://yoursite.com',

            srf_googleProjectNumber : "XXXXXXXXXXXXXXXXXXX", // REPLACE WITH YOUR GOOGLE PROJECT NUMBER  - required for OneSignal push notifications integration

            // Google Analytics 
            srf_gaAppId : "YOUR-GOOGLE-ANALYTICS-ID",         // Google Analytics App Identifier 
            srf_gaDispatchInterval : 30,        // dispatch interval in seconds
            
            
            // OneSignal Push Notification Service Configuration //        
            srf_OneSignalAppID : "fake_id",    


            // Branch Link Sharing settings
            srf_linksharing_feature : 'referral',
            srf_linksharing_canonicalIdentifier : 'fake_branch_id',
			srf_linksharing_contentImageUrl : 'fake_url',
            srf_linksharing_oncomplete_text : 'Thank you for sharing a link!',
            srf_linksharing_text : 'Hello. Try this application',
            srf_linksharing_title : 'I would like to recommend you an app',

            imagesLazyLoadPlaceholder : 'img/noimg.png',
            undefined_mark : "UNDEFINED",  // a string, placed as VALUE in analytics for any parameter, if no actual value has been defined..
            
            
            // Local storage item names
            storage : {

                    app_first_launch_timestamp : "app_first_launch_timestamp",
                    filterdata_prefix : "srf_filterdata",
                    priority_categories : "srf_priority_categories",
                    config_persisted  : "srf_config_persisted",
                    config_data_last_updated : "srf_config_data_last_updated",
                    favourites : "srf_favourites",
                

                },

           
           // Resource strings  -  Edit this to localize your application!
           messages : {
                sections : {
                    "offers": {
                        title : "Offers",
                        headerText : "Select category",
                        selectorHeaderText : "Select category",
                        filters : {
                            vertical : {
                                items_filter_by_field_display_name : "Category",
                                all_selector_name : "All categories"
                            }
                        }
                        
                    },
                    "foods": {
                        title : "Food market",
                        headerText : "Advertiser",
                        selectorHeaderText : "Select advertiser",
                        filters : {
                            vertical : {
                                items_filter_by_field_display_name : "Advertiser",
                                all_selector_name : "All advertisers"
                            },
                            horizontal : {
                                items_filter_by_field_display_name : "Category",
                                all_selector_name : "All categories"
                            }
                        }
                        
                    },
                    "events" : {
                        title : "Events"
                    }
                    ,
                    "news" : {
                        title : "News"
                    }
                    ,
                    "contacts" : {
                        title : "About"
                    },
                    "favourites" : {
                        title : "Favourites"
                    },
                    "settings" : {
                        title : "Settings"
                    }

                },
              
                general_yes : "Yes",
                general_no : "No",
                general_ok : "OK",
                general_cancel : "Cancel",
                general_skip : "Skip",
                quit_confirmation : "Quit application?",
                update_confirmation : "An update is available. Download it?",
                complain_confirmation: "Thank you for your report. We will check this offer and fix the problem with it.",
                error_internet_connection_poor : "Error occured while sending. Please check your Internet-connection and try again.",
                error_no_connection : "Could not connect to server. Please check your connection and try again later.",
                error_no_connection_short : "No connection",
                problem_description_required : "Problem description is required field!",
                error_codepush_undefined : "Problem with codePush: window.codePush is undefined!",
                error_codepush_errorwithdetails : "CodePush Problem: error while getting current update version. Error: ",
                settings_data_reload : "Data will be refreshed from server",
                favourites_add : "Add to favourites",
                favourites_added : "In favourites",
                favourites_remove_confirm : "Do you really want to remove this from favourites?",
                favourites_remove_expired_confirm : "This item is expired. Remove it from favourites?",
                favourites_already_added : "Item already in favourites",
                categories_all : "All categories",
                advertisers_all : "All advertisers",
                error_linksharing_notgenerated :  "Error while generating short link possibly due to poor internet connection. Please try again later."

           } 

        }
},{}],5:[function(require,module,exports){

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


},{"config/appstate":3,"config/constants":4,"f7":6,"modules/navigation/leftnav":24}],6:[function(require,module,exports){

var constants = require('config/constants');

        var f7 = new Framework7({
            init: false,
            cache: true,
            swipePanel: 'left',
            modalTitle :  constants.srf_app_name,
            modalButtonOk: constants.messages.general_ok,
            modalButtonCancel: constants.messages.general_cancel,
            animatePages: true,     
            precompileTemplates: false,
            preloadPreviousPage: true,
            allowDuplicateUrls: false,

            /// For performance optimization
            /////animatePages: false,
            animateNavBackIcon: false,
            sortable: false,                  // not using sortable lists     
            swipeBackPage: false,
            swipeBackPageAnimateShadow: false,
            swipeBackPageAnimateOpacity: false,
            swipeout : true,
            swipeoutNoFollow:false,
            swipePanelNoFollow:true,
            swipePanelActiveArea: 15,
            //Lazy Loading
            imagesLazyLoadPlaceholder: constants.imagesLazyLoadPlaceholder,
            imagesLazyLoadThreshold: 200,
            
        });

        window.f7 = f7;
        
module.exports = f7;
        

},{"config/constants":4}],7:[function(require,module,exports){

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

},{"app":1,"config/constants":4,"f7":6,"modules/about/aboutView":8,"services/browser":42,"services/ga_analytics":74}],8:[function(require,module,exports){

    var f7 = require('f7'),
        aboutTemplate = "<div class=\"content-block block-nospacebefore\">\r\n      <div class=\"content-block-inner\">\r\n       <p><span class=\"apptitle-prefix\">Mobile application</span><br>\r\n       <span class=\"apptitle\">{{js \"this.apptitle.toUpperCase()\"}}</span><span class=\"version\">, v.{{appversion}}</span></p>\r\n       <p>Please contact us if you want to place ads in the app, or if you have any questions:</p>\r\n\r\n      </div>\r\n    </div>\r\n      <div class=\"list-block block-nospacebefore\">\r\n          \r\n      <ul>\r\n        <li>\r\n          <a class=\"item-content item-link external\" href=\"mailto:{{email}}\">\r\n          <div class=\"item-media\"><i class=\"icon-envelope-o\"></i></div>\r\n          <div class=\"item-inner\">\r\n            <div class=\"item-title\">Write e-mail</div>\r\n           \r\n          </div>\r\n          </a>\r\n        </li>\r\n        <li>\r\n          <a class=\"item-content item-link external open-inappbrowser\" data-href=\"{{webpage1}}\">\r\n          <div class=\"item-media\"><i class=\"icon-sphere\"></i> </div>\r\n          <div class=\"item-inner\">\r\n            <div class=\"item-title\">{{webpage1}}</div>\r\n           \r\n          </div>\r\n          </a>\r\n        </li>\r\n        <li>\r\n           <a class=\"item-content item-link external\" href=\"tel:{{phone}}\"> \r\n          <div class=\"item-media\"><i class=\"icon-phone\"></i></div>\r\n          <div class=\"item-inner\">\r\n            <div class=\"item-title\">{{phone}}</div>\r\n           \r\n          </div>\r\n          </a>\r\n        </li>\r\n      </ul>\r\n     \r\n      <div class=\"list-block-label\">Place some additional information here.</div>\r\n      \r\n      \r\n    </div>\r\n    \r\n    <div class=\"content-block\" style=\"margin-top:100px;\">\r\n          <p><a style=\"font-size: .95em;\" href=\"#\" class=\"prompt-console\">Developer console</a></p>\r\n          \r\n          \r\n      </div>",
        utility = require('utils/utility');

    var aboutCompiledTemplate = Template7.compile(aboutTemplate);
    
    function render(contact_data, bindings) {

        $$(f7.getCurrentView().activePage.container).find('.page-content').html(aboutCompiledTemplate(contact_data));

        utility.bindEvents(f7.getCurrentView().activePage, bindings);
        
    }


    
    module.exports = {

        render : render
    }





},{"f7":6,"utils/utility":81}],9:[function(require,module,exports){

    var f7 = require('f7'),
        constants = require('config/constants'),
        analytics= require('services/ga_analytics'),
        serverapi = require('services/serverapi'),
        utility= require('utils/utility');
  

      var from_offer_id;
      var from_offer_type;

      var bindings = [{

                element: '.complain-answer',
                event: 'click',
                handler: onComplainAnswerClicked,
                onlyOnCurrentPage : true

            }];

    function init (page) {

        if (page.from == "right") analytics.trackView('complain');  // Track page only if open through menu
            
        from_offer_id = page.fromPage.query.id;
        from_offer_type = page.fromPage.query.type;

        utility.bindEvents(f7.getCurrentView().activePage, bindings);


    }

     function onComplainAnswerClicked() {

            var compl_id = $$(this).data('id') || 0;
            var compl_text = $$(this).text() || '';

            ConfirmComplainAndSend({
                complain_id: compl_id,
                complain_text : compl_text

            });

    }


    function ConfirmComplainAndSend(params) {

        var compl_id = params.complain_id || '';
        var compl_text = params.complain_text || '';


           // if ((typeof window.plugins != "undefined") && (typeof window.plugins.OneSignal != "undefined"))  {              // we need user OneSignal Push_ID

                //    window.plugins.OneSignal.getIds(function(ids) {
            
                                var push_user_id =  7;//ids.userId;
                                var push_user_token =  7;//ids.pushToken;

                                f7.modal({
                                    title:  'Please confirm',
                                    text: 'You have selected option: <b>' +compl_text+ '</b>. Please confirm sending.',
                                    
                                    buttons: [
                                    {
                                        text: 'No',
                                        onClick: function() {}
                                    },
                                    {
                                        text: 'Yes',
                                        onClick: function() {

                                            var complain_data = {
                                                    user_id: push_user_id,
                                                    user_token: push_user_token,
                                                    offer_type: from_offer_type,
                                                    offer_id: from_offer_id,
                                                    complain_id: compl_id,
                                                    complain_text: compl_text
                                            };
                                            
                                            SendComplainAndGoBack(complain_data);
                                        }
                                    }]
                                });   
           //     }); 
        
           // }
           // else {
                // OneSignal initialization error
          //      analytics.trackEvent ('Errors','Offer_Complain_Send_OneSignalUnavailableError');
         //       f7.alert(constants.messages.error_internet_connection_poor);
         //   }
            


    }

   
    function SendComplainAndGoBack(complain_data) {

            serverapi.SendComplain(complain_data,function() {

                var current_view = f7.getCurrentView();

                f7.alert(constants.messages.complain_confirmation, 'Thank you', function () {

                            current_view.router.back();

                    });

            }, function() {

                f7.alert(constants.messages.error_internet_connection_poor);

            });
    }



    module.exports = {

        init : init,
        ConfirmComplainAndSend : ConfirmComplainAndSend
        
    }

},{"config/constants":4,"f7":6,"services/ga_analytics":74,"services/serverapi":77,"utils/utility":81}],10:[function(require,module,exports){

    var f7 = require('f7'),
        constants = require('config/constants'),
        analytics= require('services/ga_analytics'),
        utility= require('utils/utility');
  
      var bindings = [{

                element: '#report',
                event: 'click',
                handler: onReportClicked,
                onlyOnCurrentPage : true

            }];

     function init (page) {

            analytics.trackView('complain_form');

            utility.bindEvents(f7.getCurrentView().activePage, bindings);

    }

    function validateDescription() {
        
        if (!($$('#fld-description').val().trim())) { 
                f7.alert(constants.messages.problem_description_required);
                return false;
        }
        
        return true;

    }

    function onReportClicked() {

            if (!validateDescription()) return false;
            
            var compl_text =$$('#fld-description').val();
            
            require('modules/complain/complainController').ConfirmComplainAndSend({
                complain_id: 5,
                complain_text : compl_text
            });


    }

module.exports = {

    init: init
}

},{"config/constants":4,"f7":6,"modules/complain/complainController":9,"services/ga_analytics":74,"utils/utility":81}],11:[function(require,module,exports){

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

},{"config/constants":4,"f7":6,"services/ga_analytics":74,"services/storage":78,"utils/utility":81}],12:[function(require,module,exports){

var f7 = require('f7'),
    constants = require('config/constants'),
    analytics = require('services/ga_analytics'),
    Navigation = require('modules/navigation/navigationController'),
    utility = require('utils/utility'),
    lazyload = require('modules/list/lazyload'),
    favouritesModel = require('modules/favourites/favouritesModel'),
    favouritesView = require('modules/favourites/favouritesView');

     var bindings = [ {

                element: '.remove-from-favs',
                event: 'click',
                handler: onRemoveFromFavouritesClick,
                onlyOnCurrentPage : true

            },
            {

                element: '.expired',
                event: 'click',
                handler: onExpiredClick,
                onlyOnCurrentPage : true

            },
            {

                element: '.pull-to-refresh-content',
                event: 'refresh',
                handler: onPTRRefresh,
                onlyOnCurrentPage : true

            }];



      function init(page) {
                                          
                
                if (page.from != "left") {  // if the page was open through menu
                    
                    navigation = new Navigation("favourites", false);
                    render();
                    analytics.trackView("favourites");
        
                } 
    }


    function render() {
            favouritesView.render({items : favouritesModel.load(), postRenderCallback : postRenderCallback});
    }


    function reInit(page) {
       favouritesView.update({items : favouritesModel.load()});
    }

    
    function postRenderCallback() {
                                
                f7.pullToRefreshDone();                                
                utility.bindEvents(f7.getCurrentView().activePage, bindings);
                
                lazyload.init();

    }
    
    function onPTRRefresh() {
       
        render();

    }


    function onRemoveFromFavouritesClick(e) {

        var item_index = $$(this).data('index') || null;
        var item_id = $$(this).data('id') || null;
        
        if (item_id && item_index) {

                 f7.modal({
                            text: constants.messages.favourites_remove_confirm,
                            buttons: [
                            {
                                text: constants.messages.general_no,
                            },
                            {
                                text: constants.messages.general_yes,
                                bold: true,
                                onClick: function() {

                                    favouritesView.deleteItem(item_id);
                                    favouritesModel.remove(item_index);
                                    
                                }
                            }]
                        });
        }
    }

    function onExpiredClick(e) {

        var item_index = $$(this).data('index') || null;
        var item_id = $$(this).data('id') || null;

        if (item_id && item_index) {

                    f7.modal({
                                text: constants.messages.favourites_remove_expired_confirm,
                                buttons: [
                                {
                                    text: constants.messages.general_no,
                                },
                                {
                                    text: constants.messages.general_yes,
                                    bold: true,
                                    onClick: function() {

                                        favouritesView.deleteItem(item_id);
                                        favouritesModel.remove(item_index);
                                        
                                    }
                                }]
                            });
            }

    }

    function add(item) {

        favouritesModel.add(item);
    }

    function removeById(id) {

        favouritesModel.removeById(id);
              
                 
                  
    }

     function itemInFavourites(item) {


        
        return favouritesModel.itemInFavourites(item);

    }

    

    module.exports =  {
        init : init,
        reInit : reInit,
        add : add,
        removeById : removeById,
        itemInFavourites : itemInFavourites
    }

},{"config/constants":4,"f7":6,"modules/favourites/favouritesModel":13,"modules/favourites/favouritesView":14,"modules/list/lazyload":15,"modules/navigation/navigationController":27,"services/ga_analytics":74,"utils/utility":81}],13:[function(require,module,exports){
    
    var constants = require('config/constants'),
        storage= require('services/storage'),
        utility= require('utils/utility');
    
    var favouritesArray = [];

    favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];

    function add(item) {

        if (item) {
           
                if (!itemInFavourites(item)) {
                    
                    favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];

                    var item_to_add = {
                        id : item.id,
                        name : item.name,
                        metakeywords : item.metakeywords,
                        event_datetime : item.event_datetime,
                        category : item.category,
                        img : item.img,
                        discount_size : item.discount_size,
                        advertiser : item.advertiser,
                        pr_cat : item.pr_cat,
                        exclusive : item.exclusive,
                        system_date_to : item.system_date_to,
                        modify_date : item.modify_date
                    };

                    favouritesArray.unshift(item_to_add);
                    storage.setItem(constants.storage.favourites, JSON.stringify(favouritesArray));
                }
                else {

                    console.log(constants.messages.favourites_already_added);
                }
        }
        
        
    }
    
    function itemInFavourites(item) {


        if (favouritesArray.find(function(arrayitem, index, ar) {
                    return arrayitem.id == item.id ? true : false;

        })) {

            return true;
        }
        
        return false;

    }

    function removeById(id) {
              
              favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];
            
              if (favouritesArray.length) {
                  
                  var item_index = favouritesArray.findIndex(function(element, index, ar) {
                        return element.id == id ? true : false;
                  });

                  if (item_index != -1 ) {
                    favouritesArray.splice(item_index,1);   
                    storage.setItem(constants.storage.favourites, JSON.stringify(favouritesArray));
                  }
                  
                  
            }

    }


    function remove(index) {

          favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];
          
          favouritesArray.splice(index,1);
          
          storage.setItem(constants.storage.favourites, JSON.stringify(favouritesArray));

    }
    
    function load() {

        var items = JSON.parse(storage.getItem(constants.storage.favourites)) || [];
        var priority_categories = JSON.parse(storage.getItem(constants.storage.priority_categories)) || [];


        items.forEach(function(item, index, ar) {
            
                items[index].expired=utility.IsItemExpired(item);

                if (priority_categories.length) {

                        // Adding classes for priority categories
                        item.pr_class = priority_categories[item.pr_cat].class;
                        item.pr_order = priority_categories[item.pr_cat].disp_order;           

                }
            
        });

        items = sort(items);

        return items;

    }

    function sort(items) {


        items = utility.SortArrayBy(items, "pr_order","int", "asc");// Sorting by priority categories
        items = utility.SortArrayBy(items, "expired","int", "asc"); // Sorting by "expired" field - all expired items go in the end
        return items;
    }

    module.exports = {
        add : add,
        remove : remove,
        removeById : removeById,
        itemInFavourites : itemInFavourites,
        load : load

    }

},{"config/constants":4,"services/storage":78,"utils/utility":81}],14:[function(require,module,exports){


   var f7 = require('f7'),
       favouritesTemplate = "<li class=\"swipeout {{#if expired}}{{else}}{{pr_class}}{{/if}}\">\r\n                <div class=\"swipeout-content\">\r\n                                     {{#if expired}}\r\n                                     <a data-id=\"{{id}}\" data-index=\"{{@index}}\" href=\"#\" class=\"item-link item-content expired\">\r\n                                     {{else}}\r\n                                     <a href=\"offer_item.html?type=offers&id={{id}}\" class=\"item-link item-content\">\r\n                                     {{/if}}\r\n                                    <div class=\"item-media\"><img class=\"srf-offerlist-image lazy lazy-fadein\" data-src=\"{{img}}\" >\r\n                                    </div>\r\n                                        <div class=\"item-inner\">\r\n                                            <div class=\"{{#if expired}}offer-expired-title{{/if}} item-title-row\">\r\n                                                {{name}}\r\n                                            </div>\r\n                                            <div class=\"item-subtitle\">\r\n                                             {{#if expired}}\r\n                                                <span class=\"offer-expired-info\">Offer expired</span>\r\n                                                {{else}}\r\n                                                {{#if discount_size}}<span class=\"offer-percent-list\">{{discount_size}}</span>{{/if}}\r\n                                                {{#js_compare \"this.exclusive != 0\"}}<span class=\"offer-exclusive\">Exclusive</span>{{/js_compare}}\r\n                                                {{/if}}\r\n                                        </div>\r\n                                            <div class=\"{{#if expired}}offer-expired-advertiser{{/if}} item-text\">\r\n                                                {{advertiser}}\r\n                                            </div>\r\n                                    </div>\r\n                                </a>\r\n                </div>\r\n                <div class=\"swipeout-actions-right\">\r\n                    <a class=\"bg-red remove-from-favs\" data-id=\"{{id}}\" data-index=\"{{@index}}\" href=\"#\">Remove from<br/>favourites</a>\r\n                </div>\r\n            </li>",
       noDataTemplate = "<div class=\"no-data-message\">\r\n    <p>You have no Favourties yet.</p>\r\n    <p>\r\n        <a href=\"offers.html?section=offers\" class=\"button button-big button-fill\">View all offers</a>\r\n    </p>\r\n</div>",
       noDataTemplateCompiled = Template7.compile(noDataTemplate),
       items,
       postRenderCallback,
       selectorVList,
       vList;

    function  render(params) {

        var params = params || {};

        items = params.items || [];
        postRenderCallback = params.postRenderCallback || {};
        selectorVList = $$(f7.getCurrentView().activePage.container).find('.virtual-list');


                    if (items.length > 0) {

                                var paramsVList = {
                                            items: items,
                                            cache : true,
                                            height: 96,        // it's height of <li> with it's margin-bottom! now it's 90px+6px !!!
                                            template: favouritesTemplate,
                                            item_multiplier: 1,
                                            //add_height: 50,  // if needed, can add to vList height
                                            callback: postRenderCallback
                                };

                                vList = f7.virtualList(selectorVList, paramsVList);

                
                }
                else {   // "no offfers available" message

                     renderNoData();

                } 
    }

    function update(params) {

        items = params.items || [];
        vList.items = items;
        vList.update();
        
        if (vList.items.length == 0) renderNoData();
    }

    function renderNoData () {
        
        selectorVList.html(noDataTemplateCompiled());
        postRenderCallback();

        
    }


    function deleteItem(id) {
        
        vList.items.forEach(function(element, index ,ar) {
            if (element.id == id) found_index = index;

        });
        
        vList.deleteItem(found_index);

        if (vList.items.length == 0) renderNoData();
        
    }


    module.exports = {

        render : render,
        update : update,
        deleteItem : deleteItem
    }


},{"f7":6}],15:[function(require,module,exports){

  var f7 = require('f7');

 
  function init() {
                
         f7.initImagesLazyLoad(f7.getCurrentView().activePage.container);
    
 }

    function trigger() {
            $$('img.lazy').trigger('lazy');  
    }
    


    module.exports = {

        init: init
    };
},{"f7":6}],16:[function(require,module,exports){
    
    var f7 = require('f7'),
        appConfig = require('config/appconfig'),
        appState = require('config/appstate'),
        constants = require('config/constants'),
        storage= require('services/storage'),
        Navigation= require('modules/navigation/navigationController'),
        ptr= require('modules/list/ptr'),
        lazyload= require('modules/list/lazyload'),
        search= require('modules/search/search'),
        analytics= require('services/ga_analytics'),
        offerlistModel= require('modules/list/offerlistModel'),
        offerlistView= require('modules/list/offerlistView'),
        utility= require('utils/utility'),
        favourites= require('modules/favourites/favouritesController'),
        browser= require('services/browser');
    
            
    var offerListItems = [],
        offerListFilters,
        offerListSection,
        activePageName,
        activeCategoryId,
        activeCategoryName,
        activeAdvertiserId,
        activeAdvertiserName;
            
            
        var bindings = [ 
            {

            element: document,
            delegate: '.add-to-favourites',
            event: 'click',
            handler: onAddToFavouritesClick,
            onlyOnCurrentPage : false

        },
        {

            element: document,
            delegate: '.remove-from-favourites',
            event: 'click',
            handler: onRemoveFromFavouritesClick,
            onlyOnCurrentPage : false

        },
        {
            element: '.external.open-inappbrowser',
            event: 'click',
            handler:  browser.HandleExternalLink,
            onlyOnCurrentPage : true

        }
        ]

        var bindings_nodata = [ 
            {

            element: '#show-all',
            event: 'click',
            handler: onShowAllClick,
            onlyOnCurrentPage : true

        }
        ];
            


            function init(page) {

                activePageName = page.name;
                                          
                offerListSection = page.query.section || "offers";

                if (page.from != "left") {  // if the page was open through menu
                    
                    activeCategoryId = 0;
                    activeCategoryName = constants.messages.categories_all;
                    activeAdvertiserId = 0;
                    activeAdvertiserName = constants.messages.advertisers_all;
                    offerListFilters = [];  // reset filters

                    // Render items
                                     
                    if (storage.ShouldUpdateDataFromServer())  storage.CleanLocalStorageData();

                    navigation = new Navigation(offerListSection, false);
                    
                    getItems(false);

                    ptr.init();
                    search.initSearchBar();
                    
                    
                } 
                                                           
            }



            function addFilter(filter) {

                // one filter can be applied only once - if this filter has already been applied, it will be overwritten
                for (var i=0; i < offerListFilters.length; i++) {
                    if (offerListFilters[i].filter_field === filter.filter_field ) {
                            offerListFilters.splice(i,1);
                    }
                }
                
                offerListFilters.push(filter);
                
                switch (filter.filter_field) {

                    case "category":
                        activeCategoryId = filter.filter_value_id || 0;
                        activeCategoryName = filter.filter_value_name || constants.messages.categories_all;
                        break;
                    case "advertiser_id":
                        activeAdvertiserId = filter.filter_value_id || 0;
                        activeAdvertiserName = filter.filter_value_name || advertisers_all;
                        break;
                    default:
                        break;
                }

                getItems(false);   // get items with filters applied
               
            }



            function resetFilters() {
                
                offerListFilters = [];
                navigation = new Navigation(offerListSection, false);
                getItems(false);
            }



            function getItems (refresh) {
    
                var results = refresh ? [] : JSON.parse(storage.getItem('srf_'+ offerListSection)) || [];
                
                if (results.length === 0) {
                        
                        if (!refresh) {
                            $$('.page-content .listpreloader').show();
                        }
                        
                        offerlistModel.load(offerListSection, loadedSuccess, loadedFailure);

                        function loadedSuccess(results) {

                                offerListItems = results;
                                render();

                                f7.pullToRefreshDone();
                                if (!refresh) $$('.page-content .listpreloader').hide();

                         }

                         function loadedFailure(xhr) {

                                $$('.page-content .listpreloader').hide();
                                f7.pullToRefreshDone();
                                f7.alert(constants.messages.no_connection);
                         }
                } 
                else {

                    offerListItems = results;
                    render();
                }      
                
                return results;
            }



            function render() {

                    var items = offerlistModel.getItemsForRendering(offerListItems,offerListSection,offerListFilters);

                    if (items.length) {
                        offerlistView.render(offerListSection, items, postRenderCallback);
                    }
                    else {
                        offerlistView.renderNoData(offerListFilters, bindings_nodata);
                    }

                    // the first view of list on application launch will not be tracked in Google Analytics
                    // (because this view was forced, the user didn't choose it himself)
                    if (!((activePageName == "index") && (offerListFilters.length == 0)))  analytics.trackView(offerListSection, activeCategoryName, activeAdvertiserName, activeAdvertiserId);

            }


            function postRenderCallback() {
                                 
                    utility.bindEvents(f7.getCurrentView().activePage, bindings);
                    
                    lazyload.init();
                    
            }

            function getItemIdForDOMElement(element) {
                
                if (element) return $$(element).closest('li').data('id') || null;
            }



            function onAddToFavouritesClick(e) {

                e.stopImmediatePropagation(); // it's required to suppress onRemoveFromFavouritesClick handler
                
                var item_id = getItemIdForDOMElement(this);
                if (item_id) {

                    favourites.add( getItemById(item_id) );

                    offerlistView.SetItemIsInFavourites(this);  // visual update
                        
                }
            }
           
             function onRemoveFromFavouritesClick(e) {

                e.stopImmediatePropagation();       // it's required to suppress onRemoveFromFavouritesClick handler

                var item_id = getItemIdForDOMElement(this);
                if (item_id) {

                    favourites.removeById(item_id);
                    
                    offerlistView.SetItemNotInFavourites(this);  // visual update
                   
                }
               
            }
            
            
            function getItemById(item_id) {

                if (!item_id) return null;

                var item = offerListItems.find(function(element, index, arr){
                
                    return element.id == item_id ? true : false;

                });

                return item;

            }



            function onShowAllClick(e) {
                    resetFilters();

            }
           



module.exports = {

    init : init,
    getItems : getItems,
    addFilter : addFilter
}


},{"config/appconfig":2,"config/appstate":3,"config/constants":4,"f7":6,"modules/favourites/favouritesController":12,"modules/list/lazyload":15,"modules/list/offerlistModel":17,"modules/list/offerlistView":19,"modules/list/ptr":20,"modules/navigation/navigationController":27,"modules/search/search":35,"services/browser":42,"services/ga_analytics":74,"services/storage":78,"utils/utility":81}],17:[function(require,module,exports){
    
    var constants = require('config/constants'),
        storage = require('services/storage'),
        serverapi = require('services/serverapi'),
        utility= require('utils/utility'),
        favourites= require('modules/favourites/favouritesController');
        

        function load(itemtype, loadedSuccessCallback,loadedFailedCallback) {

            serverapi.loadOffers(itemtype, onItemsLoaded, loadedFailedCallback);
            
            function onItemsLoaded(data) {

                data = JSON.parse(data);

                if (data.prior_categories) loadPriorityCategories(data.prior_categories);
                var results = filterExpired(data);
                
                storage.updateLocalData(itemtype, results);
                loadedSuccessCallback(results);

            }
        }
        
        function loadPriorityCategories(pr_cats_data) {
            
        var priority_categories = [{}];  // Empty 0 category is required for correct work! Don't remove!
        
            if (pr_cats_data && pr_cats_data.length) {
                    pr_cats_data.forEach(function(item, index) {
                    priority_categories[item.id] = item;
                });

                storage.setItem(constants.storage.priority_categories,JSON.stringify(priority_categories));
            }

        }

        function getItemsForRendering(items, itemtype, filters, category) {

            items = filter(items, filters);

            items = preRenderProcessItems(items);
                    
            items = sort(items, itemtype, category);   // sort AFTER preRender filtering, as "pr_order" is set there!
                    
            return items;
        }


        function preRenderProcessItems(items){ // set additional properties, used while rendering

                var priority_categories = JSON.parse(storage.getItem(constants.storage.priority_categories)) || [];
                items.forEach(function(item, index) {

                    item.isFavourite = favourites.itemInFavourites(item);
                    
                    if (priority_categories.length) {

                        // Adding classes for priority categories
                        item.pr_class = priority_categories[item.pr_cat].class;
                        item.pr_order = priority_categories[item.pr_cat].disp_order;           

                    }
                    

                }); 

                return items;
                
         
            }

        
        function filterExpired(data) {

                var results = [];
                data.offers.forEach(function(item, index) {

                    if (!utility.IsItemExpired(item)) { // add only items that are not expired
                        
                        results.push(item);
                    } 
                    
                });

                return results;

        }


        function sort(items, itemtype, filters) {
    
                    
                    var first_sort_order = "order_section"; // by default we sort by  "Order in section"

                    for (var filter in filters) {  // But if category is defined, then "Order in category is used"
                         if (filter.filter_field == 'category') first_sort_order = "order_category";
                     }
   
                    // Set additional sorting criteria based on type of items...
                    var second_sort_order = "id";  //default;
                    var second_sort_direction = "desc"; //default
                    var second_sort_fieldtype = "int"; //default

                    var priority_sort_order = "pr_order";  //default;
                    
                    if ((itemtype == 'foods')) {
                                
                        second_sort_order = "name";
                        second_sort_direction = "asc";
                        second_sort_fieldtype = "string";
                    
                    }
                    else {
                                
                        second_sort_order = "modify_date";    //"id";     
                        second_sort_direction = "desc";  
                        second_sort_fieldtype = "int";
                    
                    }

                    // Apply sortings 
                    // Sorting must go in reverser order! So the most priority sorting criteria should go last(final)!
        
                    var firstSortedArray = utility.SortArrayBy(items, second_sort_order, second_sort_fieldtype, second_sort_direction);
                    var secondSortedArray = utility.SortArrayBy(firstSortedArray, first_sort_order,"int", "asc");
                    var prioritySortedArray = utility.SortArrayBy(secondSortedArray, priority_sort_order,"int", "asc");
                    
                    items = prioritySortedArray;

                    return items;

        }

        function filter(items, filters) {
                
                if (!filters.length) return items;
                
                for (var i=0;i< filters.length; i++) {
                    if (filters[i].filter_type == "range_match") {

                        filters[i].values_range = require("modules/navigation/categories").getSubCategories(filters[i].filter_value_id);
                            
                    }
                
                }
                
                return applyFilterCollection();


                function applyFilterCollection() {

                        var items_filtered = items.filter(function(item, index, ar) {

                                for (var i=0;i< filters.length; i++) {

                                    if (!passFilter(item, filters[i])) return false;

                                }

                                // if all filters passed, element is returned to be displayed
                                return true;
                        });

                        return items_filtered;

                }

                function passFilter(item, filter) { 

                    if ((!filter.filter_value_id) || (filter.filter_value_id == "0")) return true;  // if property is empty, we don't use it for filtering
                                            
                    if (filter.filter_type == "range_match") {

                        filter_Function = filter_RangeMatch;
                    }
                    else {
                        
                        filter_Function = filter_ExactValue;

                    }
                                    
                    return filter_Function(item,filter);
                }

                // chec for exact value matching
                function filter_ExactValue(item, filter) {
                    
                    return item[filter.filter_field] == filter.filter_value_id;
                    
                }

                // check for range matching
                function filter_RangeMatch(item, filter) {
                        
                        if (item[filter.filter_field] == filter.filter_value_id) return true;

                        if ((filter.values_range) && (filter.values_range.length)) {
                            
                            if (filter.values_range.includes(item[filter.filter_field])) return true;
                        
                        }
                            
                        return false;

                }
        }



    module.exports = {

            load : load,
            filter : filter,
            sort : sort,
            getItemsForRendering : getItemsForRendering
            

    }

},{"config/constants":4,"modules/favourites/favouritesController":12,"modules/navigation/categories":21,"services/serverapi":77,"services/storage":78,"utils/utility":81}],18:[function(require,module,exports){
// Data rendering templates

    var templates = {
    'offers': { template: "<li class=\"swipeout {{pr_class}}\" data-id=\"{{id}}\" data-index=\"{{@index}}\">\r\n                <div class=\"swipeout-content\">\r\n                                     <a href=\"offer_item.html?type=offers&id={{id}}\" class=\"item-link item-content\">\r\n                                    <div class=\"item-media\"><img class=\"srf-offerlist-image lazy lazy-fadein\" data-src=\"{{img}}\" >\r\n                                    </div>\r\n                                        <div class=\"item-inner\">\r\n                                            <div class=\"item-title-row\">\r\n                                                {{name}}\r\n                                            </div>\r\n                                            <div class=\"item-subtitle\">                \r\n                                                {{#if discount_size}}<span class=\"offer-percent-list\">{{discount_size}}</span>{{/if}}                                \r\n                                                {{#js_compare \"this.exclusive != 0\"}}<span class=\"offer-exclusive\">Exclusive</span>{{/js_compare}}\r\n                                            </div>\r\n                                            <div class=\"item-text\">\r\n                                                {{advertiser}}\r\n                                            </div>\r\n                                    </div>\r\n                                </a>\r\n                </div>\r\n                <div class=\"swipeout-actions-right\">\r\n                    {{#if isFavourite}}\r\n                    <a class=\"bg-green remove-from-favourites\" href=\"#\"><i class=\"f7-icons size-22\">check</i>&nbsp;In favourites</a>\r\n                    {{else}}\r\n                    <a class=\"bg-blue add-to-favourites\" href=\"#\">To favourites</a>\r\n                    {{/if}}\r\n                </div>\r\n            </li>" },
    'foods': { template: "<li data-id=\"{{id}}\" data-index=\"{{@index}}\" class=\"swipeout {{pr_class}}\">\r\n    <div class=\"swipeout-content\">\r\n        <a href=\"offer_item.html?type=foods&amp;id={{id}}\" class=\"item-link item-content\">\r\n            <div class=\"item-media\">\r\n                <img class=\"srf-offerlist-image lazy lazy-fadein\" data-src=\"{{img}}\" >\r\n            </div>\r\n            <div class=\"item-inner\">\r\n                <div class=\"item-title-row\">\r\n                    {{name}}\r\n                </div>\r\n                <div class=\"item-subtitle\">\r\n                {{#js_compare \"(this.price_old > 0)\"}}\r\n                    <span class=\"food-oldprice-list\">{{price_old}} $</i></span>\r\n                {{/js_compare}}\r\n                {{#if price_new}}\r\n                    <span class=\"food-newprice-list\">{{price_new}} $</span>\r\n                {{/if}}\r\n                {{#if discount_size}}\r\n                    <span class=\"offer-percent-list\">{{discount_size}}</span>\r\n                {{/if}}\r\n                {{#js_compare \"this.exclusive != 0\"}}<br/><span class=\"offer-exclusive\">Exclusive</span>{{/js_compare}}\r\n                </div>\r\n                <div class=\"item-text\"><span class=\"offer-advertiser-text\">{{advertiser}}</span>.\r\n                {{#js_compare \"(this.system_date_from) && (this.system_date_to)\"}}\r\n                    <span class=\"offer-time-text\">From {{rusdate_noyear system_date_from}} to {{rusdate_noyear system_date_to}}</span>\r\n                {{/js_compare}}\r\n            </div>\r\n            </div>\r\n        </a>\r\n    </div>\r\n    \r\n\r\n</li>" },
    'events': { template: "<li class=\"{{pr_class}}\">\r\n                            <a href=\"offer_item.html?type=events&id={{id}}\" class=\"item-link item-content\">\r\n                                <div class=\"item-media\"><img class=\"srf-offerlist-image lazy lazy-fadein\" data-src=\"{{img}}\">\r\n                                </div>\r\n                                    <div class=\"item-inner\">\r\n                                        <div class=\"item-title-row\">\r\n                                            {{name}}\r\n                                        </div>\r\n                                        <div class=\"item-text\">{{event_datetime}}<br/>{{advertiser}}</div>\r\n                                    </div>\r\n                            </a>\r\n                        </li>" },
    'news': { template: "<li class=\"{{pr_class}}\">\r\n                                    {{#js_compare \"(this.ext_link)\"}}\r\n                                        <a data-href=\"{{this.ext_link}}\" class=\"item-content item-link external open-inappbrowser\">\r\n                                    {{else}}\r\n                                        <a href=\"offer_item.html?type=news&id={{id}}\" class=\"item-link item-content\">\r\n                                    {{/js_compare}}\r\n                                <div class=\"item-media\"><img class=\"srf-offerlist-image lazy lazy-fadein\" data-src=\"{{img}}\"></div>\r\n                                    <div class=\"item-inner\">\r\n                                        <div class=\"item-title-row\">\r\n                                            {{name}}\r\n                                        </div>\r\n                                    </div>\r\n                            </a>\r\n                        </li>" },
    'nodata': { template: "<div class=\"no-data-message\">No items available in this section\r\n\r\n{{#each this}}\r\n<p class=\"filter-info\">{{filter_field_display_name}} : {{filter_value_name}}</p>\r\n{{/each}}\r\n<p> <a id=\"show-all\" href=\"#\" class=\"button button-big button-fill\">Back</a></p>\r\n</div>\r\n" }
};

    module.exports = {

        templates : templates
    }




    
    
},{}],19:[function(require,module,exports){
    
    var f7 = require('f7'),
        constants = require('config/constants'),
        utility = require('utils/utility'),
        offerlistTemplates = require('modules/list/offerlistTemplates');
    
    utility.compileTemplates(offerlistTemplates.templates);

    function render(itemtype, items, postRenderCallback) {

            var selectorVList = $$(f7.getCurrentView().activePage.container).find('.virtual-list');
            selectorVList.html('');    // clean previous 'no-data message', if it existed..

            var paramsVList = {
                        items: items,
                        cache : true,
                        height: 96,        // it's height of <li> with it's margin-bottom! now it's 90px+6px !!!
                        template: offerlistTemplates.templates[itemtype].template,
                        item_multiplier: 1,
                        //add_height: 50,  // if needed, can add to vList height
                        searchByItem: searchFunction,
                        callback: postRenderCallback

            };

            var vList = f7.virtualList(selectorVList, paramsVList);

    
        
    }

    function searchFunction(query, index, item) {
        
        if ((item.name.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0) || (item.advertiser.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0) || (item.metakeywords.toLowerCase().indexOf(query.toLowerCase().trim()) >= 0)) {
            return true; //item matches query
        }
        else {
            return false; //item doesn't match
        }
        
    }

    
    function renderNoData(appliedFilters, bindings) {

        appliedFilters = appliedFilters || '';

        var selectorVList = $$(f7.getCurrentView().activePage.container).find('.virtual-list');
        selectorVList.html(offerlistTemplates.templates['nodata'].compiledTemplate(appliedFilters));
        utility.bindEvents(f7.getCurrentView().activePage, bindings);

    }

    function SetItemIsInFavourites(element) {

        $$(element).removeClass('bg-blue');
        $$(element).removeClass('add-to-favourites');
        $$(element).addClass('bg-green');
        $$(element).addClass('remove-from-favourites');
        $$(element).html('<i class="f7-icons size-22">check</i>&nbsp;'+ constants.messages.favourites_added);

    } 

    function SetItemNotInFavourites(element) {

        $$(element).removeClass('bg-green');
        $$(element).removeClass('remove-from-favourites');
        $$(element).addClass('bg-blue');
        $$(element).addClass('add-to-favourites');
        $$(element).html(constants.messages.favourites_add);

    }

                    
                    
      
    module.exports = {

        render : render,
        renderNoData : renderNoData,
        SetItemIsInFavourites : SetItemIsInFavourites,
        SetItemNotInFavourites : SetItemNotInFavourites
     
    }

},{"config/constants":4,"f7":6,"modules/list/offerlistTemplates":18,"utils/utility":81}],20:[function(require,module,exports){

var f7 = require('f7');


// Pull-To-Refresh processing
function init () {
            
            $$(f7.getCurrentView().activePage.container).find('.pull-to-refresh-content').on('refresh',function() {

                        console.log('ptr refresh trigger');
                        require("modules/list/offerlistController").getItems(true);                

            });
            
    }

    module.exports =  {

        init: init
    }
    

},{"f7":6,"modules/list/offerlistController":16}],21:[function(require,module,exports){

        var constants = require('config/constants'),
            storage = require('services/storage'),
            serverapi = require('services/serverapi'),
            utility = require('utils/utility');

            function getSubCategories(category_id) {

                var items = JSON.parse(storage.getItem(constants.storage.filterdata_prefix + '_categories'));
                var subcats = [];
                
                getSubCats(category_id);

                return subcats;

                function getSubCats(id) {
                                
                        for (var i=0; i < items.length; i++ ) {
                
                                if (items[i].parent_id == id) {
                                        
                                        subcats.push(items[i].id);
                                        getSubCats(items[i].id);  
                                }
                        }
                }
                        
                        
            }



            function getFilterItems(filteritemsData, refresh, filterValues, onItemsLoaded) {

                loadFilterItems(filteritemsData.filterItemsType, refresh, function(results){
                        
                        var items =  results.filter(function(item, index, ar) {

                                for (var i=0; i < filteritemsData.filter_fields.length; i++) {

                                        if (item[filteritemsData.filter_fields[i]] != filterValues[i]) return false;
                                }
                                                
                                return true;
                                        
                        });     
                        
                        items = utility.SortArrayBy(items , filteritemsData.sort_field,filteritemsData.sort_field_type, filteritemsData.sort_order);


                        onItemsLoaded(items);

                });

                
            }


            function loadFilterItems(filterItemsType, refresh, onItemsLoaded) {

                var results = refresh ? [] : JSON.parse(storage.getItem(constants.storage.filterdata_prefix + '_'+filterItemsType)) || [];
                        
                if (results.length === 0) {
                        
                        serverapi.loadFilterItems(filterItemsType, function(data) {
                                
                                data = JSON.parse(data);
                                data[filterItemsType].forEach(function(item, index) {

                                        results[index]= item;
                                });
                                
                                storage.setItem(constants.storage.filterdata_prefix + '_'+filterItemsType, JSON.stringify(results));
                                
                                onItemsLoaded(results);
                                                                                
                                
                        }, function () {
                                                                                
                                console.log('error loading ' + filterItemsType);
                                
                        });    
                        
                }
                else {

                        onItemsLoaded(results);
                } 
                


            }

            function getAdvertiserLogo(advertiser_id) {
                    
                    var advertisers_data = JSON.parse(storage.getItem(constants.storage.filterdata_prefix + '_advertisers'));
                    
                    var advertiser = advertisers_data.find(function(arrayitem, index, ar) {
                        return arrayitem.id == advertiser_id ? true : false;
                    });
                    
                    if (advertiser) return advertiser.img


            }



        module.exports =  {
                getFilterItems : getFilterItems,
                getSubCategories : getSubCategories,
                getAdvertiserLogo : getAdvertiserLogo,
                loadFilterItems : loadFilterItems
                
        }


},{"config/constants":4,"services/serverapi":77,"services/storage":78,"utils/utility":81}],22:[function(require,module,exports){

    var horizontalSelectorView = require('modules/navigation/horizontalSelectorView'),
        SectionModel = require('modules/navigation/sections'),
        Categories = require('modules/navigation/categories');

    function horizontalSelector(section, refreshData) {

        this.section = section;
        this.refreshData = refreshData;
        
        this.filter_field = SectionModel[this.section].filterItemsDataHorizontal.items_filter_by_field;
        this.filter_field_display_name = SectionModel[this.section].filterItemsDataHorizontal.items_filter_by_field_display_name;
        
        this.history = [];

        this.bindings = [
            {
            element: '.hs-item',
            event: 'click',
            handler: this.onItemSelected.bind(this),
            onlyOnCurrentPage : true

        },
         {
            element: '#hs-back',
            event: 'click',
            handler: this.onBack.bind(this),
            onlyOnCurrentPage : true

        },
       ];

       
       horizontalSelectorView.init();

       this.update(null);

    }

 horizontalSelector.prototype.update = function(parent_id) {
    
    parent_id = parent_id || null;

    Categories.getFilterItems(SectionModel[this.section].filterItemsDataHorizontal, this.refreshData, [this.section, parent_id], this.onItemsLoaded.bind(this));

 }


 horizontalSelector.prototype.onItemsLoaded = function(items) {
                
       if (!items.length) {
        this.history.pop();
        return; // + highligh selected item
       }

        var renderBackButton = (this.history.length > 0) ? true : false;
        horizontalSelectorView.render(items, renderBackButton, this.bindings);                                                
    }
 
    
       
    horizontalSelector.prototype.onItemSelected = function(event) {

                    var selected_item_id = $$(event.currentTarget).data('id');
                    var selected_item_name = $$(event.currentTarget).data('name');

                    $$(event.currentTarget).addClass('active');
                    $$(event.currentTarget).siblings().removeClass('active');

                    var filter = {
                        filter_field : this.filter_field,
                        filter_field_display_name : this.filter_field_display_name,
                        filter_value_id : selected_item_id,
                        filter_value_name : selected_item_name,
                        filter_type : "range_match"
                    };

                    this.history.push(selected_item_id);

                    /// Update list of categories in filter 
                    this.update(selected_item_id);

                    // And applying filters to list of offers
                    require("modules/list/offerlistController").addFilter(filter);                
                    

    }

    horizontalSelector.prototype.onBack = function() {
        this.history.pop();
        this.update(this.history[this.history.length-1]);

          var filter = {
                        filter_field : this.filter_field,
                        filter_field_display_name : this.filter_field_display_name,
                        filter_value_id : 0,
                        filter_value_name : "",
                        filter_type : "range_match"
                    };
            require("modules/list/offerlistController").addFilter(filter);                

    }

    module.exports = horizontalSelector;


},{"modules/list/offerlistController":16,"modules/navigation/categories":21,"modules/navigation/horizontalSelectorView":23,"modules/navigation/sections":29}],23:[function(require,module,exports){

    var f7 = require('f7'),
        utility = require('utils/utility'),
        horizontalSelectorTemplate = "{{#if renderBackButton}}\r\n    <a href=\"#\" id=\"hs-back\" class=\"button button-round button-semi-big\">\r\n        <i class=\"f7-icons size-22\">arrow_left</i>\r\n    </a>\r\n{{/if}}\r\n{{#each items}}\r\n    <a href=\"#\" data-id=\"{{id}}\" data-name=\"{{name}}\" class=\"button button-round button-semi-big hs-item\">{{name}}</a>\r\n{{/each}}\r\n\r\n",
        hsCompiledTemplate = Template7.compile(horizontalSelectorTemplate),
        hsDom;
    

        function init() {

            hsDom = $$(f7.getCurrentView().activePage.container).find('.horizontal-selector');

            hsDom.show();  // it's hidden by default. !! Before SHOW,  height will be NaN !!!

            var search_bar_dom = $$(f7.getCurrentView().activePage.container).find('.searchbar');
            var search_bar_top = +(search_bar_dom.css("top")).replace("px",""); // cast to int value
            var new_top_padding = search_bar_top + search_bar_dom.height() + hsDom.height() + 9;
                
            $$(f7.getCurrentView().activePage.container).find('.page-content').css('padding-top',new_top_padding+'px');
                
               

        }

        function render(items, renderBackButton, bindings) {

            
            if (!hsDom) init();

                var dhtml =hsCompiledTemplate(
                                            {
                                                items: items,
                                                renderBackButton : renderBackButton
                                            }); 
                
                
                hsDom.html(dhtml);
                
                utility.bindEvents(f7.getCurrentView().activePage, bindings);

                setTimeout(function() { // fix for iOS (without this controls are moved to left)
                    hsDom.scrollLeft(0); 
                }, 80);
        }





module.exports = {
    
    init : init,
    render : render
    
}


},{"f7":6,"utils/utility":81}],24:[function(require,module,exports){

var leftnavModel = require('modules/navigation/leftnavModel'),
    leftnavView = require('modules/navigation/leftnavView'),
    constants = require('config/constants');

    var visible;

    var bindings = [{
            element: '.panel-left',
            event: 'closed',
            handler: onClosed,
            onlyOnCurrentPage : false
        },
        {
            element: '.panel-left',
            event: 'opened',
            handler: onOpened,
            onlyOnCurrentPage : false

        }];

    function init () {
            
        var model = {
            appname : constants.srf_app_name,
            navigationNodes : leftnavModel.nodes
        };

        leftnavView.render(model, bindings);
        visible = false;
    }


    function onClosed() {

        visible = false;
        
    }

    function onOpened() {
        
        visible = true;
                
    }
    
           
    
    module.exports =  {

        init : init,
        isVisible: function() {
            return visible;
        }
        
    };

},{"config/constants":4,"modules/navigation/leftnavModel":25,"modules/navigation/leftnavView":26}],25:[function(require,module,exports){

var constants = require('config/constants');

module.exports = {

     nodes : [
            {page:"offers.html?section=offers",iconclass: "icon-shopping-bag", name: constants.messages.sections["offers"].title, fontsize: 17},
            {page:"offers.html?section=foods",iconclass: "icon-shopping-cart", name: constants.messages.sections["foods"].title, fontsize: 17},
            {page:"favourites.html",iconclass: "icon-star", name: constants.messages.sections["favourites"].title, fontsize: 17},
            {page:"offers.html?section=events",iconclass: "icon-calendar", name: constants.messages.sections["events"].title, fontsize: 17},
            {page:"offers.html?section=news",iconclass: "icon-newspaper-o", name: constants.messages.sections["news"].title, fontsize: 17},
            {page:"about.html?section=contacts",iconclass: "icon-envelope", name: constants.messages.sections["contacts"].title, fontsize: 17},
            {page:"settings.html?section=settings",iconclass: "icon-cog3", name: constants.messages.sections["settings"].title, fontsize: 17}

            ]
 
        
};


},{"config/constants":4}],26:[function(require,module,exports){

var leftnavTemplate = "  <ul>\r\n        {{#each this}}\r\n                <li>\r\n                    <a href=\"{{page}}\" data-animate-pages=\"false\" class=\"item-link close-panel no-animation\">\r\n                        <div class=\"item-content\">\r\n                            <div class=\"item-media\"><i style=\"font-size:{{fontsize}}px;\" class=\"{{iconclass}}\"></i></div>\r\n                            <div class=\"item-inner\">\r\n                                <div class=\"item-title\">{{name}}</div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                </li>   \r\n        {{/each}}\r\n        \r\n</ul>",
    utility = require('utils/utility'),
    leftnavCompiledTemplate = Template7.compile(leftnavTemplate);

function render(model, bindings ) {

        $$('.header-appname').html(model.appname); // render app title
        $$('.panel-left .list-block').html(leftnavCompiledTemplate(model.navigationNodes));
        
        utility.bindEvents(f7.getCurrentView().activePage, bindings);

    }


module.exports = {
    render: render
};

},{"utils/utility":81}],27:[function(require,module,exports){
    
    var SectionModel = require('modules/navigation/sections'),
        verticalSelector = require('modules/navigation/verticalSelectorController'),
        horizontalSelector = require('modules/navigation/horizontalSelectorController'),
        navigationView = require('modules/navigation/navigationView');

    function Navigation(section, refreshData) {

        this.section = section;
        this.refreshData = refreshData;
        this.init();

    }

    Navigation.prototype.init = function () {

               switch (SectionModel[this.section].headerType) {

                        case "title":
                            
                            navigationView.renderHeaderTitle(SectionModel[this.section].title);
                            break;

                        case "vertical-selector":
                            
                            var vs = new verticalSelector(this.section, this.refreshData);
                            break;

                        case "combined-selector":
                            
                            var vs = new verticalSelector(this.section, this.refreshData);
                            var hs = new horizontalSelector(this.section, this.refreshData);
                            break;
                      
                        default:
                            navigationView.renderHeaderTitle(SectionModel[this.section].title);
                            break;

                }

          
                    
    
    }

    module.exports = Navigation;


},{"modules/navigation/horizontalSelectorController":22,"modules/navigation/navigationView":28,"modules/navigation/sections":29,"modules/navigation/verticalSelectorController":30}],28:[function(require,module,exports){

    var f7= require('f7');
    
    function renderHeaderTitle(text) {


             $$(f7.getCurrentView().container).find('.navbar div.center.link').html(text);
             f7.sizeNavbars();
                
    }

    module.exports =  {

        renderHeaderTitle : renderHeaderTitle
    }

},{"f7":6}],29:[function(require,module,exports){
var constants = require("config/constants");

    module.exports = {
                  "offers" : {
                
                                title : constants.messages.sections["offers"].title,
                                headerType : "vertical-selector",
                                headerText : constants.messages.sections["offers"].headerText,
                                selectorHeaderText : constants.messages.sections["offers"].selectorHeaderText,
                                filterItemsDataVertical: {
                                        filterItemsType : "categories",
                                        sort_field : "disp_order",
                                        sort_field_type :"int",
                                        sort_order : "asc",
                                        filter_fields : ["section_id"],
                                        items_filter_by_field : "category",
                                        items_filter_by_field_display_name : constants.messages.sections["offers"].filters.vertical.items_filter_by_field_display_name,
                                        all_selector_name : constants.messages.sections["offers"].filters.vertical.all_selector_name,
                                },
                                canAddToFavourites : true,
                                bottomToolbar : false
                },

                "foods" : {
                
                                title:  constants.messages.sections["foods"].title,
                                headerType : "combined-selector",
                                headerText : constants.messages.sections["foods"].headerText,
                                selectorHeaderText : constants.messages.sections["foods"].selectorHeaderText,
                                filterItemsDataVertical: {
                                        filterItemsType : "advertisers",
                                        sort_field : "name",
                                        sort_field_type :"string",
                                        sort_order : "asc",
                                        filter_fields : ["section_id"],
                                        items_filter_by_field : "advertiser_id",
                                        items_filter_by_field_display_name : constants.messages.sections["foods"].filters.vertical.items_filter_by_field_display_name,
                                        all_selector_name : constants.messages.sections["foods"].filters.vertical.all_selector_name,
                                },
                                filterItemsDataHorizontal: {
                                        filterItemsType : "categories",
                                        sort_field : "disp_order",
                                        sort_field_type :"int",
                                        sort_order : "asc",
                                        filter_fields : ["section_id","parent_id"],
                                        items_filter_by_field : "category",
                                        items_filter_by_field_display_name : constants.messages.sections["foods"].filters.horizontal.items_filter_by_field_display_name,
                                        all_selector_name : constants.messages.sections["foods"].filters.horizontal.all_selector_name,
                                },
                                canAddToFavourites : false,
                                bottomToolbar : true
                },
        "events" : {
                
                title:  constants.messages.sections["events"].title,
                headerType : "title",
                canAddToFavourites : false,
                bottomToolbar : false
        
        },
        "news" : {
                
                title:  constants.messages.sections["news"].title,
                headerType : "title",
                canAddToFavourites : false,
                bottomToolbar : false
        },
        "contacts" : {
                
                title:  constants.messages.sections["contacts"].title,
                headerType : "title"
        },
        
        "favourites" : {
                
                title:  constants.messages.sections["favourites"].title,
                headerType : "title",
                canAddToFavourites : true
        },
       
        "settings" : {
                
                title:  constants.messages.sections["settings"].title,
                headerType : "title",
                canAddToFavourites : false
        },
         "developer" : {
                
                title:  "DeveloperConsole",
                headerType : "title",
                canAddToFavourites : false
        },
         "complain" : {
                
                title:  "complain",
                headerType : "title",
                canAddToFavourites : false
        }
        };


},{"config/constants":4}],30:[function(require,module,exports){

    var verticalSelectorView = require('modules/navigation/verticalSelectorView'),
        SectionModel = require('modules/navigation/sections'),
        Categories = require('modules/navigation/categories');

    function verticalSelector(section, refreshData) {

        this.section = section;
        this.refreshData = refreshData;
        this.items = [];
        this.filter_field = SectionModel[this.section].filterItemsDataVertical.items_filter_by_field;
        this.filter_field_display_name = SectionModel[this.section].filterItemsDataVertical.items_filter_by_field_display_name;

        this.all_items_selector = {  id:0,
                                    name:SectionModel[this.section].filterItemsDataVertical.all_selector_name,
                                    icon:null,
                                    section_id:this.section,
                                    disp_order:0,
                                    parent_id:null};

        this.bindings = [
        {
            element: '.popup-vertical-selector a.item-link',
            event: 'click',
            handler: this.onItemSelected.bind(this),
            onlyOnCurrentPage : false

        },
        {
            element: '.popup-vertical-selector',
            event: 'open',
            handler: this.onOpen.bind(this),
            onlyOnCurrentPage : false

        },
        {
            element: '.popup-vertical-selector',
            event: 'close',
            handler: this.onClose.bind(this),
            onlyOnCurrentPage : false

        }];


        this.load();

    }

 verticalSelector.prototype.load = function() {
    
    Categories.getFilterItems(SectionModel[this.section].filterItemsDataVertical, this.refreshData, [this.section], this.onItemsLoaded.bind(this));

 }


 verticalSelector.prototype.onItemsLoaded = function(items) {
                
        items.unshift(this.all_items_selector);
        
        this.items = items;
        
        verticalSelectorView.render(SectionModel[this.section].headerText, SectionModel[this.section].selectorHeaderText, this.items, this.bindings);                                                
    }
 
    
    
    verticalSelector.prototype.onOpen = function() {

        verticalSelectorView.headerChevronUp();
    
    }
    
    verticalSelector.prototype.onClose = function() {

        verticalSelectorView.headerChevronDown();
        
                        
    }
    
    verticalSelector.prototype.onItemSelected = function(event) {

                    var selected_item_id = $$(event.currentTarget).data('id');
                    var selected_item_name = $$(event.currentTarget).data('name');
                                        
                    var filter = {
                        filter_field : this.filter_field,
                        filter_field_display_name : this.filter_field_display_name,
                        filter_value_id : selected_item_id,
                        filter_value_name : selected_item_name,
                        filter_type : "exact_match"
                    };
                    
                     
                    require("modules/list/offerlistController").addFilter(filter);                
                    

    }

    module.exports = verticalSelector;


},{"modules/list/offerlistController":16,"modules/navigation/categories":21,"modules/navigation/sections":29,"modules/navigation/verticalSelectorView":31}],31:[function(require,module,exports){

    var f7 = require('f7'),
        constants = require('config/constants'),
        utility = require('utils/utility'),
        verticalSelectorTemplate = "<ul>\r\n                {{#each this}}\r\n                <li>\r\n                    <a href=\"#\" data-id=\"{{id}}\" data-name=\"{{name}}\" class=\"category-link item-link close-popup\" >\r\n                        <div class=\"item-content\">\r\n                            {{#if icon}}<div class=\"item-media fa-correct\"><i class=\"{{icon}}\"></i></div>{{/if}}\r\n                            {{#if img}}<div class=\"item-media\"><img onerror=\"this.style.display='none';\" class=\"food-advertiser-logo\" src=\"{{img}}\"/></div>{{/if}}\r\n                            <div class=\"item-inner\">\r\n                                <div class=\"item-title\">{{name}}</div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                </li>\r\n                {{else}}\r\n                 <li>\r\n                    <a href=\"#\" class=\"item-link close-popup\" >\r\n                        <div class=\"item-content\">\r\n                            <div class=\"item-media fa-correct\"><i class=\"icon-frown-o\"></i></div>\r\n                            <div class=\"item-inner\">\r\n                                <div class=\"item-title\">No categories found</div>\r\n                            </div>\r\n                        </div>\r\n                    </a>\r\n                </li>\r\n                {{/each}}\r\n            </ul>",
        vsCompiledTemplate = Template7.compile(verticalSelectorTemplate);

        
        function render(headerText, selectorHeaderText, items, bindings) {

            // header

            var headerHTML = '<a class="open-popup" data-popup=".popup-vertical-selector" href="#">' + headerText+ '<i style="margin-left: 6px;" class="header-filter-dropdown-chevron icon-chevron-down"></i></a>';
            
            var navbarContainer = f7.getCurrentView().activePage.navbarInnerContainer; 
            if (navbarContainer) {
                $$(navbarContainer).find('.center').html(headerHTML);
            }
            else {
                $$(f7.getCurrentView().container).find('.navbar').find('.center').html(headerHTML);
            }
            
            
            f7.sizeNavbars();

            // items
            var items_html =  '<div class="content-block-title" style="margin: 0px 0px 0px;*/">'+
                    '<div class="select-category-label">' + selectorHeaderText + '</div>'+
                        '<a href="#" class="close-popup popup-closer"><div >' +  constants.messages.general_cancel +'</div></a>'+
                    '</div>'+
                '<div class="list-block small-labels">'+
            vsCompiledTemplate(items)+
                '</div>';

            $$('.popup-vertical-selector').html(items_html);
       
            // bind events
            utility.bindEvents(f7.getCurrentView().activePage, bindings);
        }



        function headerChevronUp() {

            $$('.header-filter-dropdown-chevron').removeClass('icon-chevron-down');
            $$('.header-filter-dropdown-chevron').addClass('icon-chevron-up');
        }



        function headerChevronDown() {

            $$('.header-filter-dropdown-chevron').removeClass('icon-chevron-up');
            $$('.header-filter-dropdown-chevron').addClass('icon-chevron-down');
        }
       


        module.exports = {

            render : render,
            headerChevronUp : headerChevronUp,
            headerChevronDown : headerChevronDown
           
        }


},{"config/constants":4,"f7":6,"utils/utility":81}],32:[function(require,module,exports){
var f7 = require('f7'),
    appConfig = require('config/appconfig'),
    app = require('app'),
    serverapi = require('services/serverapi'),
    constants = require('config/constants'),
    offeritemView = require('modules/offer/offeritemView'),
    favourites = require('modules/favourites/favouritesController'),
    sectionModel = require('modules/navigation/sections'),
    analytics= require('services/ga_analytics'),
    utility= require('utils/utility'),
    browser= require('services/browser');
    

  var item;
  var itemtype;
  var offer_id;
  
  var bindings = [{

                element: '.favourite-toggle',
                event: 'click',
                handler: onToggleFavourite,
                onlyOnCurrentPage : false     // this should be FALSE as thi is an element of NAVBAR, not of current page!

            },
            {
                element: '.external.open-inappbrowser',
                event: 'click',
                handler:  browser.HandleExternalLink,
                onlyOnCurrentPage : true

            }];
            

    function init (page) {

            itemtype = page.query.type;
            offer_id = page.query.id;
                                
            render();

    }

            
    function render() {
        

            serverapi.loadOfferPage(itemtype, offer_id, function(data) {

                    item = (JSON.parse(data)).offer;

                    var offer_full_title = item.name,
                        offer_advertiser_id =  item.advertiser_id || constants.undefined_mark,
                        offer_advertiser_name = item.advertiser || constants.undefined_mark,
                        offer_cat_name = item.cat_name || constants.undefined_mark,
                        offer_section_name = item.sec_name || constants.undefined_mark;

                    offeritemView.render(item, itemtype, offer_advertiser_name, favourites.itemInFavourites(item), sectionModel[itemtype].canAddToFavourites, bindings);
                                                                            
                    analytics.trackOfferView (offer_id, offer_full_title, offer_advertiser_id, offer_advertiser_name, offer_section_name, offer_cat_name);
                
        }, 
        function() {
    
            offeritemView.renderError();
        });    

    }

    function onToggleFavourite() {

        var isFavourite = $$(this).data('favourite') || false;
        
        if (isFavourite) {
            favourites.removeById(item.id);
        }
        else {
            favourites.add(item);
        }
        
        offeritemView.renderIsFavourite(!isFavourite);
        
    }



        
        module.exports =  {

            init : init

        }


},{"app":1,"config/appconfig":2,"config/constants":4,"f7":6,"modules/favourites/favouritesController":12,"modules/navigation/sections":29,"modules/offer/offeritemView":34,"services/browser":42,"services/ga_analytics":74,"services/serverapi":77,"utils/utility":81}],33:[function(require,module,exports){

    

    var templates = {
    
                'offers': {
                    template: "\r\n    <div class=\"swiper-container\"> \r\n        \r\n        <div class=\"swiper-wrapper\">\r\n        \r\n            {{#each images}}\r\n            <div class=\"swiper-slide srf-offer-swiper-container\">\r\n                <img class=\"srf-offer-main-image\" src=\"{{this}}\" alt=\"Image not available\">\r\n               \r\n            </div>\r\n            {{/each}}\r\n            \r\n            \r\n        </div>\r\n        \r\n        <div class=\"swiper-pagination\"></div>\r\n \r\n    </div>\r\n    \r\n    <div class=\"content-block srf-offer-description\">\r\n      <div class=\"content-block-inner\">\r\n       \r\n       {{body}}\r\n       \r\n    \r\n        <div class=\"srf-contact-block\">\r\n    <div class=\"offer-page-linkitems\">\r\n      {{#if email}}\r\n          <span class=\"offer-page-linkitem email\"><a class=\"link external\" href=\"mailto:{{email}}\"><i class=\"icon-envelope\"></i> {{email}}</a></span>\r\n      {{/if}}\r\n       {{#if weblink1}}\r\n        <span class=\"offer-page-linkitem weblink1\"><a class=\"link external open-inappbrowser\" data-href=\"{{weblink1}}\"><i class=\"icon-sphere\"></i> {{weblink1}}</a></span>\r\n       {{/if}}\r\n       {{#if weblink2}}\r\n      <span class=\"offer-page-linkitem weblink2\"><a class=\"link external open-inappbrowser\" data-href=\"{{weblink2}}\"><i class=\"icon-sphere\"></i> {{weblink2}}</a></span>\r\n      {{/if}}\r\n    </div>\r\n    {{#each address_info}}\r\n    <p>      \r\n      {{#if phone}}\r\n          <span class=\"phone\"><a href=\"tel:{{phone}}\" class=\"link external\"><i class=\"icon-phone\"></i> {{phone}}</a></span><br/>\r\n      {{/if}}\r\n      {{#if address}}    \r\n        <span class=\"address\">{{address}}</span><br/>\r\n        <span class=\"offer-page-workhours\">Work hours: {{workhours}}</span>\r\n      {{/if}}\r\n        \r\n    </p>        \r\n    {{/each}}    \r\n        </div>\r\n    \r\n    \r\n       \r\n       <span class=\"legal-offer-notice\"> {{add_info}}</span>\r\n       {{#js_compare \"this.can_complain > 0\"}}\r\n                <p><a href=\"complain.html\" id=\"btn-complain\" class=\"button button-big color-red\"><i class=\"icon-exclamation-circle\"></i>&nbsp;&nbsp;Report a problem</a></p>\r\n           {{/js_compare}}\r\n      </div>\r\n    </div>",
                    swiper: true
                },
                'foods':      {
                    template: "<div class=\"content-block srf-offer-description\">\r\n         <div class=\"content-block-inner\">\r\n          <div class=\"srf-food-offer-main-image-container\">\r\n              <img class=\"srf-food-offer-main-image\" src=\"{{img1}}\" alt=\"{{name}}\">\r\n        </div>\r\n          <div class=\"food-offer-priceblock\">\r\n          <p> <b>{{js \"this.advertiser.toUpperCase()\"}}</b>. Sale from {{rusdate system_date_from}} to {{rusdate system_date_to}}</p>\r\n           <p>\r\n           \r\n           {{#js_compare \"this.price_old > 0\"}}\r\n                <span class=\"food-oldprice-page\">{{price_old}} <i class=\"icon-rouble food-currency-page\"></i></span>\r\n           {{/js_compare}}\r\n           \r\n           {{#js_compare \"this.price_new > 0\"}}\r\n                <span class=\"food-newprice-page\">{{price_new}} <i class=\"icon-rouble food-currency-page\"></i></span>\r\n           {{/js_compare}}\r\n            \r\n           {{#js_compare \"(this.discount_size !='') && (this.discount_size != null)\"}}\r\n               <span class=\"food-percent-page\">{{discount_size}}</span>                                                        \r\n            {{/js_compare}}\r\n\r\n           </p>\r\n           </div>\r\n                                \r\n       <p>{{body}}</p>\r\n            \r\n    <span class=\"legal-offer-notice\">{{add_info}}</span> \r\n            {{#js_compare \"this.can_complain > 0\"}}\r\n                <p><a href=\"complain.html\" id=\"btn-complain\" class=\"button button-big color-red\"><i class=\"icon-exclamation-circle\"></i>&nbsp;&nbsp;Report a problem</a></p>\r\n           {{/js_compare}}\r\n          \r\n      </div>\r\n    <p><b>Contact information</b></p>\r\n   <ul>\r\n       \r\n   {{#each address_info}}\r\n    \r\n       <li><span class=\"address\">{{address}}</span><span class=\"workhours\"> (Work hours: {{workhours}})</span></li>\r\n    {{/each}}   \r\n    \r\n       </ul>\r\n       <br/>\r\n       <br/>\r\n       <br/>\r\n       <br/>\r\n       <br/>\r\n    </div>\r\n   ",
                    swiper : false
                },
                'events':      {
                    template: " <div class=\"swiper-container\">\r\n        \r\n        <div class=\"swiper-wrapper\">\r\n        \r\n            {{#each images}}\r\n            <div class=\"swiper-slide srf-offer-swiper-container\">\r\n                <img class=\"srf-offer-main-image\" src=\"{{this}}\" alt=\"Image not available\">\r\n            </div>\r\n            {{/each}}\r\n        </div>\r\n        <div class=\"swiper-pagination\"></div>\r\n    </div>\r\n    <div class=\"content-block srf-offer-description\">\r\n      <div class=\"content-block-inner\">\r\n   \r\n         <span class=\"event-page-datetime\"><i class=\"icon-calendar\"></i>  {{event_datetime}}</span>\r\n         <span class=\"event-page-advertiser\">{{advertiser}}</span>\r\n         \r\n         {{body}}\r\n         \r\n       <div class=\"srf-contact-block\">\r\n    <div class=\"offer-page-linkitems\">\r\n      {{#if email}}\r\n          <span class=\"offer-page-linkitem email\"><a class=\"link external\" href=\"mailto:{{email}}\"><i class=\"icon-envelope\"></i> {{email}}</a></span>\r\n      {{/if}}\r\n       {{#if weblink1}}\r\n        <span class=\"offer-page-linkitem weblink1\"><a class=\"link external open-inappbrowser\" data-href=\"{{weblink1}}\"><i class=\"icon-sphere\"></i> {{weblink1}}</a></span>\r\n       {{/if}}\r\n       {{#if weblink2}}\r\n      <span class=\"offer-page-linkitem weblink2\"><a class=\"link external open-inappbrowser\" data-href=\"{{weblink2}}\"><i class=\"icon-sphere\"></i> {{weblink2}}</a></span>\r\n      {{/if}}\r\n    </div>\r\n    {{#each address_info}}\r\n    <p>      \r\n          <span class=\"phone\"><a href=\"tel:{{phone}}\" class=\"link external\"><i class=\"icon-phone\"></i> {{this.phone}}</a></span><br/>\r\n        <span class=\"address\">{{address}}</span><br/>\r\n        <span class=\"offer-page-workhours\">Work hours: {{workhours}}</span>\r\n    </p>        \r\n    {{/each}}    \r\n        </div>\r\n          \r\n       <span class=\"legal-offer-notice\"> {{add_info}}</span>\r\n         {{#js_compare \"this.can_complain > 0\"}}\r\n                <p><a href=\"complain.html\" id=\"btn-complain\" class=\"button button-big color-red\"><i class=\"icon-exclamation-circle\"></i>&nbsp;&nbsp;Report a problem</a></p>\r\n           {{/js_compare}}\r\n      </div>\r\n    </div>",
                    swiper : true
                },
                'news':      {
                    template: " <div class=\"swiper-container\">\r\n        \r\n        <div class=\"swiper-wrapper\">\r\n        \r\n            {{#each images}}\r\n            <div class=\"swiper-slide srf-offer-swiper-container\">\r\n                <img class=\"srf-offer-main-image\" src=\"{{this}}\" alt=\"Image not available\">\r\n               \r\n            </div>\r\n            {{/each}}\r\n            \r\n            \r\n        </div>\r\n        \r\n        <div class=\"swiper-pagination\"></div>\r\n \r\n    </div>\r\n    \r\n   \r\n    <div class=\"content-block srf-offer-description\">\r\n      <div class=\"content-block-inner\">\r\n\r\n         {{body}}\r\n       <span class=\"legal-offer-notice\"> {{add_info}}</span>\r\n         {{#js_compare \"this.can_complain > 0\"}}\r\n                <p><a href=\"complain.html\" id=\"btn-complain\" class=\"button button-big color-red\"><i class=\"icon-exclamation-circle\"></i>&nbsp;&nbsp;Report a problem</a></p>\r\n           {{/js_compare}}\r\n      </div>\r\n    </div>",
                    swiper : false
                },
                'loaderror' : {
                    template: " <div class=\"content-block\">\r\n      <div class=\"content-block-inner\">\r\n      <i class=\"icon-frown-o fa-lg\" style=\"margin-right: 5px;\"></i>\r\n    Failed to connect to server. Please try again later.\r\n    \r\n      </div>\r\n    </div>",
                }

    };

    module.exports = {

        templates : templates
    }




    
    
},{}],34:[function(require,module,exports){

   var f7 = require('f7'),
       constants = require('config/constants'),
       utility= require('utils/utility'),
       offeritemTemplates= require('modules/offer/offeritemTemplates');

    utility.compileTemplates(offeritemTemplates.templates);

    var navbarContainer;
    


    
    function renderIsFavourite(isFavourite) {

        var icon = isFavourite ? "star_fill" : "star";
        var fav_toggle_elem = $$(navbarContainer).find('.favourite-toggle')
        
        fav_toggle_elem.data("favourite", isFavourite);
        fav_toggle_elem.html('<i class="f7-icons">'+ icon +'</i>');
        
    }
    
    function render(item, itemtype, advertiser_name, isFavourite, canAddToFavourites, bindings) {
       
       navbarContainer = f7.getCurrentView().activePage.navbarInnerContainer; 
       
       var navbar_title = (advertiser_name.length > 20) ? advertiser_name.substring(0,20) + '...' :  advertiser_name;
       $$(navbarContainer).find('.center').html(navbar_title);

       if (canAddToFavourites) renderIsFavourite(isFavourite);

       f7.sizeNavbars();



       $$(f7.getCurrentView().activePage.container).find('.page-content').html(offeritemTemplates.templates[itemtype].compiledTemplate(item));
        
        if (offeritemTemplates.templates[itemtype].swiper) {

            var swiper = f7.swiper('.swiper-container', { 
                autoplay: 1600,
                speed: 1000,
                spaceBetween: 3,
                pagination: ".swiper-pagination", 
                autoplayDisableOnInteraction: true,
                autoplayStopOnLast: true
            });                                       
        }

     
         
        
        utility.bindEvents(f7.getCurrentView().activePage, bindings);
    }

 
    function renderError() {
        
        navbarContainer = f7.getCurrentView().activePage.navbarInnerContainer; 
        $$(navbarContainer).find('.center').html(constants.messages.error_no_connection_short);
        
        $$(f7.getCurrentView().activePage.container).find('.page-content').html(offeritemTemplates.templates["loaderror"].compiledTemplate());

    }
    
    
    module.exports = {

        render : render,
        renderError : renderError,
        renderIsFavourite : renderIsFavourite
    }

},{"config/constants":4,"f7":6,"modules/offer/offeritemTemplates":33,"utils/utility":81}],35:[function(require,module,exports){
    var f7 = require('f7');

    function initSearchBar() {
        
        var searchBarDOMlement = $$(f7.getCurrentView().activePage.container).find('.searchbar');
        var searchListBlockDOMlement = $$(f7.getCurrentView().activePage.container).find('.list-block-search');

        if (searchBarDOMlement) {

            var searchBar = f7.searchbar(searchBarDOMlement, 
                                            {  
                                                searchList: searchListBlockDOMlement, 
                                                onSearch: function() {
                                                        
                                                        
                                                        f7.initImagesLazyLoad(f7.getCurrentView().activePage.container);
                                                }
                                            });
        }
        else {

            console.log('Error initializing searchBar');
        }


    }

    module.exports =  {

        initSearchBar : initSearchBar

    }


},{"f7":6}],36:[function(require,module,exports){

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
    
             
            
},{"config/appconfig":2,"config/constants":4,"f7":6,"services/ga_analytics":74,"services/storage":78,"utils/utility":81}],37:[function(require,module,exports){
var f7 = require('f7'),
    constants = require('config/constants'),
    welcomescreenModel = require('modules/welcomescreen/welcomescreenModel');
    welcomescreenView = require('modules/welcomescreen/welcomescreenView');


  var bindings = [ {

                element: document,
                delegate : '.tutorial-close-btn',
                event: 'click',
                handler: onCloseButton,
                onlyOnCurrentPage : false

            }];
 

var wsInstance;  


function init() {

    // Welcome screen shown only if new CodePush update arrived

   if (window.codePush) {

         window.codePush.getCurrentPackage(function (currentPackage) {
            // getCurrentPackage returns null if no update was installed (app store version)
            if (currentPackage && currentPackage.isFirstRun) welcomeScreenShow();
            
        },
        function() {
            console.log("Welcomescreen Init: Error while retreiving CodePush CurrentPackage");
        });


    }
    else {
         console.log("Welcomescreen Init: Window.CodePush not found");
    }
   
}


function welcomeScreenShow() {

    var options = {
      'bgcolor': '#f7f7f8',
      'fontcolor': '#000',
      'closeButtonText': constants.messages.general_skip,
      'onOpened': function () {
        
        // Welcome screen open callback
      },
      'onClosed': function () 
      {
        // Welcome screen closed callback
      }
    };
    
    
  
    wsInstance = welcomescreenView.render(welcomescreenModel.getSlides(), options, bindings);

}


function onCloseButton() {

    wsInstance.close();
}


module.exports = {

    init : init
}
},{"config/constants":4,"f7":6,"modules/welcomescreen/welcomescreenModel":38,"modules/welcomescreen/welcomescreenView":39}],38:[function(require,module,exports){

var constants = require('config/constants');

function getSlides() {

var slides = [
      

      // -- version N.NN  ------------------------------------------------
      // Your welcomescreen slides go here, as in example :
 /* {
        id: 'slide0',
        picture: '<img src="img/welcome/v313_update1_1.png"/>',
        text: '<div class="welcomescreen-heading">Feature 1 ..... </div><div class="welcomescreen-content">Feature description .....</div>'
      },
      {
        id: 'slide1',
        picture: '<img src="img/welcome/v313_update1_2.png"/>',
        text: '<div class="welcomescreen-content">Feature description ....</div>'
      },
*/

      
    ];
    // --------------------------------------------------------------------

    // first intoductory slide  (unshift - to put it in the beginning)
    slides.unshift({
        id: 'slide-start',
        picture: '<div class="welcomescreen-icon"><i class="f7-icons color-blue size-big-welcomescreen">info</i></div>',
        text: '<div class="welcomescreen-heading">New features in application!</div><div class="welcomescreen-content">Show details <i class="f7-icons">arrow_right</i></div>'
      });

    // last slide (put it in the end)
    slides.push({
        id: 'slide-end',
        picture: '<div class="welcomescreen-icon"><i class="f7-icons color-green size-big-welcomescreen">check_round</i></div>',
        text: '<div class="welcomescreen-heading">Thank you</div><div class="welcomescreen-content">We hope you will like new features!</div><a class="button button-big button-fill tutorial-close-btn" href="#">Close</a>'
      });


    return slides;

}

module.exports = {


    getSlides : getSlides
}
},{"config/constants":4}],39:[function(require,module,exports){

var utility = require('utils/utility');



function render (slides, options, bindings) {

  var ws = f7.welcomescreen(slides, options);
  utility.bindEvents(f7.getCurrentView().activePage, bindings);
  
  return ws;
}




module.exports = {

    render : render
    
}
},{"utils/utility":81}],40:[function(require,module,exports){
var serverapi = require('services/serverapi'),
    constants = require('config/constants'),
    appConfig = require('config/appconfig'),
    deviceutils = require('deviceutils');

var ads_config = {
    show_banner : false,
    banner_position : 2,
    banner_size : 'SMART_BANNER',
    bg_color : 'black',
    banner_id : '',
    show_interstitials : false,
    interstitial_id : '',
    interstitial_min_interval : 300000, // default frequency: 5min * 60sec * 1000 msec = 300 000 msec
    ad_free_period : 0,
    test_mode : false
};

var interstitialLastShownTime;


function init () {

    if ((typeof AdMob == "undefined") || (!AdMob)) { console.log( 'AdMob plugin not ready' ); return; }

     serverapi.LoadAdsConfig(function(data) {
        
        data = JSON.parse(data).adsdata;

        ads_config.show_banner = ((data.banner_enabled == '1') || (data.banner_enabled == true)) ? true : ads_config.show_banner;
        ads_config.banner_position = data.banner_position || ads_config.banner_position;
        ads_config.banner_size = data.banner_size || ads_config.banner_size;
        ads_config.banner_id = data.banner_id || ads_config.banner_id;
        ads_config.bg_color = data.bg_color || ads_config.bg_color;
        ads_config.show_interstitials = ((data.interstitial_enabled == '1') || (data.interstitial_enabled == true)) ? true : ads_config.show_interstitials;
        ads_config.interstitial_id = data.interstitial_id || ads_config.interstitial_id;
        ads_config.interstitial_min_interval = data.interstitial_min_interval || ads_config.interstitial_min_interval;
        ads_config.ad_free_period = data.ad_free_period || ads_config.ad_free_period;
        ads_config.test_mode = ((data.test_mode == '1') || (data.test_mode == true)) ? true : ads_config.test_mode;


        if (shouldShowAdvertising() && (ads_config.show_banner || ads_config.show_interstitials)) {

            AdMob.getAdSettings(function(info) {
      
                console.log('adId: ' + info.adId + '\n' + 'adTrackingEnabled: ' + info.adTrackingEnabled);

            }, function(){

                console.log('failed to get user ad settings');

            });


                    
            AdMob.setOptions({
                adSize: ads_config.banner_size || 'SMART_BANNER',
                position: ads_config.banner_position || AdMob.AD_POSITION.BOTTOM_CENTER,
                isTesting: ads_config.test_mode, // set to true, to receiving test ad for testing purpose
                bgColor: ads_config.bg_color, // color name, or '#RRGGBB'
                autoShow: false, // auto show interstitial ad when loaded, set to false if prepare/show
                overlap: false,
                offsetTopBar: true, // avoid overlapped by status bar, for iOS7+
            });
            
            bindEventHandlers();
             
            createBanner(function() {

                AdMob.showBanner(ads_config.banner_position);

            });
        

        }

    });

   
}

function createBanner(onSuccess, onFail) {

    if ((typeof AdMob == "undefined") || (!AdMob) || (!ads_config.show_banner)) return;

    if (!shouldShowAdvertising()) return;

    // banner on iOS requires remove overlay on top
    if (deviceutils.GetDevicePlatform() == "ios") $$('html').removeClass('with-statusbar-overlay');
    
    AdMob.createBanner({ 
        adId: ads_config.banner_id,
        success : onSuccess,
        fail : onFail
    });

}


function showBannerIfAppropriate(page_name) {

    if ((typeof AdMob == "undefined") || (!AdMob) || (!ads_config.show_banner)) return;

    if (!shouldShowAdvertising()) return;

    var position = ads_config.banner_position || AdMob.AD_POSITION.TOP_CENTER;

    AdMob.showBanner(position);
  
}


function shouldShowInterstitial() { // we define minimum interval of time between interstitials (not to irritate the user)
    
    if (interstitialLastShownTime > 0) {

        return ((Date.now() - interstitialLastShownTime) > ads_config.interstitial_min_interval) ? true : false;
    }
    else {
        return true;
    }

}

function shouldShowAdvertising() {  // we define an "ad_free_period" (ADs will not be shown to user until some time pass upon the first app launch)

    var existingTimestamp = appConfig.get(constants.storage.app_first_launch_timestamp)
    
    if ((existingTimestamp) && (existingTimestamp > 0)) {

        return ((Date.now() - existingTimestamp) > ads_config.ad_free_period) ? true : false;

    }

    return false;

}


function showInterstitialIfAppropriate() {

    if ((typeof AdMob == "undefined") || (!AdMob) || (!ads_config.show_interstitials)) return;
    
    if (!shouldShowAdvertising() || !shouldShowInterstitial()) return;

    interstitialLastShownTime = Date.now();
    
    AdMob.prepareInterstitial({
            adId: ads_config.interstitial_id,
            autoShow: true
    });
 
}

   
function bindEventHandlers() {

    $$(document).on('onAdFailLoad', function(e){
      
      // when jquery used, it will hijack the event, so we have to get data from original event
      if(typeof e.originalEvent !== 'undefined') e = e.originalEvent;
      var data = e.detail || e.data || e;

      console.log('error: ' + data.error +
          ', reason: ' + data.reason +
          ', adNetwork:' + data.adNetwork +
          ', adType:' + data.adType +
          ', adEvent:' + data.adEvent); // adType: 'banner', 'interstitial', etc.
    });

    $$(document).on('onAdLoaded', function(e){

    });

    $$(document).on('onAdPresent', function(e){

    });

    $$(document).on('onAdLeaveApp', function(e){

    });

    $$(document).on('onAdDismiss', function(e){

    });
}


module.exports = {
    
    init : init,

    showBannerIfAppropriate : showBannerIfAppropriate,
    showInterstitialIfAppropriate : showInterstitialIfAppropriate

};




},{"config/appconfig":2,"config/constants":4,"deviceutils":5,"services/serverapi":77}],41:[function(require,module,exports){
// Branch links utility functions

    var f7 = require('f7'),
        constants = require('config/constants'),
        appState = require('config/appstate'),
        appConfig = require('config/appconfig'),
        analytics = require('services/ga_analytics');


    function init() {
    
            //if (typeof Branch != "undefined") Branch.setDebug(true);
            
            window.branchUniversalObj = null;   // this object MUST BE global
            
            BranchInitSession(); 

    }


    function BranchInitSession() {

        if (typeof Branch != "undefined")  {

            Branch.initSession(BranchDeepLinkHandler).then(function (res) {
        
                //   f7.alert('Init Branch session Response: ' + JSON.stringify(res));
                BranchCreateObject(ids.userId);

            }).catch(function (err) {
                
                //   f7.alert('Error: ' + JSON.stringify(err));

            });

        }
    }


    function BranchResumeSession() {

        if (typeof Branch != "undefined")  {

                Branch.initSession(BranchDeepLinkHandler).then(function (res) {
                
                        //   f7.alert('Resume Branch Session. Success: ' + JSON.stringify(res));

                        }).catch(function (err) {
                            
                        //   f7.alert('Resume Branch Session. Error: ' + JSON.stringify(err));

                });

        }
        
    }
    

    function BranchDeepLinkHandler(data) {

        // read deep link data
        console.log('Deep Link Data: ' + JSON.stringify(data));

        if (typeof data.action != "undefined") {

            switch (data.action) {

                /*case '.......':
                    
                    break;

                // You're free to implement your own actions
                    
                */
                default:
                    break;

            }
        }
        

    }
    

    function BranchCreateObject(oneSignalUserId) {

                var properties = {
                    canonicalIdentifier: constants.srf_linksharing_canonicalIdentifier,
                    title: constants.srf_linksharing_title,
                    contentDescription: constants.srf_linksharing_text,
                    contentImageUrl: constants.srf_linksharing_contentImageUrl,
                    contentIndexingMode: 'public',
                };

                Branch.createBranchUniversalObject(properties).then(function (res) {
                    
                    /// f7.alert('Creaing Branch object. Succes! Response: ' + JSON.stringify(res));
                    branchUniversalObj = res;

                }).catch(function (err) {
                    
                    // f7.alert('Create branch object error: ' + JSON.stringify(err));
                });

    }


    function ShowCustomShareSheet (campaignId,message,subject,image) {

        analytics.trackEvent ('Buttons','Offer_ShowShareSheet','campaignId_'+campaignId);
    
        GenerateBranchLink('OTHER',campaignId,function(link){

                        var linkoptions = {
                            message:message,
                            subject:subject,
                            files: [image],
                            url:link

                        };


                        window.plugins.socialsharing.shareWithOptions(linkoptions, function(result) {
                                // on success
                                // works only on iOs
                                // result.completed
                                // result.app
                            }, function(msg){
                                // on fail
                                // works only on iOs
                                // msg
                            });

        });


    }


    function GenerateBranchLink (selectedChannel, campaignId, shareFunction) {

        selectedChannel = selectedChannel || constants.undefined_mark;
        
        // create link
        if (branchUniversalObj) {

                    var properties = {
                            feature: constants.srf_linksharing_feature,
                            channel: selectedChannel,
                            campaign : campaignId,
                            data : {
                                    link_timestamp: Date.now()

                            }
                        };

                    var controlParams = {};
                    
                                    
                    branchUniversalObj.generateShortUrl(properties, controlParams).then(function (res) {
                        // Success Callback
                    
                        Branch.userCompletedAction("LinkGenerated");
                        shareFunction(res.url);
                    
                    }).catch(function(err) {
                    
                        // Error callback
                        console.log('Error: Offer_ShowShareSheet_Click_GenerateShortUrlError');
                        analytics.trackEvent ('Errors','Offer_ShowShareSheet_Click_GenerateShortUrlError','campaignId_'+campaignId);
                        f7.alert(constants.error_linksharing_notgenerated);

                    });
    


        } 
        else {
            // error as no branch unviersal object was created!!!!
            console.log('Error: Offer_ShowShareSheet_Click_NoBranchUniversalObjectExists');
            analytics.trackEvent ('Errors','Offer_ShowShareSheet_Click_NoBranchUniversalObjectExists','campaignId_'+campaignId);
            f7.alert(constants.error_linksharing_notgenerated);
        }
        

    }



    function ShareLinkHandler (campaignId, subject, message, image) {
        
        campaignId = campaignId || '';
        subject = subject || constants.srf_linksharing_title;
        message = message || constants.srf_linksharing_text;
        image = image || '';

        analytics.trackEvent ('Buttons','Offer_ShowShareSheet_Click','campaignId_'+campaignId); 
        
        ShowCustomShareSheet(campaignId,message,subject,image);
        
    }



    module.exports = {

            init : init,
            ShareLinkHandler : ShareLinkHandler,
            BranchInitSession : BranchInitSession,
            BranchResumeSession : BranchResumeSession,
            BranchCreateObject : BranchCreateObject,
            GenerateBranchLink : GenerateBranchLink,
            ShowCustomShareSheet : ShowCustomShareSheet

    }






},{"config/appconfig":2,"config/appstate":3,"config/constants":4,"f7":6,"services/ga_analytics":74}],42:[function(require,module,exports){
 function HandleExternalLink () {

    var elem = this;
    var link = $$(elem).data('href');
    console.log("Try open " + link);
    
    if ((typeof link != "undefined")  && (link != null)) {
        OpenLink(link, "_blank");
    }
                             
    return false;
}

function OpenLink(link, target) {
    
        if (typeof(cordova.ThemeableBrowser) != "undefined") {

            var options = {
    
                                        toolbar: {
                                            height: 44,
                                            color: '#F8F7F7'
                                        },
                                         backButton: {
                                            wwwImage: 'img/inappbrowser/btnback.png',
                                            wwwImagePressed: 'img/inappbrowser/btnback_hover.png',
                                            wwwImageDensity: 3,
                                            align: 'left'
                                        },
                                        closeButton: {
                                            wwwImage: 'img/inappbrowser/btnclose.png',
                                            wwwImagePressed: 'img/inappbrowser/btnclose_hover.png',
                                            wwwImageDensity: 3,
                                            align: 'right'
                                        },
                                        
                                        
                                        backButtonCanClose: true
                                    
                        };
                                     
            cordova.ThemeableBrowser.open(link, target, options).addEventListener(cordova.ThemeableBrowser.EVT_ERR, onErrorCritical).addEventListener(cordova.ThemeableBrowser.EVT_WRN, onErrorWarning);

                    function onErrorCritical(e) {

                        if (e.code === cordova.ThemeableBrowser.ERR_CRITICAL) {
                                // Handle critical error

                            } 
                        console.error(e.message);

                    }

                    function onErrorWarning(e){

                                                
                            if (e.code === cordova.ThemeableBrowser.WRN_UNDEFINED) {
                            
                                // TODO: Some property undefined in config.

                            } else if (e.code === cordova.ThemeableBrowser.WRN_UNEXPECTED) {
                                
                                // TODO: Something strange happened. But no big deal.
                            }

                            console.log(e.message); 
                    }

                     
                                    
            }
            else {

                console.log("Cordova.ThemableBrowser is not loaded");
            }

}

module.exports = {

     HandleExternalLink : HandleExternalLink,
     OpenLink : OpenLink
};
},{}],43:[function(require,module,exports){

module.exports = {
  	"adsdata":{"banner_enabled":"1","banner_position":"2","banner_id":"","bg_color":"#E0E0E0","interstitial_enabled":"1","interstitial_id":"","interstitial_min_interval":"90000","ad_free_period":"604800000","test_mode":""}};
      
},{}],44:[function(require,module,exports){
module.exports = {
  "advertisers":[
      {"id":"20","name":"Cash&Carry Inc.","icon":null,"img":"../img/demo/logo1.png","section_id":"foods","disp_order":"0"},
      {"id":"21","name":"Goods Inc.","icon":null,"img":"../img/demo/logo2.png","section_id":"foods","disp_order":"0"},
      {"id":"22","name":"Superfood PLC","icon":null,"img":"../img/demo/logo3.png","section_id":"foods","disp_order":"0"},
      {"id":"23","name":"Veryshop","icon":null,"img":"../img/demo/logo4.png","section_id":"foods","disp_order":"0"},
      {"id":"24","name":"CARSHOP","icon":null,"img":"","section_id":"offers","disp_order":"0"},
      {"id":"25","name":"Aroma world","icon":null,"img":"","section_id":"offers","disp_order":"0"},
      
      
      ]};
},{}],45:[function(require,module,exports){
module.exports = {
  "categories":[
      {"id":"1","name":"Pastries","icon":"0","section_id":"foods","disp_order":"0","parent_id":null},
      {"id":"2","name":"Meat","icon":"0","section_id":"foods","disp_order":"0","parent_id":null},
      {"id":"3","name":"Vegetables","icon":"0","section_id":"foods","disp_order":"0","parent_id":null},
      {"id":"4","name":"Fruit","icon":"0","section_id":"foods","disp_order":"0","parent_id":null},
      {"id":"5","name":"Drinks","icon":"0","section_id":"foods","disp_order":"0","parent_id":null},
      {"id":"6","name":"Desserts","icon":"0","section_id":"foods","disp_order":"0","parent_id":null},
      {"id":"7","name":"Bread","icon":"0","section_id":"foods","disp_order":"0","parent_id":"1"},
      {"id":"8","name":"Cookies","icon":"0","section_id":"foods","disp_order":"0","parent_id":"1"},
      {"id":"9","name":"Ice-cream","icon":"0","section_id":"foods","disp_order":"0","parent_id":"6"},
      {"id":"10","name":"Alcohol","icon":"0","section_id":"foods","disp_order":"0","parent_id":"5"},
      
      {"id":"111","name":"Clothes","icon":"icon-t-shirt fa-lg","section_id":"offers","disp_order":"1","parent_id":null},
      {"id":"121","name":"Perfumes","icon":"icon-flask fa-lg","section_id":"offers","disp_order":"2","parent_id":null},
      {"id":"131","name":"For pets","icon":"icon-paw fa-lg","section_id":"offers","disp_order":"3","parent_id":null},
      {"id":"141","name":"Electronics","icon":"icon-tv fa-lg","section_id":"offers","disp_order":"4","parent_id":null},
      {"id":"151","name":"Sports","icon":"icon-futbol-o fa-lg","section_id":"offers","disp_order":"5","parent_id":null},
      {"id":"161","name":"Automotive","icon":"icon-automobile fa-lg","section_id":"offers","disp_order":"6","parent_id":null},
      {"id":"171","name":"Engineering","icon":"icon-wrench fa-lg","section_id":"offers","disp_order":"7","parent_id":null},
      ]}
},{}],46:[function(require,module,exports){
module.exports = {
offer: {
id: "810",
name: "Baguette",
body: "Good fresh baguette",
img: "img/demo/if_Baguette_2138193.png",
img1: "img/demo/if_Baguette_2138193.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "7",
price_new: "5",
discount_size: "- 29 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "7",
cat_name: "Bread",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],47:[function(require,module,exports){
module.exports = {
offer: {
id: "811",
name: "Bread",
body: "Good fresh bread",
img: "img/demo/if_Bread_2138191.png",
img1: "img/demo/if_Bread_2138191.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "4",
price_new: "3",
discount_size: "- 25 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "7",
cat_name: "Bread",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],48:[function(require,module,exports){
module.exports = {
offer: {
id: "812",
name: "Cake",
body: "Piece of cake",
img: "img/demo/if_Cake_2138189.png",
img1: "img/demo/if_Cake_2138189.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "3",
price_new: "1",
discount_size: "- 67 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "8",
cat_name: "Cookies",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],49:[function(require,module,exports){
module.exports = {
offer: {
id: "813",
name: "Carrot",
body: "Carrots for rabbits",
img: "img/demo/if_carrot-vegetable-spring-food_2189593.png",
img1: "img/demo/if_carrot-vegetable-spring-food_2189593.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "5",
price_new: "2",
discount_size: "- 60 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "3",
cat_name: "Vegetables",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],50:[function(require,module,exports){
module.exports = {
offer: {
id: "814",
name: "Shampagne",
body: "",
img: "img/demo/if_christmas-icon-glass_820690.png",
img1: "img/demo/if_christmas-icon-glass_820690.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "2",
price_new: "1",
discount_size: "- 50 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "10",
cat_name: "Alcohol",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],51:[function(require,module,exports){
module.exports = {
offer: {
id: "815",
name: "Donut",
body: "Good fresh Donut",
img: "img/demo/if_donut_1760351.png",
img1: "img/demo/if_donut_1760351.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "6",
price_new: "4",
discount_size: "- 33 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "8",
cat_name: "Cookies",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],52:[function(require,module,exports){
module.exports = {
offer: {
id: "816",
name: "Fries",
body: "Very tasty!",
img: "img/demo/if_fries_1760349.png",
img1: "img/demo/if_fries_1760349.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "7",
price_new: "6",
discount_size: "- 14 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "3",
cat_name: "Vegetables",
special_attribute: null,
advertiser_id: "21",
advertiser: "Goods Inc.",
address_info: [

]
}
}
},{}],53:[function(require,module,exports){
module.exports = {
offer: {
id: "817",
name: "Pears",
body: "",
img: "if_fruiticons_buttons_pear_1844703.png",
img1: "if_fruiticons_buttons_pear_1844703.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "5",
price_new: "4",
discount_size: "- 20 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "4",
cat_name: "Fruit",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],54:[function(require,module,exports){
module.exports = {
offer: {
id: "818",
name: "Grapes",
body: "They are so sweet",
img: "img/demo/if_grapes_2003194.png",
img1: "img/demo/if_grapes_2003194.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "2",
price_new: "1",
discount_size: "- 50 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "4",
cat_name: "Fruit",
special_attribute: null,
advertiser_id: "23",
advertiser: "Veryshop",
address_info: [
]
}
}
},{}],55:[function(require,module,exports){
module.exports = {
offer: {
id: "819",
name: "Ice cream",
body: "Sweet and icy!",
img: "img/demo/if_Icecream_2376763.png",
img1: "img/demo/if_Icecream_2376763.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "9",
price_new: "6",
discount_size: "- 33 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "9",
cat_name: "Ice-cream",
special_attribute: null,
advertiser_id: "22",
advertiser: "Superfood PLC",
address_info: [

]
}
}
},{}],56:[function(require,module,exports){
module.exports = {
offer: {
id: "820",
name: "Lemon",
body: "Good to add to tea",
img: "img/demo/if_lemon_2003309.png",
img1: "img/demo/if_lemon_2003309.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "5",
price_new: "3",
discount_size: "- 40 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "4",
cat_name: "Fruit",
special_attribute: null,
advertiser_id: "21",
advertiser: "Goods Inc.",
address_info: [
]
}
}
},{}],57:[function(require,module,exports){
module.exports = {
offer: {
id: "821",
name: "Meat",
body: "Perfec for steak!",
img: "img/demo/if_meet_416384.png",
img1: "img/demo/if_meet_416384.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "4",
price_new: "2",
discount_size: "- 50 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "2",
cat_name: "Meat",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],58:[function(require,module,exports){
module.exports = {
offer: {
id: "822",
name: "Pizza",
body: "Genuine italian taste",
img: "img/demo/if_pizza_1760345.png",
img1: "img/demo/if_pizza_1760345.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "7",
price_new: "3",
discount_size: "- 57 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "7",
cat_name: "Bread",
special_attribute: null,
advertiser_id: "21",
advertiser: "Goods Inc.",
address_info: [

]
}
}
},{}],59:[function(require,module,exports){
module.exports = {
offer: {
id: "823",
name: "Pomegranate",
body: "",
img: "img/demo/if_pomegranate_2003195.png",
img1: "img/demo/if_pomegranate_2003195.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "3",
price_new: "1",
discount_size: "- 67 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "4",
cat_name: "Fruit",
special_attribute: null,
advertiser_id: "21",
advertiser: "Goods Inc.",
address_info: [

]
}
}
},{}],60:[function(require,module,exports){
module.exports = {
offer: {
id: "824",
name: "Strawberry",
body: "Delicious",
img: "img/demo/if_strawberry_2003311.png",
img1: "img/demo/if_strawberry_2003311.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "5",
price_new: "2",
discount_size: "- 60 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "4",
cat_name: "Fruit",
special_attribute: null,
advertiser_id: "20",
advertiser: "Cash&Carry Inc.",
address_info: [
{
address: "Makers st. 42",
workhours: "Daily 10:00–21:00"
},
{
address: "Worker blvd, 10-4",
workhours: "Daily 09:00–21:00"
}
]
}
}
},{}],61:[function(require,module,exports){
module.exports = {
offer: {
id: "825",
name: "Watermelon",
body: "Big, green and with stripes",
img: "img/demo/if_watermelon_2003190.png",
img1: "img/demo/if_watermelon_2003190.png",
system_date_from: "2017-07-01",
system_date_to: "2027-07-31",
price_old: "6",
price_new: "2",
discount_size: "- 67 %",
add_info: "Some additional information",
can_complain: "1",
sec_system_name: "foods",
sec_name: "Foods",
category: "4",
cat_name: "Fruit",
special_attribute: null,
advertiser_id: "22",
advertiser: "Superfood PLC",
address_info: [

]
}
}
},{}],62:[function(require,module,exports){
module.exports = { "offer":
{"id":"981","name":"Fitness club discounts","body":"This is offer description. Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum id pri","system_date_to":"2027-05-31","discount_size":"10 percent","img":"img/demo/fitness_logo1.jpg","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"8","cat_name":"","special_attribute":null,"advertiser_id":"1222","advertiser":"FitnessWorld","email":"info@fitnessworld.com","weblink1":"","weblink2":"","event_datetime":null,"address_info":[{"address":"Shultz st. 15, bldg 2/3","phone":"+43 4321 442246","workhours":"12 a.m. - 19 p.m."}],"images":["img/demo/fitness1.jpg", "img/demo/fitness2.jpg" , "img/demo/fitness3.jpg" ]}
};
},{}],63:[function(require,module,exports){
module.exports = { "offer":
{"id":"982","name":"Clothes for kids","body":"This is offer description 2 Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum","system_date_to":"2027-05-31","discount_size":"10 percent","img":"img/demo/clothes_logo1.jpg","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"8","cat_name":"","special_attribute":null,"advertiser_id":"1222","advertiser":"Kidzone","email":"mail@kidzone.com","weblink1":"","weblink2":"","event_datetime":null,"address_info":[{"address":"High Lane 53/14, of.34","phone":"+4 11 442246","workhours":"10 a.m. - 19 p.m"}],"images":["img/demo/clothes1.jpg", "img/demo/clothes2.jpg" , "img/demo/clothes3.jpg" ]}
};
},{}],64:[function(require,module,exports){
module.exports = { "offer":
{"id":"983","name":"Repair your auto with discount!","body":"Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum","system_date_to":"2020-05-31","discount_size":"25 percent","img":"img/demo/auto_logo1.png","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"8","cat_name":"","special_attribute":null,"advertiser_id":"24","advertiser":"MegaAuto","email":"hi@megaa.com","weblink1":"","weblink2":"","event_datetime":null,"address_info":[{"address":"St. Backers, 34-2","phone":"+7 981 234234","workhours":"10 a.m. - 18 p.m"}],"images":["img/demo/auto1.jpg", "img/demo/auto2.jpg" , "img/demo/auto3.jpg" ]}
};
},{}],65:[function(require,module,exports){
module.exports = { "offer":
{"id":"984","name":"Care for your pet","body":"Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum","system_date_to":"2020-01-31","discount_size":"7 percent","img":"img/demo/vet_logo1.png","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"8","cat_name":"","special_attribute":null,"advertiser_id":"25","advertiser":"Pet center Inc.","email":"market@pets.info.com","weblink1":"","weblink2":"","event_datetime":null,"address_info":[{"address":"St. Backers, 4-2","phone":"+7 234 435464","workhours":"10 a.m. - 22 p.m"}],"images":["img/demo/vet1.jpg", "img/demo/vet2.jpg" , "img/demo/vet3.jpg" ]}
};
},{}],66:[function(require,module,exports){
module.exports = { "offer":
{"id":"985","name":"New device","body":"Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum","system_date_to":"2021-01-31","discount_size":"11 percent","img":"img/demo/home_logo1.jpg","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"8","cat_name":"","special_attribute":null,"advertiser_id":"28","advertiser":"Technomania","email":"orders@techno.st.biz","weblink1":"","weblink2":"","event_datetime":null,"address_info":[{"address":"J.Hallway ave. 36.","phone":"+7 234 435444","workhours":"10 a.m. - 20 p.m"},{"address":"Main road 23","phone":"+7 234 4354445","workhours":"10 a.m. - 22 p.m"}],"images":["img/demo/home1.png", "img/demo/home2.jpg" , "img/demo/home3.jpg" ]}
};
},{}],67:[function(require,module,exports){
module.exports = { "offer":
{"id":"986","name":"Cars! : new and used","body":"Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum","system_date_to":"2022-03-31","discount_size":"10 percent","img":"img/demo/auto2_logo1.jpg","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"161","cat_name":"","special_attribute":null,"advertiser_id":"24","advertiser":"CARSHOP","email":"orders@carshop.co.com","weblink1":"","weblink2":"","event_datetime":null,"address_info":[{"address":"Middle road 112","phone":"+74 224 5645644","workhours":"10 a.m. - 20 p.m"}],"images":["img/demo/auto2_1.jpg", "img/demo/auto2_2.jpg" ]}
};
},{}],68:[function(require,module,exports){
module.exports = { "offer":
{"id":"987","name":"Trendy aroma for new season","body":"Lorem ipsum dolor sit amet, nam ne nullam phaedrum consequat. Fugit ullum argumentum","system_date_to":"2022-03-31","discount_size":"3 percent","img":"img/demo/perfume_logo1.jpg","metakeywords":"","pr_cat":"1","exclusive":"0","modify_date":"1498164303","add_info":"Some additional info","can_complain":"1","sec_system_name":"offers","sec_name":"Offers","category":"121","cat_name":"","special_attribute":null,"advertiser_id":"25","advertiser":"Aroma world","email":"mail@aromaworld.biz","weblink1":"","weblink2":"","event_datetime":null,"address_info":[],"images":["img/demo/perfume1.jpg", "img/demo/perfume2.jpg" ]}
};
},{}],69:[function(require,module,exports){

module.exports = {"offers": [

    
] }
},{}],70:[function(require,module,exports){

module.exports = {"offers": [

    {
id: "810",
name: "Baguette",
metakeywords: "bread bakery pastry",
img: "img/demo/if_Baguette_2138193.png",
price_old: "7",
price_new: "5",
discount_size: "- 29 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "7",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "811",
name: "Bread",
metakeywords: "bread bakery pastry",
img: "img/demo/if_Bread_2138191.png",
price_old: "4",
price_new: "3",
discount_size: "- 25 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "7",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
    {
id: "812",
name: "Cake",
metakeywords: "sweet cookies",
img: "img/demo/if_Cake_2138189.png",
price_old: "3",
price_new: "1",
discount_size: "- 67 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "8",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "813",
name: "Carrot",
metakeywords: "vegetable fresh vegetarian",
img: "img/demo/if_carrot-vegetable-spring-food_2189593.png",
price_old: "5",
price_new: "2",
discount_size: "- 60 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "3",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "814",
name: "Shampagne",
metakeywords: "drink sparkling alcohol",
img: "img/demo/if_christmas-icon-glass_820690.png",
price_old: "2",
price_new: "1",
discount_size: "- 50 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "10",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "815",
name: "Donut",
metakeywords: "sweet cookie",
img: "img/demo/if_donut_1760351.png",
price_old: "6",
price_new: "4",
discount_size: "- 33 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "8",
pr_cat: "1",
exclusive: "1",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "816",
name: "Fries",
metakeywords: "",
img: "img/demo/if_fries_1760349.png",
price_old: "7",
price_new: "6",
discount_size: "- 14 %",
order_category: null,
order_section: null,
advertiser: "Goods Inc.",
advertiser_id: "21",
category: "3",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "817",
name: "Pears",
metakeywords: "fruit sweet fresh vegetarian healthy",
img: "img/demo/if_fruiticons_buttons_pear_1844703.png",
price_old: "5",
price_new: "4",
discount_size: "- 20 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "4",
pr_cat: "1",
exclusive: "1",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "818",
name: "Grapes",
metakeywords: "fruit sweet fresh vegetarian healthy",
img: "img/demo/if_grapes_2003194.png",
price_old: "2",
price_new: "1",
discount_size: "- 50 %",
order_category: null,
order_section: null,
advertiser: "Veryshop",
advertiser_id: "23",
category: "4",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "819",
name: "Ice cream",
metakeywords: "cool sweet",
img: "img/demo/if_Icecream_2376763.png",
price_old: "9",
price_new: "6",
discount_size: "- 33 %",
order_category: null,
order_section: null,
advertiser: "Superfood PLC",
advertiser_id: "22",
category: "9",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "820",
name: "Lemon",
metakeywords: "",
img: "img/demo/if_lemon_2003309.png",
price_old: "5",
price_new: "3",
discount_size: "- 40 %",
order_category: null,
order_section: null,
advertiser: "Goods Inc.",
advertiser_id: "21",
category: "4",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "821",
name: "Meat",
metakeywords: "",
img: "img/demo/if_meet_416384.png",
price_old: "4",
price_new: "2",
discount_size: "- 50 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "2",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "822",
name: "Pizza",
metakeywords: "italian",
img: "img/demo/if_pizza_1760345.png",
price_old: "7",
price_new: "3",
discount_size: "- 57 %",
order_category: null,
order_section: null,
advertiser: "Goods Inc.",
advertiser_id: "21",
category: "1",
pr_cat: "1",
exclusive: "1",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "823",
name: "Pomegranate",
metakeywords: "fruit sweet fresh vegetarian healthy",
img: "img/demo/if_pomegranate_2003195.png",
price_old: "3",
price_new: "1",
discount_size: "- 67 %",
order_category: null,
order_section: null,
advertiser: "Goods Inc.",
advertiser_id: "21",
category: "4",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "824",
name: "Strawberry",
metakeywords: "fruit sweet fresh vegetarian healthy",
img: "img/demo/if_strawberry_2003311.png",
price_old: "5",
price_new: "2",
discount_size: "- 60 %",
order_category: null,
order_section: null,
advertiser: "Cash&Carry Inc.",
advertiser_id: "20",
category: "4",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
},
{
id: "825",
name: "Watermelon",
metakeywords: "fruit sweet fresh vegetarian healthy",
img: "img/demo/if_watermelon_2003190.png",
price_old: "6",
price_new: "2",
discount_size: "- 67 %",
order_category: null,
order_section: null,
advertiser: "Superfood PLC",
advertiser_id: "22",
category: "4",
pr_cat: "1",
exclusive: "0",
system_date_from: "2017-07-01",
system_date_to: "2017-07-31",
modify_date: "1498903765"
}
] }


},{}],71:[function(require,module,exports){

module.exports = {"offers": [
    {"id":"987","name":"The NY Times","metakeywords":"New york times","order_category":"0","order_section":"1","event_datetime":null,"ext_link":"https://www.nytimes.com/section/world","category":"0","img":"img/demo/news_logo1.png","discount_size":null,"advertiser":"NY Times","pr_cat":"1","exclusive":"0","system_date_to":null,"modify_date":"1486648706"},
    {"id":"988","name":"Business Insider","metakeywords":"","order_category":"0","order_section":"2","event_datetime":null,"ext_link":"http://www.businessinsider.com/","category":"0","img":"img/demo/news_logo2.png","discount_size":null,"advertiser":"Business Insider","pr_cat":"1","exclusive":"0","system_date_to":null,"modify_date":"1486648706"}
],
"prior_categories":[{"id":"1","name":"Standard","disp_order":"3","class":"pr-std"},
{"id":"2","name":"Priority","disp_order":"2","class":"pr-pri"},
{"id":"3","name":"Top","disp_order":"1","class":"pr-top"}] }
},{}],72:[function(require,module,exports){

module.exports = {"offers": [{"id":"981","name":"Fitness club discounts","metakeywords":"Fitness sport activities games","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"151","img":"img/demo/fitness_logo1.jpg","discount_size":"10%","advertiser":"FitnessWorld","pr_cat":"3","exclusive":"0","system_date_to":null,"modify_date":"1483013163"},
{"id":"982","name":"Clothes for kids","metakeywords":"Clothes kids children wear","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"111","img":"img/demo/clothes_logo1.jpg","discount_size":"15%","advertiser":"Kidzone","pr_cat":"3","exclusive":"0","system_date_to":null,"modify_date":"1483013161"},
{"id":"983","name":"Repair your auto with discount!","metakeywords":"Car automobile","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"161","img":"img/demo/auto_logo1.png","discount_size":"25%","advertiser":"MegaAuto","pr_cat":"3","exclusive":"1","system_date_to":null,"modify_date":"1483013161"},
{"id":"984","name":"Care for your pet","metakeywords":"Dog cat veterinarian animals","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"131","img":"img/demo/vet_logo1.png","discount_size":"7%","advertiser":"Pet center Inc.","pr_cat":"1","exclusive":"0","system_date_to":null,"modify_date":"1483013161"},
{"id":"985","name":"New Device for Lowest Price","metakeywords":"Electronics home","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"141","img":"img/demo/home_logo1.jpg","discount_size":"11%","advertiser":"Technomania","pr_cat":"1","exclusive":"0","system_date_to":null,"modify_date":"1483013161"},
{"id":"986","name":"Cars! : new and used","metakeywords":"Car automobile","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"161","img":"img/demo/auto2_logo1.jpg","discount_size":"10%","advertiser":"CARSHOP","pr_cat":"1","exclusive":"0","system_date_to":null,"modify_date":"1483013161"},
{"id":"987","name":"Trendy aroma for new season","metakeywords":"Perfumes fashion","order_category":"0","order_section":"0","event_datetime":null,"ext_link":null,"category":"121","img":"img/demo/perfume_logo1.jpg","discount_size":"3%","advertiser":"Aroma world","pr_cat":"1","exclusive":"0","system_date_to":null,"modify_date":"1483013161"},
],

"prior_categories":[{"id":"1","name":"Standard","disp_order":"3","class":"pr-std"},
{"id":"2","name":"Priority","disp_order":"2","class":"pr-pri"},
{"id":"3","name":"Top","disp_order":"1","class":"pr-top"}]};

},{}],73:[function(require,module,exports){
module.exports = {
	"version": "4.0", 
    "link": "itms-apps://itunes.apple.com/app/idXXXXXXXX" };
},{}],74:[function(require,module,exports){
// Google analytics tracking functions

    var constants = require('config/constants'),
        appState = require('config/appstate'),
        SectionModel = require('modules/navigation/sections');
    
 function init() {

    if (typeof window.ga != "undefined")  { 
           
           // id, dispatchPeriod, success, error
            window.ga.startTrackerWithId(constants.srf_gaAppId, constants.srf_gaDispatchInterval , function() {
            
                // startTracker - success
                
                window.ga.setAllowIDFACollection(true);
            },
            function() {                // startTracker - failed
            
            });
            
        }
    }


 function trackEvent (category,action,label,value) {
     
    // category - string
    // action - string
    // label - string - optional
    // value - int - optional 

    if (typeof window.ga != "undefined")  { 
        
        category = category || '';
        action = action || '';
        label = label || '';
        value = value || 0;

        window.ga.trackEvent(category,action,label,value);
     }

}


function trackOfferView (offerId, offerTitle, offer_advertiser_id, offer_advertiser_name, offer_section_name, offer_cat_name) {
     
         setCustomDimensions({
                            section_name : offer_section_name,
                            category_name : offer_cat_name,
                            advertiser_name : offer_advertiser_name,
                            offer_title : offerTitle,
                            advertiser_id : offer_advertiser_id,
                            offer_id : offerId
                        });

    if (typeof window.ga != "undefined") window.ga.trackView('Offer View');

}




function trackView (viewTitle, cat_name, advertiser_name, advertiser_id) {

     var sec_name;
     
     if (SectionModel[viewTitle]) {
        
        sec_name = SectionModel[viewTitle].title;
     }
     else {
        sec_name = viewTitle || constants.undefined_mark;
     } 
     
     var cat_name = cat_name || constants.undefined_mark;
     var advertiser_name = advertiser_name || constants.undefined_mark;
     var advertiser_id = advertiser_id || constants.undefined_mark;

    setCustomDimensions({
                            section_name : sec_name,
                            category_name : cat_name,
                            advertiser_name : advertiser_name,
                            advertiser_id :advertiser_id
                        });

    if (typeof window.ga != "undefined") window.ga.trackView(viewTitle);
        
        
}

   function setCustomDimensions(params) {
    
    // Custom dimensions:
    // 1- Section
    // 2- Category
    // 3- Advertiser
    // 4- Offer title
    // 5 - Advertiser ID
    // 6 - Offer ID
    // 7 - UserPushID

    var params = params || {};

    if (typeof window.ga != "undefined")  {     
        window.ga.addCustomDimension(1, params.section_name || constants.undefined_mark);
        window.ga.addCustomDimension(2, params.category_name || constants.undefined_mark);
        window.ga.addCustomDimension(3, params.advertiser_name || constants.undefined_mark);
        window.ga.addCustomDimension(4, params.offer_title || constants.undefined_mark);
        window.ga.addCustomDimension(5, params.advertiser_id || constants.undefined_mark);
        window.ga.addCustomDimension(6, params.offer_id || constants.undefined_mark);
        window.ga.addCustomDimension(7, appState.get("UserPushID") || constants.undefined_mark);
    }
    else {

        console.log('GoogleAnalytics set custom dimension error : window.ga - undefined');
    }

}


   module.exports = {

       init : init,
       trackView : trackView,
       trackOfferView : trackOfferView,
       trackEvent : trackEvent

   }

},{"config/appstate":3,"config/constants":4,"modules/navigation/sections":29}],75:[function(require,module,exports){

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

   

             
            
},{"app":1,"config/constants":4}],76:[function(require,module,exports){
// This is demonstration-version (mock) of getting data from server, used just for demo
// For production, implement your own server-logic, that will deliver JSON-data you need.

// DEMO CODE (MOCKING): ------------------------------------------------------- ( delete this after implementing Production server-side code)


   var constants = require('config/constants'),
        utility = require('utils/utility');
        
        require('services/demodata/categories');
        require('services/demodata/offers_offers');
        require('services/demodata/offers_foods');
        require('services/demodata/offers_events');
        require('services/demodata/offers_news');
        require('services/demodata/offer_item_810');
        require('services/demodata/offer_item_811');
        require('services/demodata/offer_item_812');
        require('services/demodata/offer_item_813');
        require('services/demodata/offer_item_814');
        require('services/demodata/offer_item_815');
        require('services/demodata/offer_item_816');
        require('services/demodata/offer_item_817');
        require('services/demodata/offer_item_818');
        require('services/demodata/offer_item_819');
        require('services/demodata/offer_item_820');
        require('services/demodata/offer_item_821');
        require('services/demodata/offer_item_822');
        require('services/demodata/offer_item_823');
        require('services/demodata/offer_item_824');
        require('services/demodata/offer_item_825');
        require('services/demodata/offer_item_981');
        require('services/demodata/offer_item_982');
        require('services/demodata/offer_item_983');
        require('services/demodata/offer_item_984');
        require('services/demodata/offer_item_985');
        require('services/demodata/offer_item_986');
        require('services/demodata/offer_item_987');
        require('services/demodata/advertisers');
        require('services/demodata/version');
        require('services/demodata/adsdata');
        ///////////////////////////////////////////////////////


            function makeRequest(path, success, error) {
                
                
                
                        var section = path.slice((constants.srf_api_uri + "get_").length, path.indexOf(".php")),
                            itemtype = utility.getQueryParamValue("type",path) || "",
                            item_id = utility.getQueryParamValue("id",path) || "";
                        
                        if ((typeof(section) != "undefined") && section) {
                            
                            var item_specifier = "";
                            if (section == "offers") {
                                item_specifier =  "_" + itemtype;
                            }
                            else if (section == "offer_item")  {
                                item_specifier =  "_" + item_id;
                            }
                            
                            var mockdata = require("services/demodata/" + section + item_specifier);

                            if ((typeof(mockdata) != "undefined") && mockdata) {

                                success(JSON.stringify(mockdata));
                            }
                            else {
                                error();
                            }
                            
                        }
                        else {
                            error();
                        }
                        
                
            }

            function makePost(path, data, success, error) {

                            success();
                        

            }

module.exports = {

    makeRequest : makeRequest,
    makePost : makePost
}
},{"config/constants":4,"services/demodata/adsdata":43,"services/demodata/advertisers":44,"services/demodata/categories":45,"services/demodata/offer_item_810":46,"services/demodata/offer_item_811":47,"services/demodata/offer_item_812":48,"services/demodata/offer_item_813":49,"services/demodata/offer_item_814":50,"services/demodata/offer_item_815":51,"services/demodata/offer_item_816":52,"services/demodata/offer_item_817":53,"services/demodata/offer_item_818":54,"services/demodata/offer_item_819":55,"services/demodata/offer_item_820":56,"services/demodata/offer_item_821":57,"services/demodata/offer_item_822":58,"services/demodata/offer_item_823":59,"services/demodata/offer_item_824":60,"services/demodata/offer_item_825":61,"services/demodata/offer_item_981":62,"services/demodata/offer_item_982":63,"services/demodata/offer_item_983":64,"services/demodata/offer_item_984":65,"services/demodata/offer_item_985":66,"services/demodata/offer_item_986":67,"services/demodata/offer_item_987":68,"services/demodata/offers_events":69,"services/demodata/offers_foods":70,"services/demodata/offers_news":71,"services/demodata/offers_offers":72,"services/demodata/version":73,"utils/utility":81}],77:[function(require,module,exports){
// Server API interaction utility functions
    
    var constants = require('config/constants'),
        appState = require('config/appstate'),
        storage = require('services/storage'),
        utility = require('utils/utility'),
        request = require('services/request_demo');     // DEMO DATA. Remove this after implementing server-side logic
        //request = require('services/request');        // Uncomment this in Production after implementing server-side logic to fetch JSON data from it


            function LoadAdsConfig(success, error) {

               
                   return request.makeRequest(constants.srf_api_uri +'get_adsdata.php?platform='+ appState.get("device_platform"), success, error);

            }
          

            function SendComplain(data, success, error) {

              
                return request.makePost(constants.srf_api_uri +'complain.php', data, success, error);
                //  console.log("COMPLAIN Data will be sent to: " + constants.srf_api_uri +'complain.php'+' DATA: ' + data.toString());
            }

            function loadFilterItems (filterItemsType, success, error) {
                
                
                    return request.makeRequest(constants.srf_api_uri + 'get_'+filterItemsType+'.php', success, error);
            }

                 
            function loadOffers (itemtype, success, error) {
                
                if ((typeof itemtype != "undefined")  && (itemtype != null)) {
                   
                    
                    return request.makeRequest(constants.srf_api_uri +'get_offers.php?type=' + itemtype  + '&platform=' + appState.get("device_platform"), success, error);
                    
                }
                else {
                    error(); 
                        
                }
            }

            function loadOfferPage(itemtype, id, success, error) {
       
        
                if ((typeof itemtype != "undefined")  && (itemtype != null) && (typeof id != "undefined")  && (id != null)) {
                    
                    var offer_data  = storage.getItem('srf_'+ itemtype + '_'+ id);
                    
                    if ((offer_data != null) && (offer_data.length > 0)) {

                                //offer is present at local storage
                                success(offer_data);
                    }

                    else {
                                    //offer is not present at local storage

                                    fetchOfferPage (itemtype, id, function(data) {
                                
                                            storage.setItem('srf_'+itemtype+'_' + id, data);    
                                            success(data);

                                    }, error);
                            }    
                }
                else {
                    error(); 
                        
                }
                
            }

            function fetchOfferPage(itemtype, id, success, error) {

                if ((typeof itemtype != "undefined")  && (itemtype != null) && (typeof id != "undefined")  && (id != null)) {
                        
                        return request.makeRequest(constants.srf_api_uri +'get_offer_item.php?id=' + id + '&type=' + itemtype, success, error);    
                }
                else {
                    error(); 
                }
            }

            function getLastVersion(success, error) {
                    
                    return request.makeRequest(constants.srf_api_uri +'get_version.php?platform=' + appState.get("device_platform"), success, error);    

            }



        module.exports = {

            loadFilterItems : loadFilterItems,
            loadOffers : loadOffers,
            loadOfferPage : loadOfferPage,
            SendComplain : SendComplain,
            getLastVersion : getLastVersion,
            LoadAdsConfig : LoadAdsConfig

        }

},{"config/appstate":3,"config/constants":4,"services/request_demo":76,"services/storage":78,"utils/utility":81}],78:[function(require,module,exports){
// LocalStorage functions

        var constants = require('config/constants');

        var persisted_items = [constants.storage.config_persisted, constants.storage.favourites];
               

        function CleanLocalStorageData () {

            for (key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    if (!persisted_items.includes(key)) {
                        
                        delete localStorage[key];
                    }

                }
            }
            
        }
        
        function SetDataLastUpdatedTime() {

            
            setItem(constants.storage.config_data_last_updated,Date.now());
        }

        function ShouldUpdateDataFromServer () {

                var srf_data_last_updated = getItem(constants.storage.config_data_last_updated);
                    
                    if ((typeof(srf_data_last_updated) !="undefined") && (srf_data_last_updated != null) && (typeof(srf_data_last_updated) == "string") && (typeof(constants.srf_data_update_interval) != "undefined")&& (constants.srf_data_update_interval != null)) {

                        return  ((Date.now() - srf_data_last_updated) >= constants.srf_data_update_interval); 
                
                }
                    else {
                        return true;
                    }



        }

        function updateLocalData(itemtype, objectData) {
            
            setItem('srf_'+itemtype, JSON.stringify(objectData));
            SetDataLastUpdatedTime();


        }

        function setItem(key, data) {

            window.localStorage.setItem(key,data);
        }

        function getItem(key) {

            return window.localStorage.getItem(key);
        }

        function removeItem(key) {

            window.localStorage.removeItem(key);
        }

       

    module.exports  = {
            
            ShouldUpdateDataFromServer : ShouldUpdateDataFromServer,
            CleanLocalStorageData : CleanLocalStorageData,
            setItem : setItem,
            getItem : getItem,
            removeItem : removeItem,
            updateLocalData : updateLocalData

        }           
          

},{"config/constants":4}],79:[function(require,module,exports){

var serverapi = require('services/serverapi'),
    constants = require('config/constants'),
    browser= require('services/browser'),
    f7 = require('f7');
    

function checkUpdate() {

    serverapi.getLastVersion(function(data) {
        
        var last_available_version = JSON.parse(data).version.toString();
        var link = JSON.parse(data).link.toString();

        if ((cmpVersions(last_available_version, constants.srf_app_version) > 0) && link) {
              
            //update needed
              f7.modal({
                            text: constants.messages.update_confirmation,
                            buttons: [
                            {
                                text: constants.messages.general_no
                            },
                            {
                                text: constants.messages.general_yes,
                                bold: true,
                                onClick: function() {
                                    
                                    OpenStoreForUpdate(link);
                                }
                            }]
                        });
            
        }

    },
    function(err) {


    })

}

function OpenStoreForUpdate(link) {
    
    browser.OpenLink(link, "_system");
}


function cmpVersions (a, b) {
    var i, diff;
    var regExStrip0 = /(\.0+)+$/;
    var segmentsA = a.replace(regExStrip0, '').split('.');
    var segmentsB = b.replace(regExStrip0, '').split('.');
    var l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}



module.exports = {

    checkUpdate : checkUpdate
}

},{"config/constants":4,"f7":6,"services/browser":42,"services/serverapi":77}],80:[function(require,module,exports){


            Template7.registerHelper('rusdate', function (date, options) {
  
            
                return (new Date(date)).toLocaleString("ru",{ year: "numeric",  month: "long",  day: "numeric"});
  
            });



            Template7.registerHelper('rusdate_noyear', function (date, options){
            
                        
                        return (new Date(date)).toLocaleString("ru",{ month: "long",  day: "numeric"});
            
            });



},{}],81:[function(require,module,exports){
// Helper and utility functions

var f7 = require('f7'),
    util_sorting = require('utils/utility_sorting'),
    util_polyfill = require('utils/utility_polyfill'),
    appConfig = require('config/appconfig');
        
        
    function bindEvents(page, bindings) {
                    
                    for (var i in bindings) {
                        
                        if (bindings.hasOwnProperty(i)) {
                                    if (bindings[i].onlyOnCurrentPage) {
                                        if(bindings[i].delegate) {
                                            $$(page.container).find(bindings[i].element).on(bindings[i].event, bindings[i].delegate, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }
                                        else {
                                            $$(page.container).find(bindings[i].element).on(bindings[i].event, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }
                                        
                                    } 
                                    else {
                                        
                                        if(bindings[i].delegate) {
                                            $$(bindings[i].element).on(bindings[i].event, bindings[i].delegate, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }
                                        else {
                                            $$(bindings[i].element).on(bindings[i].event, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }

                                        
                                    }
                        }
                    }
        }

        
    function compileTemplates(templates) {

        
        for (templateName in templates) {
            if (templates.hasOwnProperty(templateName)) {
                templates[templateName].compiledTemplate = Template7.compile(templates[templateName].template);
            }
        }
                
    }


        function GetPageNameFromUrl(url) {

            if (url) return url.slice(0,url.indexOf('.html'));
        }

        function getQueryParamValue(name, url) {
            
            
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            
            var results = regex.exec( url );
            
            return results == null ? null : results[1];    
            
        }



        // Helper function to check if a string contains substring
        function stringContains(searchin, searchfor) {
                return (searchin.indexOf(searchfor) > -1) ? true : false; 
                
        }

        function parseId(url) {
            return url.substr(url.indexOf("?id")+4,url.length-(url.indexOf("?id")+4));
        }



        function IsItemExpired (item) {
            
            if ((item.system_date_to) && (item.system_date_to != '0000-00-00')) {
                var offer_date_to = new Date(item.system_date_to);
                
                // Add +1 day as offer_date_to - is the LAST day in period  (we check if the next day arrived)
                if (Date.now() < addDays(offer_date_to,1)) {


                    return false;
                    
                }
                else {

                    return true;
                    
                }

            } 
            else {
                // if "system_date_to" field is absent, offer is considered to be not expired

                return false;
                
            }
            
            


        }

            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

    
    module.exports =  {

        GetPageNameFromUrl : GetPageNameFromUrl,
        getQueryParamValue : getQueryParamValue,
        IsItemExpired : IsItemExpired,
        SortArrayBy : util_sorting.SortArrayBy,
        bindEvents : bindEvents,
        compileTemplates : compileTemplates

    }

},{"config/appconfig":2,"f7":6,"utils/utility_polyfill":82,"utils/utility_sorting":83}],82:[function(require,module,exports){

  if (!Array.prototype.find) {

  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}

if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

if (![].includes) {
  Array.prototype.includes = function(searchElement/*, fromIndex*/) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    while (k < len) {
      var currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)
      ) {
        return true;
      }
      k++;
    }
    return false;
  };
}

},{}],83:[function(require,module,exports){

// Helper STABLE sorting


  Array.prototype.mergeSort = mergeSort;

  function mergeSort(compare) {

    var length = this.length,
        middle = Math.floor(length / 2);

    if (!compare) {
      compare = function(left, right) {
        if (left < right)
          return -1;
        if (left == right)
          return 0;
        else
          return 1;
      };
    }

    if (length < 2)
      return this;

    return merge(
      this.slice(0, middle).mergeSort(compare),
      this.slice(middle, length).mergeSort(compare),
      compare
    );
  }

  function merge(left, right, compare) {

    var result = [];

    while (left.length > 0 || right.length > 0) {
      if (left.length > 0 && right.length > 0) {
        if (compare(left[0], right[0]) <= 0) {
          result.push(left[0]);
          left = left.slice(1);
        }
        else {
          result.push(right[0]);
          right = right.slice(1);
        }
      }
      else if (left.length > 0) {
        result.push(left[0]);
        left = left.slice(1);
      }
      else if (right.length > 0) {
        result.push(right[0]);
        right = right.slice(1);
      }
    }
    return result;
  }



        function SortArrayBy(arr, sort_field ,fieldtype, direction) {
            
            var sortingFunction = null;
            
            if (fieldtype=="int") {
                    
                    if (direction=="desc") {
                    
                        
                        sortingFunction =  sortIntArrayDesc;
                    }
                    else {
                        sortingFunction =  sortIntArrayAsc;
                        
                    }    

                    return arr.mergeSort(sortingFunction); // mergeSort is suitable only for INT

            }
            else if (fieldtype=="bool") {

                    if (direction=="truefirst") {
                    
                        
                        sortingFunction =  sortBoolArrayTrueFirst;
                    }
                    else {
                        sortingFunction =  sortBoolArrayFalseFirst;
                        
                    }
                
                return arr.mergeSort(sortingFunction);


            }

            else {
                
                if (direction=="desc") {
                    
                        
                        sortingFunction =  sortStringArrayDesc;
                    }
                    else {
                        sortingFunction =  sortStringArrayAsc;
                        
                    }
                
                return arr.mergeSort(sortingFunction);
            }
                
            
                        
            // Helper sorting functions
            function sortIntArrayAsc(a,b) {
                    
                    return a[sort_field] - b[sort_field];

             }


               
            function sortIntArrayDesc(a,b) {

                    return b[sort_field] - a[sort_field];
            
                    
            }

            function sortBoolArrayTrueFirst(a,b) {
    
                    var a = a[sort_field] || false;		//in case of undefined, they are considered false
                    var b = b[sort_field] || false;
                    
                    if (a == b) return 0;
                    if ((a == true) && (b == false)) return 1;
                    if ((a == false) && (b == true)) return -1;
            }

            function sortBoolArrayFalseFirst(a,b) {
            
                var a = a[sort_field] || false;		//in case of undefined, they are considered false
                var b = b[sort_field] || false;
                
                if (a == b) return 0;
                if ((a == true) && (b == false)) return -1;
                if ((a == false) && (b == true)) return 1;
            }



            
            function sortStringArrayAsc(a,b) {

                return  (sortCompare(a[sort_field], b[sort_field])) ? 1 : -1;
                
            }

            function sortStringArrayDesc(a,b) {
            
                return  (sortCompare(a[sort_field], b[sort_field])) ? -1 : 1;

                    
            }
            
            // function for correct comparison of Cyrillic and Latin symbols
            // Latin should go after cyrillic
            
            function sortCompare(a,b) { 
            
                // A > B  -> true
                // A < B  -> false
                
                for (var i=0; i < a.length; i++) {
                    
                        if (!isCyrillicSymbol(a[i]) && isCyrillicSymbol(b[i])) {
                            return true
                        }
                        else if (isCyrillicSymbol(a[i]) && !isCyrillicSymbol(b[i])){
                            return false
                        }
                        else {
                            
                            if (a == b) continue;
                            
                            return (a > b);
                        }
                        
                }
                
            
            }
            
            function isCyrillicSymbol(s) {
                
                return ((s.charCodeAt(0) >= 1040) && (s.charCodeAt(0) <= 1103));
            }

                     
        }
  

  module.exports = {

    SortArrayBy : SortArrayBy
  }


},{}]},{},[1])(1)
});