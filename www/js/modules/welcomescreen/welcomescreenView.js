
var utility = require('utils/utility');



function render (slides, options, bindings) {

  var ws = f7.welcomescreen(slides, options);
  utility.bindEvents(f7.getCurrentView().activePage, bindings);
  
  return ws;
}




module.exports = {

    render : render
    
}