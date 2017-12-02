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



