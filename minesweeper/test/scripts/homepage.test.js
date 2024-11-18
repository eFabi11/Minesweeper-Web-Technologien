/**
 * @jest-environment jsdom
 */
import $ from 'jquery';
const sinon = require('sinon');
import "./../../public/javascripts/homepage.js";

describe('JavaScript Functional Tests', function () {
    let sandbox;

    beforeEach(function () {
        // Set up the DOM for tests
        document.body.innerHTML = `
          <div id="header-scroll" class=""></div>
          <div id="navbar" style="display: none;"></div>  <!-- Start hidden -->
          <section id="section1"></section>
          <nav>
            <a href="#section1"></a>
          </nav>
          <button id="start-game-btn">Start Game</button>
        `;
        require('./../../public/javascripts/homepage.js');
    });


    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });

    afterEach(function () {
        sandbox.restore();
        if ($.ajax.restore) $.ajax.restore();
    });


    // Test the window load event
    it('should remove "small" class from header on window load', function () {
        $(window).trigger('load');
        const header = $('#header-scroll');
        expect(header.hasClass('small')).toBe(false);
    });

    describe('Debug Tests', function() {
        it('should call the scroll handler when scrolled 1', function () {
            const scrollSpy = sinon.spy();
            $(window).on('scroll', scrollSpy);

            document.documentElement.scrollTop = 2;
            $(window).trigger('scroll');

            expect(scrollSpy.called).toBe(true);
        });

        it('should call the scroll handler when scrolled 2', function () {
            const handler = jest.fn();
            $(window).on('scroll', handler);

            document.documentElement.scrollTop = 2;
            $(window).trigger('scroll');

            expect(handler).toHaveBeenCalled();
        });

        it('should add "small" class to the header when scrolled', function () {
            const addClassSpy = jest.spyOn($.fn, 'addClass');

            document.documentElement.scrollTop = 10;
            $(window).trigger('scroll');

            expect(addClassSpy).toHaveBeenCalledWith('small');

            addClassSpy.mockRestore();
        });
    });

    // Test scroll events for header and navbar visibility
    describe('Scroll Behavior', function () {
        it('should add "small" class and display navbar when scrolled', function (done) {
            $(window).trigger('load');

            const header = $('#header-scroll');
            const navbar = $('#navbar');

            document.documentElement.scrollTop = 10;
            document.body.offsetHeight;
            $(window).trigger('scroll');

            expect(header.hasClass('small')).toBe(true);
            expect(navbar.css('display')).toBe('block');
            expect(navbar.hasClass('visible')).toBe(true);
            done();
        });

        it('should remove "small" class and hide navbar when scrolled to top', function (done) {
            const header = $('#header-scroll');
            const navbar = $('#navbar');

            document.documentElement.scrollTop = 0;
            $(window).trigger('scroll');

            expect(header.hasClass('small')).toBe(false);
            expect(navbar.css('display')).toBe('block');
            expect(navbar.hasClass('visible')).toBe(false);
            done();
        });

        it('should add "active" class to the correct section and nav link', function (done) {
            const section = $('#section1');
            const navLink = $('nav a');

            document.documentElement.scrollTop = 2;
            $(window).trigger('scroll');

            expect(section.hasClass('active')).toBe(true);
            expect(navLink.hasClass('active')).toBe(true);
            done();
        });
    });

    // Test smooth scrolling
    describe('Smooth Scrolling', function () {
        it('should prevent default action and scroll to the target section', function (done) {
            const navLink = $('nav a');
            const targetSection = $('#section1');

            const event = $.Event('click');
            navLink.trigger(event);

            expect(event.isDefaultPrevented()).toBe(true);
            expect($(window).scrollTop()).isCloseTo(
                targetSection.offset().top - $('#navbar').outerHeight() - 25, 5);
            done();

        });
    });

    // Test AJAX functionality
    describe('AJAX Tests', function () {
        it('should handle successful AJAX response', function (done) {
            const successResponse = {
                success: true,
                head: '<title>Game</title>',
                body: '<div>Game Loaded</div>',
            };

            sandbox.stub($, 'ajax').callsFake(function (options) {
                options.success(successResponse);
            });

            $('#start-game-btn').trigger('click');

            expect($('head').html()).toBe(successResponse.head);
            expect($('body').html()).toBe(successResponse.body);
            done();

        });

        it('should alert failure on unsuccessful AJAX response', function (done) {
            sandbox.stub(window, 'alert');
            sandbox.stub($, 'ajax').callsFake(function (options) {
                options.success({ success: false });
            });

            $('#start-game-btn').trigger('click');

            expect(window.alert.calledWith('Failed to load the game content'));
            done();

        });

        it('should handle AJAX error scenario gracefully', function (done) {
            sandbox.stub(window, 'alert');
            sandbox.stub($, 'ajax').callsFake(function (options) {
                options.error({ status: 500 }, 'error', 'Internal Server Error');
            });

            $('#start-game-btn').trigger('click');

            expect(window.alert.calledWith('Something went wrong! Please try again.'));
            done();

        });
    });
});