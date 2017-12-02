// Data rendering templates

    var fs = require('fs'),
            
             templates = {
    
                'offers': {
                    template: fs.readFileSync(__dirname + '/templates/offers.html', 'utf8')
                },
                'foods':      {
                    template: fs.readFileSync(__dirname + '/templates/foods.html', 'utf8')
                },
                'events':      {
                    template: fs.readFileSync(__dirname + '/templates/events.html', 'utf8')
                },
                'news':      {
                    template: fs.readFileSync(__dirname + '/templates/news.html', 'utf8')
                },
                'nodata' : {
                    template: fs.readFileSync(__dirname + '/templates/nodata.html', 'utf8')
                }

    };

    module.exports = {

        templates : templates
    }




    
    