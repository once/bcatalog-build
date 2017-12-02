
var leftnavModel = require('modules/navigation/leftnavModel'),
    leftnavView = require('modules/navigation/leftnavView'),
    constants = require('config/constants');

    var visible;

    var bindings = [{
            element: '.panel-left',
            event: 'closed',
            handler: onClosed,
            onlyOnCurrentPage : false
        },
        {
            element: '.panel-left',
            event: 'opened',
            handler: onOpened,
            onlyOnCurrentPage : false

        }];

    function init () {
            
        var model = {
            appname : constants.srf_app_name,
            navigationNodes : leftnavModel.nodes
        };

        leftnavView.render(model, bindings);
        visible = false;
    }


    function onClosed() {

        visible = false;
        
    }

    function onOpened() {
        
        visible = true;
                
    }
    
           
    
    module.exports =  {

        init : init,
        isVisible: function() {
            return visible;
        }
        
    };
