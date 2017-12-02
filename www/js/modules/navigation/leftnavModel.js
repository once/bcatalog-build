
var constants = require('config/constants');

module.exports = {

     nodes : [
            {page:"offers.html?section=offers",iconclass: "icon-shopping-bag", name: constants.messages.sections["offers"].title, fontsize: 17},
            {page:"offers.html?section=foods",iconclass: "icon-shopping-cart", name: constants.messages.sections["foods"].title, fontsize: 17},
            {page:"favourites.html",iconclass: "icon-star", name: constants.messages.sections["favourites"].title, fontsize: 17},
            {page:"offers.html?section=events",iconclass: "icon-calendar", name: constants.messages.sections["events"].title, fontsize: 17},
            {page:"offers.html?section=news",iconclass: "icon-newspaper-o", name: constants.messages.sections["news"].title, fontsize: 17},
            {page:"about.html?section=contacts",iconclass: "icon-envelope", name: constants.messages.sections["contacts"].title, fontsize: 17},
            {page:"settings.html?section=settings",iconclass: "icon-cog3", name: constants.messages.sections["settings"].title, fontsize: 17}

            ]
 
        
};

