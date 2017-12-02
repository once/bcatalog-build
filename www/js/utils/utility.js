// Helper and utility functions

var f7 = require('f7'),
    util_sorting = require('utils/utility_sorting'),
    util_polyfill = require('utils/utility_polyfill'),
    appConfig = require('config/appconfig');
        
        
    function bindEvents(page, bindings) {
                    
                    for (var i in bindings) {
                        
                        if (bindings.hasOwnProperty(i)) {
                                    if (bindings[i].onlyOnCurrentPage) {
                                        if(bindings[i].delegate) {
                                            $$(page.container).find(bindings[i].element).on(bindings[i].event, bindings[i].delegate, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }
                                        else {
                                            $$(page.container).find(bindings[i].element).on(bindings[i].event, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }
                                        
                                    } 
                                    else {
                                        
                                        if(bindings[i].delegate) {
                                            $$(bindings[i].element).on(bindings[i].event, bindings[i].delegate, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }
                                        else {
                                            $$(bindings[i].element).on(bindings[i].event, bindings[i].handler, bindings[i].useCapture ? true : false);
                                        }

                                        
                                    }
                        }
                    }
        }

        
    function compileTemplates(templates) {

        
        for (templateName in templates) {
            if (templates.hasOwnProperty(templateName)) {
                templates[templateName].compiledTemplate = Template7.compile(templates[templateName].template);
            }
        }
                
    }


        function GetPageNameFromUrl(url) {

            if (url) return url.slice(0,url.indexOf('.html'));
        }

        function getQueryParamValue(name, url) {
            
            
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp( regexS );
            
            var results = regex.exec( url );
            
            return results == null ? null : results[1];    
            
        }



        // Helper function to check if a string contains substring
        function stringContains(searchin, searchfor) {
                return (searchin.indexOf(searchfor) > -1) ? true : false; 
                
        }

        function parseId(url) {
            return url.substr(url.indexOf("?id")+4,url.length-(url.indexOf("?id")+4));
        }



        function IsItemExpired (item) {
            
            if ((item.system_date_to) && (item.system_date_to != '0000-00-00')) {
                var offer_date_to = new Date(item.system_date_to);
                
                // Add +1 day as offer_date_to - is the LAST day in period  (we check if the next day arrived)
                if (Date.now() < addDays(offer_date_to,1)) {


                    return false;
                    
                }
                else {

                    return true;
                    
                }

            } 
            else {
                // if "system_date_to" field is absent, offer is considered to be not expired

                return false;
                
            }
            
            


        }

            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }

    
    module.exports =  {

        GetPageNameFromUrl : GetPageNameFromUrl,
        getQueryParamValue : getQueryParamValue,
        IsItemExpired : IsItemExpired,
        SortArrayBy : util_sorting.SortArrayBy,
        bindEvents : bindEvents,
        compileTemplates : compileTemplates

    }
