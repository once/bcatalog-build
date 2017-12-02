

   var f7 = require('f7'),
       fs = require('fs'),
       favouritesTemplate = fs.readFileSync(__dirname + '/templates/favourites.html', 'utf8'),
       noDataTemplate = fs.readFileSync(__dirname + '/templates/nodata.html', 'utf8'),
       noDataTemplateCompiled = Template7.compile(noDataTemplate),
       items,
       postRenderCallback,
       selectorVList,
       vList;

    function  render(params) {

        var params = params || {};

        items = params.items || [];
        postRenderCallback = params.postRenderCallback || {};
        selectorVList = $$(f7.getCurrentView().activePage.container).find('.virtual-list');


                    if (items.length > 0) {

                                var paramsVList = {
                                            items: items,
                                            cache : true,
                                            height: 96,        // it's height of <li> with it's margin-bottom! now it's 90px+6px !!!
                                            template: favouritesTemplate,
                                            item_multiplier: 1,
                                            //add_height: 50,  // if needed, can add to vList height
                                            callback: postRenderCallback
                                };

                                vList = f7.virtualList(selectorVList, paramsVList);

                
                }
                else {   // "no offfers available" message

                     renderNoData();

                } 
    }

    function update(params) {

        items = params.items || [];
        vList.items = items;
        vList.update();
        
        if (vList.items.length == 0) renderNoData();
    }

    function renderNoData () {
        
        selectorVList.html(noDataTemplateCompiled());
        postRenderCallback();

        
    }


    function deleteItem(id) {
        
        vList.items.forEach(function(element, index ,ar) {
            if (element.id == id) found_index = index;

        });
        
        vList.deleteItem(found_index);

        if (vList.items.length == 0) renderNoData();
        
    }


    module.exports = {

        render : render,
        update : update,
        deleteItem : deleteItem
    }

