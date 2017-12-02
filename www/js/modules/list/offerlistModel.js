    
    var constants = require('config/constants'),
        storage = require('services/storage'),
        serverapi = require('services/serverapi'),
        utility= require('utils/utility'),
        favourites= require('modules/favourites/favouritesController');
        

        function load(itemtype, loadedSuccessCallback,loadedFailedCallback) {

            serverapi.loadOffers(itemtype, onItemsLoaded, loadedFailedCallback);
            
            function onItemsLoaded(data) {

                data = JSON.parse(data);

                if (data.prior_categories) loadPriorityCategories(data.prior_categories);
                var results = filterExpired(data);
                
                storage.updateLocalData(itemtype, results);
                loadedSuccessCallback(results);

            }
        }
        
        function loadPriorityCategories(pr_cats_data) {
            
        var priority_categories = [{}];  // Empty 0 category is required for correct work! Don't remove!
        
            if (pr_cats_data && pr_cats_data.length) {
                    pr_cats_data.forEach(function(item, index) {
                    priority_categories[item.id] = item;
                });

                storage.setItem(constants.storage.priority_categories,JSON.stringify(priority_categories));
            }

        }

        function getItemsForRendering(items, itemtype, filters, category) {

            items = filter(items, filters);

            items = preRenderProcessItems(items);
                    
            items = sort(items, itemtype, category);   // sort AFTER preRender filtering, as "pr_order" is set there!
                    
            return items;
        }


        function preRenderProcessItems(items){ // set additional properties, used while rendering

                var priority_categories = JSON.parse(storage.getItem(constants.storage.priority_categories)) || [];
                items.forEach(function(item, index) {

                    item.isFavourite = favourites.itemInFavourites(item);
                    
                    if (priority_categories.length) {

                        // Adding classes for priority categories
                        item.pr_class = priority_categories[item.pr_cat].class;
                        item.pr_order = priority_categories[item.pr_cat].disp_order;           

                    }
                    

                }); 

                return items;
                
         
            }

        
        function filterExpired(data) {

                var results = [];
                data.offers.forEach(function(item, index) {

                    if (!utility.IsItemExpired(item)) { // add only items that are not expired
                        
                        results.push(item);
                    } 
                    
                });

                return results;

        }


        function sort(items, itemtype, filters) {
    
                    
                    var first_sort_order = "order_section"; // by default we sort by  "Order in section"

                    for (var filter in filters) {  // But if category is defined, then "Order in category is used"
                         if (filter.filter_field == 'category') first_sort_order = "order_category";
                     }
   
                    // Set additional sorting criteria based on type of items...
                    var second_sort_order = "id";  //default;
                    var second_sort_direction = "desc"; //default
                    var second_sort_fieldtype = "int"; //default

                    var priority_sort_order = "pr_order";  //default;
                    
                    if ((itemtype == 'foods')) {
                                
                        second_sort_order = "name";
                        second_sort_direction = "asc";
                        second_sort_fieldtype = "string";
                    
                    }
                    else {
                                
                        second_sort_order = "modify_date";    //"id";     
                        second_sort_direction = "desc";  
                        second_sort_fieldtype = "int";
                    
                    }

                    // Apply sortings 
                    // Sorting must go in reverser order! So the most priority sorting criteria should go last(final)!
        
                    var firstSortedArray = utility.SortArrayBy(items, second_sort_order, second_sort_fieldtype, second_sort_direction);
                    var secondSortedArray = utility.SortArrayBy(firstSortedArray, first_sort_order,"int", "asc");
                    var prioritySortedArray = utility.SortArrayBy(secondSortedArray, priority_sort_order,"int", "asc");
                    
                    items = prioritySortedArray;

                    return items;

        }

        function filter(items, filters) {
                
                if (!filters.length) return items;
                
                for (var i=0;i< filters.length; i++) {
                    if (filters[i].filter_type == "range_match") {

                        filters[i].values_range = require("modules/navigation/categories").getSubCategories(filters[i].filter_value_id);
                            
                    }
                
                }
                
                return applyFilterCollection();


                function applyFilterCollection() {

                        var items_filtered = items.filter(function(item, index, ar) {

                                for (var i=0;i< filters.length; i++) {

                                    if (!passFilter(item, filters[i])) return false;

                                }

                                // if all filters passed, element is returned to be displayed
                                return true;
                        });

                        return items_filtered;

                }

                function passFilter(item, filter) { 

                    if ((!filter.filter_value_id) || (filter.filter_value_id == "0")) return true;  // if property is empty, we don't use it for filtering
                                            
                    if (filter.filter_type == "range_match") {

                        filter_Function = filter_RangeMatch;
                    }
                    else {
                        
                        filter_Function = filter_ExactValue;

                    }
                                    
                    return filter_Function(item,filter);
                }

                // chec for exact value matching
                function filter_ExactValue(item, filter) {
                    
                    return item[filter.filter_field] == filter.filter_value_id;
                    
                }

                // check for range matching
                function filter_RangeMatch(item, filter) {
                        
                        if (item[filter.filter_field] == filter.filter_value_id) return true;

                        if ((filter.values_range) && (filter.values_range.length)) {
                            
                            if (filter.values_range.includes(item[filter.filter_field])) return true;
                        
                        }
                            
                        return false;

                }
        }



    module.exports = {

            load : load,
            filter : filter,
            sort : sort,
            getItemsForRendering : getItemsForRendering
            

    }
