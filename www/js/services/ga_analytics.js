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
