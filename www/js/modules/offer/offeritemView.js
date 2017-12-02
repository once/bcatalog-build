
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
