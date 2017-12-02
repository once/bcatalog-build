
  var f7 = require('f7');

 
  function init() {
                
         f7.initImagesLazyLoad(f7.getCurrentView().activePage.container);
    
 }

    function trigger() {
            $$('img.lazy').trigger('lazy');  
    }
    


    module.exports = {

        init: init
    };