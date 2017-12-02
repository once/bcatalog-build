
    var f7 = require('f7'),
        fs = require('fs'),
        utility = require('utils/utility'),
        horizontalSelectorTemplate = fs.readFileSync(__dirname + '/templates/horizontalSelector.html', 'utf8'),
        hsCompiledTemplate = Template7.compile(horizontalSelectorTemplate),
        hsDom;
    

        function init() {

            hsDom = $$(f7.getCurrentView().activePage.container).find('.horizontal-selector');

            hsDom.show();  // it's hidden by default. !! Before SHOW,  height will be NaN !!!

            var search_bar_dom = $$(f7.getCurrentView().activePage.container).find('.searchbar');
            var search_bar_top = +(search_bar_dom.css("top")).replace("px",""); // cast to int value
            var new_top_padding = search_bar_top + search_bar_dom.height() + hsDom.height() + 9;
                
            $$(f7.getCurrentView().activePage.container).find('.page-content').css('padding-top',new_top_padding+'px');
                
               

        }

        function render(items, renderBackButton, bindings) {

            
            if (!hsDom) init();

                var dhtml =hsCompiledTemplate(
                                            {
                                                items: items,
                                                renderBackButton : renderBackButton
                                            }); 
                
                
                hsDom.html(dhtml);
                
                utility.bindEvents(f7.getCurrentView().activePage, bindings);

                setTimeout(function() { // fix for iOS (without this controls are moved to left)
                    hsDom.scrollLeft(0); 
                }, 80);
        }





module.exports = {
    
    init : init,
    render : render
    
}

