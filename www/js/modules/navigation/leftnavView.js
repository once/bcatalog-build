
var fs = require('fs'),
    leftnavTemplate = fs.readFileSync(__dirname + '/templates/leftnavTemplate.html', 'utf8'),
    utility = require('utils/utility'),
    leftnavCompiledTemplate = Template7.compile(leftnavTemplate);

function render(model, bindings ) {

        $$('.header-appname').html(model.appname); // render app title
        $$('.panel-left .list-block').html(leftnavCompiledTemplate(model.navigationNodes));
        
        utility.bindEvents(f7.getCurrentView().activePage, bindings);

    }


module.exports = {
    render: render
};
