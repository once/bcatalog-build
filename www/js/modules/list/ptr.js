
var f7 = require('f7');


// Pull-To-Refresh processing
function init () {
            
            $$(f7.getCurrentView().activePage.container).find('.pull-to-refresh-content').on('refresh',function() {

                        console.log('ptr refresh trigger');
                        require("modules/list/offerlistController").getItems(true);                

            });
            
    }

    module.exports =  {

        init: init
    }
    
