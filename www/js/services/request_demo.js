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