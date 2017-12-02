    
    var constants = require('config/constants'),
        storage= require('services/storage'),
        utility= require('utils/utility');
    
    var favouritesArray = [];

    favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];

    function add(item) {

        if (item) {
           
                if (!itemInFavourites(item)) {
                    
                    favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];

                    var item_to_add = {
                        id : item.id,
                        name : item.name,
                        metakeywords : item.metakeywords,
                        event_datetime : item.event_datetime,
                        category : item.category,
                        img : item.img,
                        discount_size : item.discount_size,
                        advertiser : item.advertiser,
                        pr_cat : item.pr_cat,
                        exclusive : item.exclusive,
                        system_date_to : item.system_date_to,
                        modify_date : item.modify_date
                    };

                    favouritesArray.unshift(item_to_add);
                    storage.setItem(constants.storage.favourites, JSON.stringify(favouritesArray));
                }
                else {

                    console.log(constants.messages.favourites_already_added);
                }
        }
        
        
    }
    
    function itemInFavourites(item) {


        if (favouritesArray.find(function(arrayitem, index, ar) {
                    return arrayitem.id == item.id ? true : false;

        })) {

            return true;
        }
        
        return false;

    }

    function removeById(id) {
              
              favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];
            
              if (favouritesArray.length) {
                  
                  var item_index = favouritesArray.findIndex(function(element, index, ar) {
                        return element.id == id ? true : false;
                  });

                  if (item_index != -1 ) {
                    favouritesArray.splice(item_index,1);   
                    storage.setItem(constants.storage.favourites, JSON.stringify(favouritesArray));
                  }
                  
                  
            }

    }


    function remove(index) {

          favouritesArray = JSON.parse(storage.getItem(constants.storage.favourites)) || [];
          
          favouritesArray.splice(index,1);
          
          storage.setItem(constants.storage.favourites, JSON.stringify(favouritesArray));

    }
    
    function load() {

        var items = JSON.parse(storage.getItem(constants.storage.favourites)) || [];
        var priority_categories = JSON.parse(storage.getItem(constants.storage.priority_categories)) || [];


        items.forEach(function(item, index, ar) {
            
                items[index].expired=utility.IsItemExpired(item);

                if (priority_categories.length) {

                        // Adding classes for priority categories
                        item.pr_class = priority_categories[item.pr_cat].class;
                        item.pr_order = priority_categories[item.pr_cat].disp_order;           

                }
            
        });

        items = sort(items);

        return items;

    }

    function sort(items) {


        items = utility.SortArrayBy(items, "pr_order","int", "asc");// Sorting by priority categories
        items = utility.SortArrayBy(items, "expired","int", "asc"); // Sorting by "expired" field - all expired items go in the end
        return items;
    }

    module.exports = {
        add : add,
        remove : remove,
        removeById : removeById,
        itemInFavourites : itemInFavourites,
        load : load

    }
