    var f7 = require('f7');

    function initSearchBar() {
        
        var searchBarDOMlement = $$(f7.getCurrentView().activePage.container).find('.searchbar');
        var searchListBlockDOMlement = $$(f7.getCurrentView().activePage.container).find('.list-block-search');

        if (searchBarDOMlement) {

            var searchBar = f7.searchbar(searchBarDOMlement, 
                                            {  
                                                searchList: searchListBlockDOMlement, 
                                                onSearch: function() {
                                                        
                                                        
                                                        f7.initImagesLazyLoad(f7.getCurrentView().activePage.container);
                                                }
                                            });
        }
        else {

            console.log('Error initializing searchBar');
        }


    }

    module.exports =  {

        initSearchBar : initSearchBar

    }

