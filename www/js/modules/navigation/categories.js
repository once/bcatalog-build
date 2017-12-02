
        var constants = require('config/constants'),
            storage = require('services/storage'),
            serverapi = require('services/serverapi'),
            utility = require('utils/utility');

            function getSubCategories(category_id) {

                var items = JSON.parse(storage.getItem(constants.storage.filterdata_prefix + '_categories'));
                var subcats = [];
                
                getSubCats(category_id);

                return subcats;

                function getSubCats(id) {
                                
                        for (var i=0; i < items.length; i++ ) {
                
                                if (items[i].parent_id == id) {
                                        
                                        subcats.push(items[i].id);
                                        getSubCats(items[i].id);  
                                }
                        }
                }
                        
                        
            }



            function getFilterItems(filteritemsData, refresh, filterValues, onItemsLoaded) {

                loadFilterItems(filteritemsData.filterItemsType, refresh, function(results){
                        
                        var items =  results.filter(function(item, index, ar) {

                                for (var i=0; i < filteritemsData.filter_fields.length; i++) {

                                        if (item[filteritemsData.filter_fields[i]] != filterValues[i]) return false;
                                }
                                                
                                return true;
                                        
                        });     
                        
                        items = utility.SortArrayBy(items , filteritemsData.sort_field,filteritemsData.sort_field_type, filteritemsData.sort_order);


                        onItemsLoaded(items);

                });

                
            }


            function loadFilterItems(filterItemsType, refresh, onItemsLoaded) {

                var results = refresh ? [] : JSON.parse(storage.getItem(constants.storage.filterdata_prefix + '_'+filterItemsType)) || [];
                        
                if (results.length === 0) {
                        
                        serverapi.loadFilterItems(filterItemsType, function(data) {
                                
                                data = JSON.parse(data);
                                data[filterItemsType].forEach(function(item, index) {

                                        results[index]= item;
                                });
                                
                                storage.setItem(constants.storage.filterdata_prefix + '_'+filterItemsType, JSON.stringify(results));
                                
                                onItemsLoaded(results);
                                                                                
                                
                        }, function () {
                                                                                
                                console.log('error loading ' + filterItemsType);
                                
                        });    
                        
                }
                else {

                        onItemsLoaded(results);
                } 
                


            }

            function getAdvertiserLogo(advertiser_id) {
                    
                    var advertisers_data = JSON.parse(storage.getItem(constants.storage.filterdata_prefix + '_advertisers'));
                    
                    var advertiser = advertisers_data.find(function(arrayitem, index, ar) {
                        return arrayitem.id == advertiser_id ? true : false;
                    });
                    
                    if (advertiser) return advertiser.img


            }



        module.exports =  {
                getFilterItems : getFilterItems,
                getSubCategories : getSubCategories,
                getAdvertiserLogo : getAdvertiserLogo,
                loadFilterItems : loadFilterItems
                
        }

