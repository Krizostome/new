$(function(){

    //mdboostraap
     new WOW().init();

    $('#buttonSearch').click(function(e){
        $('#searchfield').toggle();
    });



      $(window).resize(function(){
        if ($(window).width() >= 980){

          // when you hover a toggle show its dropdown menu
          $(".navbar .dropdown-toggle").hover(function () {
             $(this).parent().toggleClass("show");
             $(this).parent().find(".dropdown-menu").toggleClass("show");
           });

            // hide the menu when the mouse leaves the dropdown
          $( ".navbar .dropdown-menu" ).mouseleave(function() {
            $(this).removeClass("show");
          });
            // do something here
        }
    });

    // Sticky navbar
// =========================
    // Custom function which toggles between sticky class (is-sticky)
    var stickyToggle = function (sticky, stickyWrapper, scrollElement) {
        var stickyHeight = sticky.outerHeight();
        var stickyTop = stickyWrapper.offset().top;
        if (scrollElement.scrollTop() >= stickyTop) {
            stickyWrapper.height(stickyHeight);
            sticky.addClass("is-sticky");
            $('.navbar').removeClass('mx-md-n3');
            $('.navbar').removeClass('mx-n3');
            $('.navbar').addClass('container');
        }
        else {
            sticky.removeClass("is-sticky");
            stickyWrapper.height('auto');
            $('.navbar').addClass('mx-md-n3');
            $('.navbar').addClass('mx-n3');
            $('.navbar').removeClass('container');
        }
    };

    // Find all data-toggle="sticky-onscroll" elements
    $('[data-toggle="sticky-onscroll"]').each(function () {
        var sticky = $(this);
        var stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
        sticky.before(stickyWrapper);
        sticky.addClass('sticky');

        // Scroll & resize events
        $(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function () {
            stickyToggle(sticky, stickyWrapper, $(this));
        });

        // On page load
        stickyToggle(sticky, stickyWrapper, $(window));
    });


    //Bouton scroll top sur la page
// =========================
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    $('#back-to-top').click(function() {      // When arrow is clicked
        $('body,html').animate({
            scrollTop : 0                       // Scroll to top of body
        }, 1000);
    });
});
