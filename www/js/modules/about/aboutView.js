
    var f7 = require('f7'),
        fs = require('fs'),
        aboutTemplate = fs.readFileSync(__dirname + '/aboutTemplate.html', 'utf8'),
        utility = require('utils/utility');

    var aboutCompiledTemplate = Template7.compile(aboutTemplate);
    
    function render(contact_data, bindings) {

        $$(f7.getCurrentView().activePage.container).find('.page-content').html(aboutCompiledTemplate(contact_data));

        utility.bindEvents(f7.getCurrentView().activePage, bindings);
        
    }


    
    module.exports = {

        render : render
    }




