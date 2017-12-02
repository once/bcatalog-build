    
    var SectionModel = require('modules/navigation/sections'),
        verticalSelector = require('modules/navigation/verticalSelectorController'),
        horizontalSelector = require('modules/navigation/horizontalSelectorController'),
        navigationView = require('modules/navigation/navigationView');

    function Navigation(section, refreshData) {

        this.section = section;
        this.refreshData = refreshData;
        this.init();

    }

    Navigation.prototype.init = function () {

               switch (SectionModel[this.section].headerType) {

                        case "title":
                            
                            navigationView.renderHeaderTitle(SectionModel[this.section].title);
                            break;

                        case "vertical-selector":
                            
                            var vs = new verticalSelector(this.section, this.refreshData);
                            break;

                        case "combined-selector":
                            
                            var vs = new verticalSelector(this.section, this.refreshData);
                            var hs = new horizontalSelector(this.section, this.refreshData);
                            break;
                      
                        default:
                            navigationView.renderHeaderTitle(SectionModel[this.section].title);
                            break;

                }

          
                    
    
    }

    module.exports = Navigation;

