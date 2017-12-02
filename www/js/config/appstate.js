
    var appState = {};

        init();

        function init(){

            appState.device_platform = "undefined";
            appState.UserPushID = "";  //will be set later in BranchInitSession!!!
    
            window.srfAppState = appState;
        };

    

    function has(key) {

        if ((appState.hasOwnProperty(key)) && (appState[key] != null)) {
            return true;


        }
        else {

            return false;
        }
    }

    function get(key) {

       if (has(key)) {
            return appState[key];
        }
        else {
            return null;
    }

       
    }

    function set(key, value) {

       appState[key] = value; 
       window.srfAppState = appState;
    }
        

    window.as_set = set;
    window.as_get = get;

    module.exports = {

                
        init : init,
        get : get,
        set : set
    
    }
