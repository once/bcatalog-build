// LocalStorage functions

        var constants = require('config/constants');

        var persisted_items = [constants.storage.config_persisted, constants.storage.favourites];
               

        function CleanLocalStorageData () {

            for (key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    if (!persisted_items.includes(key)) {
                        
                        delete localStorage[key];
                    }

                }
            }
            
        }
        
        function SetDataLastUpdatedTime() {

            
            setItem(constants.storage.config_data_last_updated,Date.now());
        }

        function ShouldUpdateDataFromServer () {

                var srf_data_last_updated = getItem(constants.storage.config_data_last_updated);
                    
                    if ((typeof(srf_data_last_updated) !="undefined") && (srf_data_last_updated != null) && (typeof(srf_data_last_updated) == "string") && (typeof(constants.srf_data_update_interval) != "undefined")&& (constants.srf_data_update_interval != null)) {

                        return  ((Date.now() - srf_data_last_updated) >= constants.srf_data_update_interval); 
                
                }
                    else {
                        return true;
                    }



        }

        function updateLocalData(itemtype, objectData) {
            
            setItem('srf_'+itemtype, JSON.stringify(objectData));
            SetDataLastUpdatedTime();


        }

        function setItem(key, data) {

            window.localStorage.setItem(key,data);
        }

        function getItem(key) {

            return window.localStorage.getItem(key);
        }

        function removeItem(key) {

            window.localStorage.removeItem(key);
        }

       

    module.exports  = {
            
            ShouldUpdateDataFromServer : ShouldUpdateDataFromServer,
            CleanLocalStorageData : CleanLocalStorageData,
            setItem : setItem,
            getItem : getItem,
            removeItem : removeItem,
            updateLocalData : updateLocalData

        }           
          
