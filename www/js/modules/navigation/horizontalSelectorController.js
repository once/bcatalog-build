
    var horizontalSelectorView = require('modules/navigation/horizontalSelectorView'),
        SectionModel = require('modules/navigation/sections'),
        Categories = require('modules/navigation/categories');

    function horizontalSelector(section, refreshData) {

        this.section = section;
        this.refreshData = refreshData;
        
        this.filter_field = SectionModel[this.section].filterItemsDataHorizontal.items_filter_by_field;
        this.filter_field_display_name = SectionModel[this.section].filterItemsDataHorizontal.items_filter_by_field_display_name;
        
        this.history = [];

        this.bindings = [
            {
            element: '.hs-item',
            event: 'click',
            handler: this.onItemSelected.bind(this),
            onlyOnCurrentPage : true

        },
         {
            element: '#hs-back',
            event: 'click',
            handler: this.onBack.bind(this),
            onlyOnCurrentPage : true

        },
       ];

       
       horizontalSelectorView.init();

       this.update(null);

    }

 horizontalSelector.prototype.update = function(parent_id) {
    
    parent_id = parent_id || null;

    Categories.getFilterItems(SectionModel[this.section].filterItemsDataHorizontal, this.refreshData, [this.section, parent_id], this.onItemsLoaded.bind(this));

 }


 horizontalSelector.prototype.onItemsLoaded = function(items) {
                
       if (!items.length) {
        this.history.pop();
        return; // + highligh selected item
       }

        var renderBackButton = (this.history.length > 0) ? true : false;
        horizontalSelectorView.render(items, renderBackButton, this.bindings);                                                
    }
 
    
       
    horizontalSelector.prototype.onItemSelected = function(event) {

                    var selected_item_id = $$(event.currentTarget).data('id');
                    var selected_item_name = $$(event.currentTarget).data('name');

                    $$(event.currentTarget).addClass('active');
                    $$(event.currentTarget).siblings().removeClass('active');

                    var filter = {
                        filter_field : this.filter_field,
                        filter_field_display_name : this.filter_field_display_name,
                        filter_value_id : selected_item_id,
                        filter_value_name : selected_item_name,
                        filter_type : "range_match"
                    };

                    this.history.push(selected_item_id);

                    /// Update list of categories in filter 
                    this.update(selected_item_id);

                    // And applying filters to list of offers
                    require("modules/list/offerlistController").addFilter(filter);                
                    

    }

    horizontalSelector.prototype.onBack = function() {
        this.history.pop();
        this.update(this.history[this.history.length-1]);

          var filter = {
                        filter_field : this.filter_field,
                        filter_field_display_name : this.filter_field_display_name,
                        filter_value_id : 0,
                        filter_value_name : "",
                        filter_type : "range_match"
                    };
            require("modules/list/offerlistController").addFilter(filter);                

    }

    module.exports = horizontalSelector;

