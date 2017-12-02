
    var fs = require('fs');

    var templates = {
    
                'offers': {
                    template: fs.readFileSync(__dirname + '/templates/offer.html', 'utf8'),
                    swiper: true
                },
                'foods':      {
                    template: fs.readFileSync(__dirname + '/templates/food.html', 'utf8'),
                    swiper : false
                },
                'events':      {
                    template: fs.readFileSync(__dirname + '/templates/event.html', 'utf8'),
                    swiper : true
                },
                'news':      {
                    template: fs.readFileSync(__dirname + '/templates/news.html', 'utf8'),
                    swiper : false
                },
                'loaderror' : {
                    template: fs.readFileSync(__dirname + '/templates/error.html', 'utf8'),
                }

    };

    module.exports = {

        templates : templates
    }




    
    