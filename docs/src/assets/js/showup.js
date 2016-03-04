/*
 * Showup.js 
 * http://github.com/jonschlinkert/showup
 * Jon Schlinkert
 * 
 */
(function( $ ) {

  $.fn.showUp = function(ele) {
    var target         = $(ele),
        downClass      = 'hidden',
        upClass        = 'visible',
        previousScroll = 0;

    $(window).scroll(function() {
      // var currentScroll = $(this).scrollTop();
      if($(this).scrollTop() > 100){
        if ($(this).scrollTop() > previousScroll) {
          // Action on scroll down
          $(target).addClass(downClass);
        } else {
          // Action on scroll up
          $(target).removeClass(downClass);
          $(target).addClass(upClass);
        }
      }
      previousScroll = $(this).scrollTop();

      // TODO: if "back to top" btn clicked, show navbar

    });
  };

})( jQuery );

