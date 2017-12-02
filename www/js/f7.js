
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
        
