    
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

