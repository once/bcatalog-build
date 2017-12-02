 function HandleExternalLink () {

    var elem = this;
    var link = $$(elem).data('href');
    console.log("Try open " + link);
    
    if ((typeof link != "undefined")  && (link != null)) {
        OpenLink(link, "_blank");
    }
                             
    return false;
}

function OpenLink(link, target) {
    
        if (typeof(cordova.ThemeableBrowser) != "undefined") {

            var options = {
    
                                        toolbar: {
                                            height: 44,
                                            color: '#F8F7F7'
                                        },
                                         backButton: {
                                            wwwImage: 'img/inappbrowser/btnback.png',
                                            wwwImagePressed: 'img/inappbrowser/btnback_hover.png',
                                            wwwImageDensity: 3,
                                            align: 'left'
                                        },
                                        closeButton: {
                                            wwwImage: 'img/inappbrowser/btnclose.png',
                                            wwwImagePressed: 'img/inappbrowser/btnclose_hover.png',
                                            wwwImageDensity: 3,
                                            align: 'right'
                                        },
                                        
                                        
                                        backButtonCanClose: true
                                    
                        };
                                     
            cordova.ThemeableBrowser.open(link, target, options).addEventListener(cordova.ThemeableBrowser.EVT_ERR, onErrorCritical).addEventListener(cordova.ThemeableBrowser.EVT_WRN, onErrorWarning);

                    function onErrorCritical(e) {

                        if (e.code === cordova.ThemeableBrowser.ERR_CRITICAL) {
                                // Handle critical error

                            } 
                        console.error(e.message);

                    }

                    function onErrorWarning(e){

                                                
                            if (e.code === cordova.ThemeableBrowser.WRN_UNDEFINED) {
                            
                                // TODO: Some property undefined in config.

                            } else if (e.code === cordova.ThemeableBrowser.WRN_UNEXPECTED) {
                                
                                // TODO: Something strange happened. But no big deal.
                            }

                            console.log(e.message); 
                    }

                     
                                    
            }
            else {

                console.log("Cordova.ThemableBrowser is not loaded");
            }

}

module.exports = {

     HandleExternalLink : HandleExternalLink,
     OpenLink : OpenLink
};