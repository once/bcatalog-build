// Branch links utility functions

    var f7 = require('f7'),
        constants = require('config/constants'),
        appState = require('config/appstate'),
        appConfig = require('config/appconfig'),
        analytics = require('services/ga_analytics');


    function init() {
    
            //if (typeof Branch != "undefined") Branch.setDebug(true);
            
            window.branchUniversalObj = null;   // this object MUST BE global
            
            BranchInitSession(); 

    }


    function BranchInitSession() {

        if (typeof Branch != "undefined")  {

            Branch.initSession(BranchDeepLinkHandler).then(function (res) {
        
                //   f7.alert('Init Branch session Response: ' + JSON.stringify(res));
                BranchCreateObject(ids.userId);

            }).catch(function (err) {
                
                //   f7.alert('Error: ' + JSON.stringify(err));

            });

        }
    }


    function BranchResumeSession() {

        if (typeof Branch != "undefined")  {

                Branch.initSession(BranchDeepLinkHandler).then(function (res) {
                
                        //   f7.alert('Resume Branch Session. Success: ' + JSON.stringify(res));

                        }).catch(function (err) {
                            
                        //   f7.alert('Resume Branch Session. Error: ' + JSON.stringify(err));

                });

        }
        
    }
    

    function BranchDeepLinkHandler(data) {

        // read deep link data
        console.log('Deep Link Data: ' + JSON.stringify(data));

        if (typeof data.action != "undefined") {

            switch (data.action) {

                /*case '.......':
                    
                    break;

                // You're free to implement your own actions
                    
                */
                default:
                    break;

            }
        }
        

    }
    

    function BranchCreateObject(oneSignalUserId) {

                var properties = {
                    canonicalIdentifier: constants.srf_linksharing_canonicalIdentifier,
                    title: constants.srf_linksharing_title,
                    contentDescription: constants.srf_linksharing_text,
                    contentImageUrl: constants.srf_linksharing_contentImageUrl,
                    contentIndexingMode: 'public',
                };

                Branch.createBranchUniversalObject(properties).then(function (res) {
                    
                    /// f7.alert('Creaing Branch object. Succes! Response: ' + JSON.stringify(res));
                    branchUniversalObj = res;

                }).catch(function (err) {
                    
                    // f7.alert('Create branch object error: ' + JSON.stringify(err));
                });

    }


    function ShowCustomShareSheet (campaignId,message,subject,image) {

        analytics.trackEvent ('Buttons','Offer_ShowShareSheet','campaignId_'+campaignId);
    
        GenerateBranchLink('OTHER',campaignId,function(link){

                        var linkoptions = {
                            message:message,
                            subject:subject,
                            files: [image],
                            url:link

                        };


                        window.plugins.socialsharing.shareWithOptions(linkoptions, function(result) {
                                // on success
                                // works only on iOs
                                // result.completed
                                // result.app
                            }, function(msg){
                                // on fail
                                // works only on iOs
                                // msg
                            });

        });


    }


    function GenerateBranchLink (selectedChannel, campaignId, shareFunction) {

        selectedChannel = selectedChannel || constants.undefined_mark;
        
        // create link
        if (branchUniversalObj) {

                    var properties = {
                            feature: constants.srf_linksharing_feature,
                            channel: selectedChannel,
                            campaign : campaignId,
                            data : {
                                    link_timestamp: Date.now()

                            }
                        };

                    var controlParams = {};
                    
                                    
                    branchUniversalObj.generateShortUrl(properties, controlParams).then(function (res) {
                        // Success Callback
                    
                        Branch.userCompletedAction("LinkGenerated");
                        shareFunction(res.url);
                    
                    }).catch(function(err) {
                    
                        // Error callback
                        console.log('Error: Offer_ShowShareSheet_Click_GenerateShortUrlError');
                        analytics.trackEvent ('Errors','Offer_ShowShareSheet_Click_GenerateShortUrlError','campaignId_'+campaignId);
                        f7.alert(constants.error_linksharing_notgenerated);

                    });
    


        } 
        else {
            // error as no branch unviersal object was created!!!!
            console.log('Error: Offer_ShowShareSheet_Click_NoBranchUniversalObjectExists');
            analytics.trackEvent ('Errors','Offer_ShowShareSheet_Click_NoBranchUniversalObjectExists','campaignId_'+campaignId);
            f7.alert(constants.error_linksharing_notgenerated);
        }
        

    }



    function ShareLinkHandler (campaignId, subject, message, image) {
        
        campaignId = campaignId || '';
        subject = subject || constants.srf_linksharing_title;
        message = message || constants.srf_linksharing_text;
        image = image || '';

        analytics.trackEvent ('Buttons','Offer_ShowShareSheet_Click','campaignId_'+campaignId); 
        
        ShowCustomShareSheet(campaignId,message,subject,image);
        
    }



    module.exports = {

            init : init,
            ShareLinkHandler : ShareLinkHandler,
            BranchInitSession : BranchInitSession,
            BranchResumeSession : BranchResumeSession,
            BranchCreateObject : BranchCreateObject,
            GenerateBranchLink : GenerateBranchLink,
            ShowCustomShareSheet : ShowCustomShareSheet

    }





