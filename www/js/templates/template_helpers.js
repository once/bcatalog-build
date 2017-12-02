

            Template7.registerHelper('rusdate', function (date, options) {
  
            
                return (new Date(date)).toLocaleString("ru",{ year: "numeric",  month: "long",  day: "numeric"});
  
            });



            Template7.registerHelper('rusdate_noyear', function (date, options){
            
                        
                        return (new Date(date)).toLocaleString("ru",{ month: "long",  day: "numeric"});
            
            });


