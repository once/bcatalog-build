
    var f7 = require('f7'),
        constants = require('config/constants'),
        analytics= require('services/ga_analytics'),
        serverapi = require('services/serverapi'),
        utility= require('utils/utility');
  

      var from_offer_id;
      var from_offer_type;

      var bindings = [{

                element: '.complain-answer',
                event: 'click',
                handler: onComplainAnswerClicked,
                onlyOnCurrentPage : true

            }];

    function init (page) {

        if (page.from == "right") analytics.trackView('complain');  // Track page only if open through menu
            
        from_offer_id = page.fromPage.query.id;
        from_offer_type = page.fromPage.query.type;

        utility.bindEvents(f7.getCurrentView().activePage, bindings);


    }

     function onComplainAnswerClicked() {

            var compl_id = $$(this).data('id') || 0;
            var compl_text = $$(this).text() || '';

            ConfirmComplainAndSend({
                complain_id: compl_id,
                complain_text : compl_text

            });

    }


    function ConfirmComplainAndSend(params) {

        var compl_id = params.complain_id || '';
        var compl_text = params.complain_text || '';


           // if ((typeof window.plugins != "undefined") && (typeof window.plugins.OneSignal != "undefined"))  {              // we need user OneSignal Push_ID

                //    window.plugins.OneSignal.getIds(function(ids) {
            
                                var push_user_id =  7;//ids.userId;
                                var push_user_token =  7;//ids.pushToken;

                                f7.modal({
                                    title:  'Please confirm',
                                    text: 'You have selected option: <b>' +compl_text+ '</b>. Please confirm sending.',
                                    
                                    buttons: [
                                    {
                                        text: 'No',
                                        onClick: function() {}
                                    },
                                    {
                                        text: 'Yes',
                                        onClick: function() {

                                            var complain_data = {
                                                    user_id: push_user_id,
                                                    user_token: push_user_token,
                                                    offer_type: from_offer_type,
                                                    offer_id: from_offer_id,
                                                    complain_id: compl_id,
                                                    complain_text: compl_text
                                            };
                                            
                                            SendComplainAndGoBack(complain_data);
                                        }
                                    }]
                                });   
           //     }); 
        
           // }
           // else {
                // OneSignal initialization error
          //      analytics.trackEvent ('Errors','Offer_Complain_Send_OneSignalUnavailableError');
         //       f7.alert(constants.messages.error_internet_connection_poor);
         //   }
            


    }

   
    function SendComplainAndGoBack(complain_data) {

            serverapi.SendComplain(complain_data,function() {

                var current_view = f7.getCurrentView();

                f7.alert(constants.messages.complain_confirmation, 'Thank you', function () {

                            current_view.router.back();

                    });

            }, function() {

                f7.alert(constants.messages.error_internet_connection_poor);

            });
    }



    module.exports = {

        init : init,
        ConfirmComplainAndSend : ConfirmComplainAndSend
        
    }
