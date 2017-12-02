
    var f7 = require('f7'),
        fs = require('fs'),
        constants = require('config/constants'),
        utility = require('utils/utility'),
        verticalSelectorTemplate = fs.readFileSync(__dirname + '/templates/verticalSelector.html', 'utf8'),
        vsCompiledTemplate = Template7.compile(verticalSelectorTemplate);

        
        function render(headerText, selectorHeaderText, items, bindings) {

            // header

            var headerHTML = '<a class="open-popup" data-popup=".popup-vertical-selector" href="#">' + headerText+ '<i style="margin-left: 6px;" class="header-filter-dropdown-chevron icon-chevron-down"></i></a>';
            
            var navbarContainer = f7.getCurrentView().activePage.navbarInnerContainer; 
            if (navbarContainer) {
                $$(navbarContainer).find('.center').html(headerHTML);
            }
            else {
                $$(f7.getCurrentView().container).find('.navbar').find('.center').html(headerHTML);
            }
            
            
            f7.sizeNavbars();

            // items
            var items_html =  '<div class="content-block-title" style="margin: 0px 0px 0px;*/">'+
                    '<div class="select-category-label">' + selectorHeaderText + '</div>'+
                        '<a href="#" class="close-popup popup-closer"><div >' +  constants.messages.general_cancel +'</div></a>'+
                    '</div>'+
                '<div class="list-block small-labels">'+
            vsCompiledTemplate(items)+
                '</div>';

            $$('.popup-vertical-selector').html(items_html);
       
            // bind events
            utility.bindEvents(f7.getCurrentView().activePage, bindings);
        }



        function headerChevronUp() {

            $$('.header-filter-dropdown-chevron').removeClass('icon-chevron-down');
            $$('.header-filter-dropdown-chevron').addClass('icon-chevron-up');
        }



        function headerChevronDown() {

            $$('.header-filter-dropdown-chevron').removeClass('icon-chevron-up');
            $$('.header-filter-dropdown-chevron').addClass('icon-chevron-down');
        }
       


        module.exports = {

            render : render,
            headerChevronUp : headerChevronUp,
            headerChevronDown : headerChevronDown
           
        }

