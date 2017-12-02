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
