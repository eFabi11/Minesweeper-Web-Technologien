$(window).on('load', function () {
    $("#header-scroll").removeClass("small");
});

$(window).scroll(function () {
    var sc = $(window).scrollTop();
    var navbar = $("#navbar");

    // Header und Navbar Sichtbarkeit steuern
    if (sc > 1) {
        $("#header-scroll").addClass("small");
        navbar.css('display', 'block');
        navbar.addClass('visible');
    } else {
        $("#header-scroll").removeClass("small");
        navbar.removeClass('visible');
        navbar.css('display', 'none');
    }

    // Aktiven Abschnitt bestimmen und hervorheben
    var sections = $('section'),
        nav = $('nav'),
        nav_height = nav.outerHeight() + 120,
        cur_pos = $(this).scrollTop();

    sections.each(function() {
        var top = $(this).offset().top - nav_height - 200,
            bottom = top + $(this).outerHeight();

        if (cur_pos >= top && cur_pos < bottom) {
            var id = $(this).attr('id');
            sections.removeClass('active');
            nav.find('a').removeClass('active');

            $(this).addClass('active');
            nav.find('a[href="#' + id + '"]').addClass('active');
        }
    });
});

// Smooth Scrolling für Navigation Links
$('nav a').on('click', function (event) {
    event.preventDefault();
    var target = $(this).attr('href');
    $('html, body').animate({
        scrollTop: $(target).offset().top - $('#navbar').outerHeight() - 25
    }, 500);
});
