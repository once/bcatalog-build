
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
