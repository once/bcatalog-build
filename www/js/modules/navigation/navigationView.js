
    var f7= require('f7');
    
    function renderHeaderTitle(text) {


             $$(f7.getCurrentView().container).find('.navbar div.center.link').html(text);
             f7.sizeNavbars();
                
    }

    module.exports =  {

        renderHeaderTitle : renderHeaderTitle
    }
