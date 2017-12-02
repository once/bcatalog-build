var f7 = require('f7'),
    constants = require('config/constants'),
    welcomescreenModel = require('modules/welcomescreen/welcomescreenModel');
    welcomescreenView = require('modules/welcomescreen/welcomescreenView');


  var bindings = [ {

                element: document,
                delegate : '.tutorial-close-btn',
                event: 'click',
                handler: onCloseButton,
                onlyOnCurrentPage : false

            }];
 

var wsInstance;  


function init() {

    // Welcome screen shown only if new CodePush update arrived

   if (window.codePush) {

         window.codePush.getCurrentPackage(function (currentPackage) {
            // getCurrentPackage returns null if no update was installed (app store version)
            if (currentPackage && currentPackage.isFirstRun) welcomeScreenShow();
            
        },
        function() {
            console.log("Welcomescreen Init: Error while retreiving CodePush CurrentPackage");
        });


    }
    else {
         console.log("Welcomescreen Init: Window.CodePush not found");
    }
   
}


function welcomeScreenShow() {

    var options = {
      'bgcolor': '#f7f7f8',
      'fontcolor': '#000',
      'closeButtonText': constants.messages.general_skip,
      'onOpened': function () {
        
        // Welcome screen open callback
      },
      'onClosed': function () 
      {
        // Welcome screen closed callback
      }
    };
    
    
  
    wsInstance = welcomescreenView.render(welcomescreenModel.getSlides(), options, bindings);

}


function onCloseButton() {

    wsInstance.close();
}


module.exports = {

    init : init
}