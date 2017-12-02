
    var f7 = require('f7'),
        constants = require('config/constants'),
        analytics= require('services/ga_analytics'),
        utility= require('utils/utility');
  
      var bindings = [{

                element: '#report',
                event: 'click',
                handler: onReportClicked,
                onlyOnCurrentPage : true

            }];

     function init (page) {

            analytics.trackView('complain_form');

            utility.bindEvents(f7.getCurrentView().activePage, bindings);

    }

    function validateDescription() {
        
        if (!($$('#fld-description').val().trim())) { 
                f7.alert(constants.messages.problem_description_required);
                return false;
        }
        
        return true;

    }

    function onReportClicked() {

            if (!validateDescription()) return false;
            
            var compl_text =$$('#fld-description').val();
            
            require('modules/complain/complainController').ConfirmComplainAndSend({
                complain_id: 5,
                complain_text : compl_text
            });


    }

module.exports = {

    init: init
}
