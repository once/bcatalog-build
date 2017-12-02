var constants = require("config/constants");

    module.exports = {
                  "offers" : {
                
                                title : constants.messages.sections["offers"].title,
                                headerType : "vertical-selector",
                                headerText : constants.messages.sections["offers"].headerText,
                                selectorHeaderText : constants.messages.sections["offers"].selectorHeaderText,
                                filterItemsDataVertical: {
                                        filterItemsType : "categories",
                                        sort_field : "disp_order",
                                        sort_field_type :"int",
                                        sort_order : "asc",
                                        filter_fields : ["section_id"],
                                        items_filter_by_field : "category",
                                        items_filter_by_field_display_name : constants.messages.sections["offers"].filters.vertical.items_filter_by_field_display_name,
                                        all_selector_name : constants.messages.sections["offers"].filters.vertical.all_selector_name,
                                },
                                canAddToFavourites : true,
                                bottomToolbar : false
                },

                "foods" : {
                
                                title:  constants.messages.sections["foods"].title,
                                headerType : "combined-selector",
                                headerText : constants.messages.sections["foods"].headerText,
                                selectorHeaderText : constants.messages.sections["foods"].selectorHeaderText,
                                filterItemsDataVertical: {
                                        filterItemsType : "advertisers",
                                        sort_field : "name",
                                        sort_field_type :"string",
                                        sort_order : "asc",
                                        filter_fields : ["section_id"],
                                        items_filter_by_field : "advertiser_id",
                                        items_filter_by_field_display_name : constants.messages.sections["foods"].filters.vertical.items_filter_by_field_display_name,
                                        all_selector_name : constants.messages.sections["foods"].filters.vertical.all_selector_name,
                                },
                                filterItemsDataHorizontal: {
                                        filterItemsType : "categories",
                                        sort_field : "disp_order",
                                        sort_field_type :"int",
                                        sort_order : "asc",
                                        filter_fields : ["section_id","parent_id"],
                                        items_filter_by_field : "category",
                                        items_filter_by_field_display_name : constants.messages.sections["foods"].filters.horizontal.items_filter_by_field_display_name,
                                        all_selector_name : constants.messages.sections["foods"].filters.horizontal.all_selector_name,
                                },
                                canAddToFavourites : false,
                                bottomToolbar : true
                },
        "events" : {
                
                title:  constants.messages.sections["events"].title,
                headerType : "title",
                canAddToFavourites : false,
                bottomToolbar : false
        
        },
        "news" : {
                
                title:  constants.messages.sections["news"].title,
                headerType : "title",
                canAddToFavourites : false,
                bottomToolbar : false
        },
        "contacts" : {
                
                title:  constants.messages.sections["contacts"].title,
                headerType : "title"
        },
        
        "favourites" : {
                
                title:  constants.messages.sections["favourites"].title,
                headerType : "title",
                canAddToFavourites : true
        },
       
        "settings" : {
                
                title:  constants.messages.sections["settings"].title,
                headerType : "title",
                canAddToFavourites : false
        },
         "developer" : {
                
                title:  "DeveloperConsole",
                headerType : "title",
                canAddToFavourites : false
        },
         "complain" : {
                
                title:  "complain",
                headerType : "title",
                canAddToFavourites : false
        }
        };

