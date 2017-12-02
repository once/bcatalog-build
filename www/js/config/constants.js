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