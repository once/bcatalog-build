
    var verticalSelectorView = require('modules/navigation/verticalSelectorView'),
        SectionModel = require('modules/navigation/sections'),
        Categories = require('modules/navigation/categories');

    function verticalSelector(section, refreshData) {

        this.section = section;
        this.refreshData = refreshData;
        this.items = [];
        this.filter_field = SectionModel[this.section].filterItemsDataVertical.items_filter_by_field;
        this.filter_field_display_name = SectionModel[this.section].filterItemsDataVertical.items_filter_by_field_display_name;

        this.all_items_selector = {  id:0,
                                    name:SectionModel[this.section].filterItemsDataVertical.all_selector_name,
                                    icon:null,
                                    section_id:this.section,
                                    disp_order:0,
                                    parent_id:null};

        this.bindings = [
        {
            element: '.popup-vertical-selector a.item-link',
            event: 'click',
            handler: this.onItemSelected.bind(this),
            onlyOnCurrentPage : false

        },
        {
            element: '.popup-vertical-selector',
            event: 'open',
            handler: this.onOpen.bind(this),
            onlyOnCurrentPage : false

        },
        {
            element: '.popup-vertical-selector',
            event: 'close',
            handler: this.onClose.bind(this),
            onlyOnCurrentPage : false

        }];


        this.load();

    }

 verticalSelector.prototype.load = function() {
    
    Categories.getFilterItems(SectionModel[this.section].filterItemsDataVertical, this.refreshData, [this.section], this.onItemsLoaded.bind(this));

 }


 verticalSelector.prototype.onItemsLoaded = function(items) {
                
        items.unshift(this.all_items_selector);
        
        this.items = items;
        
        verticalSelectorView.render(SectionModel[this.section].headerText, SectionModel[this.section].selectorHeaderText, this.items, this.bindings);                                                
    }
 
    
    
    verticalSelector.prototype.onOpen = function() {

        verticalSelectorView.headerChevronUp();
    
    }
    
    verticalSelector.prototype.onClose = function() {

        verticalSelectorView.headerChevronDown();
        
                        
    }
    
    verticalSelector.prototype.onItemSelected = function(event) {

                    var selected_item_id = $$(event.currentTarget).data('id');
                    var selected_item_name = $$(event.currentTarget).data('name');
                                        
                    var filter = {
                        filter_field : this.filter_field,
                        filter_field_display_name : this.filter_field_display_name,
                        filter_value_id : selected_item_id,
                        filter_value_name : selected_item_name,
                        filter_type : "exact_match"
                    };
                    
                     
                    require("modules/list/offerlistController").addFilter(filter);                
                    

    }

    module.exports = verticalSelector;

