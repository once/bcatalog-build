
var serverapi = require('services/serverapi'),
    constants = require('config/constants'),
    browser= require('services/browser'),
    f7 = require('f7');
    

function checkUpdate() {

    serverapi.getLastVersion(function(data) {
        
        var last_available_version = JSON.parse(data).version.toString();
        var link = JSON.parse(data).link.toString();

        if ((cmpVersions(last_available_version, constants.srf_app_version) > 0) && link) {
              
            //update needed
              f7.modal({
                            text: constants.messages.update_confirmation,
                            buttons: [
                            {
                                text: constants.messages.general_no
                            },
                            {
                                text: constants.messages.general_yes,
                                bold: true,
                                onClick: function() {
                                    
                                    OpenStoreForUpdate(link);
                                }
                            }]
                        });
            
        }

    },
    function(err) {


    })

}

function OpenStoreForUpdate(link) {
    
    browser.OpenLink(link, "_system");
}


function cmpVersions (a, b) {
    var i, diff;
    var regExStrip0 = /(\.0+)+$/;
    var segmentsA = a.replace(regExStrip0, '').split('.');
    var segmentsB = b.replace(regExStrip0, '').split('.');
    var l = Math.min(segmentsA.length, segmentsB.length);

    for (i = 0; i < l; i++) {
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) {
            return diff;
        }
    }
    return segmentsA.length - segmentsB.length;
}



module.exports = {

    checkUpdate : checkUpdate
}
