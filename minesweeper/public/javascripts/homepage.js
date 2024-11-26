$(document).ready(function() {
    // Trigger actions on window load
    $(window).on('load', function() {
        $("#header-scroll").removeClass("small");
    });

    // Handle scroll events for header and navbar visibility, and section highlighting
    $(window).on('scroll', function() {
        var scrollPosition = $(window).scrollTop();
        var navbar = $("#navbar");

        // Control Header and Navbar visibility
        if (scrollPosition > 1) {
            $("#header-scroll").addClass("small");
            navbar.css('display', 'block').addClass('visible');
        } else {
            $("#header-scroll").removeClass("small");
            navbar.removeClass('visible').css('display', 'none');
        }

        // Determine the active section and highlight it
        var sections = $('section'),
            nav = $('nav'),
            navHeight = nav.outerHeight() + 100,
            currentPos = scrollPosition;

        sections.each(function() {
            var sectionTop = $(this).offset().top - navHeight - 160,
                sectionBottom = sectionTop + $(this).outerHeight();

            if (currentPos >= sectionTop && currentPos < sectionBottom) {
                var sectionId = $(this).attr('id');
                sections.removeClass('active');
                nav.find('a').removeClass('active');

                $(this).addClass('active');
                nav.find('a[href="#' + sectionId + '"]').addClass('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    $('nav a').on('click', function(event) {
        event.preventDefault();
        var targetSection = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(targetSection).offset().top - $('#navbar').outerHeight() - 25
        }, 500);
    });
});

$(document).ready(function() {
    $('#start-game-btn').click(function() {
        event.preventDefault();
        $.ajax({
            url: 'http://localhost:9000/game',
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('head').html(response.head);
                    $('body').html(response.body);
                } else {
                    alert('Failed to load the game content');
                }
            },
            error: function(xhr, status, error) {
                console.log('Error:', error);
                alert('Something went wrong! Please try again.');
            }
        });
    });
});
