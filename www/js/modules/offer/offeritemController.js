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

