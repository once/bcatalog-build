
    var constants = require('config/constants'),
        storage = require('services/storage');

    var appConfig = {};



    function save() {
        
        storage.setItem(constants.storage.config_persisted,JSON.stringify(appConfig));
    }



    function load() {

        appConfig = JSON.parse(storage.getItem(constants.storage.config_persisted)) || {};

    }


    function set(key, value) {
        
        appConfig[key] = value;
        save();
    }


    function get(key) {
        
        if (typeof appConfig[key] == "undefined") return null;

        return appConfig[key];
    }


    module.exports =  {
        
        save : save,
        load : load,
        get : get,
        set : set


    }
