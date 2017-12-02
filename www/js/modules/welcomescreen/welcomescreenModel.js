
var constants = require('config/constants');

function getSlides() {

var slides = [
      

      // -- version N.NN  ------------------------------------------------
      // Your welcomescreen slides go here, as in example :
 /* {
        id: 'slide0',
        picture: '<img src="img/welcome/v313_update1_1.png"/>',
        text: '<div class="welcomescreen-heading">Feature 1 ..... </div><div class="welcomescreen-content">Feature description .....</div>'
      },
      {
        id: 'slide1',
        picture: '<img src="img/welcome/v313_update1_2.png"/>',
        text: '<div class="welcomescreen-content">Feature description ....</div>'
      },
*/

      
    ];
    // --------------------------------------------------------------------

    // first intoductory slide  (unshift - to put it in the beginning)
    slides.unshift({
        id: 'slide-start',
        picture: '<div class="welcomescreen-icon"><i class="f7-icons color-blue size-big-welcomescreen">info</i></div>',
        text: '<div class="welcomescreen-heading">New features in application!</div><div class="welcomescreen-content">Show details <i class="f7-icons">arrow_right</i></div>'
      });

    // last slide (put it in the end)
    slides.push({
        id: 'slide-end',
        picture: '<div class="welcomescreen-icon"><i class="f7-icons color-green size-big-welcomescreen">check_round</i></div>',
        text: '<div class="welcomescreen-heading">Thank you</div><div class="welcomescreen-content">We hope you will like new features!</div><a class="button button-big button-fill tutorial-close-btn" href="#">Close</a>'
      });


    return slides;

}

module.exports = {


    getSlides : getSlides
}