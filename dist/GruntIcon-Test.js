/*--------------------------------------------------------------------
 * jQuery pixel/em conversion plugins: toEm() and toPx()
 * by Scott Jehl (scott@filamentgroup.com), http://www.filamentgroup.com
 * Copyright (c) Filament Group
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) or GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 * Article: http://www.filamentgroup.com/lab/update_jquery_plugin_for_retaining_scalable_interfaces_with_pixel_to_em_con/
 * Options:
 	scope: string or jQuery selector for font-size scoping
 * Usage Example: $(myPixelValue).toEm(); or $(myEmValue).toPx();
--------------------------------------------------------------------*/

/*
$.fn.toEm = function(settings){
	settings = jQuery.extend({
		scope: 'body'
	}, settings);
	var that = parseInt(this[0],10),
		scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
		scopeVal = scopeTest.height();
	scopeTest.remove();
	return (that / scopeVal).toFixed(8) + 'em';
};


$.fn.toPx = function(settings){
	settings = jQuery.extend({
		scope: 'body'
	}, settings);
	var that = parseFloat(this[0]),
		scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
		scopeVal = scopeTest.height();
	scopeTest.remove();
	return Math.round(that * scopeVal) + 'px';
};
*/

/*--------------------------------------------------------------------
 * JQuery Plugin: "EqualHeights" & "EqualWidths"
 * by:	Scott Jehl, Todd Parker, Maggie Costello Wachs (http://www.filamentgroup.com)
 *
 * Copyright (c) 2007 Filament Group
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Description: Compares the heights or widths of the top-level children of a provided element
		and sets their min-height to the tallest height (or width to widest width). Sets in em units
		by default if pxToEm() method is available.
 * Dependencies: jQuery library, pxToEm method	(article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/)
 * Usage Example: $(element).equalHeights();
						Optional: to set min-height in px, pass a true argument: $(element).equalHeights(true);
 * Version: 2.0, 07.24.2008
 * Changelog:
 *  08.02.2007 initial Version 1.0
 *  07.24.2008 v 2.0 - added support for widths
--------------------------------------------------------------------*/


$.fn.equalHeights = function(px) {
	$(this).each(function(){
		var currentTallest = 0;
		$(this).children().each(function(i){
			if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
		});
    if (!px && Number.prototype.pxToEm) currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
		// for ie6, set height since min-height isn't supported
		if ($.browser.msie && $.browser.version == 6.0) { $(this).children().css({'height': currentTallest}); }
		$(this).children().css({'height': currentTallest});
	});
	return this;
};;/*
 * jQuery Orbit Plugin 1.4.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function ($) {
  'use strict';

  $.fn.findFirstImage = function () {
    return this.first()
            .find('img')
            .andSelf().filter('img')
            .first();
  };

  var ORBIT = {

    defaults: {
      animation: 'horizontal-push',     // fade, horizontal-slide, vertical-slide, horizontal-push, vertical-push
      animationSpeed: 600,              // how fast animations are
      timer: true,                      // display timer?
      advanceSpeed: 10000,               // if timer is enabled, time between transitions
      pauseOnHover: true,              // if you hover pauses the slider
      startClockOnMouseOut: false,      // if clock should start on MouseOut
      startClockOnMouseOutAfter: 1000,  // how long after MouseOut should the timer start again
      directionalNav: true,             // manual advancing directional navs
      directionalNavRightText: 'Right', // text of right directional element for accessibility
      directionalNavLeftText: 'Left',   // text of left directional element for accessibility
      captions: true,                   // do you want captions?
      captionAnimation: 'fade',         // fade, slideOpen, none
      captionAnimationSpeed: 600,       // if so how quickly should they animate in
      resetTimerOnClick: false,         // true resets the timer instead of pausing slideshow progress on manual navigation
      bullets: false,                   // true or false to activate the bullet navigation
      bulletThumbs: false,              // thumbnails for the bullets
      bulletThumbLocation: '',          // relative path to thumbnails from this file
      bulletThumbsHideOnSmall: true,	// hide thumbs on small devices
      afterSlideChange: $.noop,         // callback to execute after slide changes
      afterLoadComplete: $.noop,        // callback to execute after everything has been loaded
      fluid: false,
      centerBullets: true,              // center bullet nav with js, turn this off if you want to position the bullet nav manually
      singleCycle: false,               // cycles through orbit slides only once
      slideNumber: false,               // display slide numbers?
      stackOnSmall: false               // stack slides on small devices (i.e. phones)
    },

    activeSlide: 0,
    numberSlides: 0,
    orbitWidth: null,
    orbitHeight: null,
    locked: null,
    timerRunning: null,
    degrees: 0,
    wrapperHTML: '<div class="orbit-wrapper" />',
    timerHTML: '<div class="timer"><span class="mask"><span class="rotator"></span></span><span class="pause"></span></div>',
    captionHTML: '<div class="orbit-caption"></div>',
    directionalNavHTML: '<div class="slider-nav hide-for-small"><span class="right"></span><span class="left"></span></div>',
    bulletHTML: '<ul class="orbit-bullets"></ul>',
    slideNumberHTML: '<span class="orbit-slide-counter"></span>',

    init: function (element, options) {
      var $imageSlides,
          imagesLoadedCount = 0,
          self = this;

      // Bind functions to correct context
      this.clickTimer = $.proxy(this.clickTimer, this);
      this.addBullet = $.proxy(this.addBullet, this);
      this.resetAndUnlock = $.proxy(this.resetAndUnlock, this);
      this.stopClock = $.proxy(this.stopClock, this);
      this.startTimerAfterMouseLeave = $.proxy(this.startTimerAfterMouseLeave, this);
      this.clearClockMouseLeaveTimer = $.proxy(this.clearClockMouseLeaveTimer, this);
      this.rotateTimer = $.proxy(this.rotateTimer, this);

      this.options = $.extend({}, this.defaults, options);
      if (this.options.timer === 'false') this.options.timer = false;
      if (this.options.captions === 'false') this.options.captions = false;
      if (this.options.directionalNav === 'false') this.options.directionalNav = false;

      this.$element = $(element);
      this.$wrapper = this.$element.wrap(this.wrapperHTML).parent();
      this.$slides = this.$element.children('img, a, div, figure, li');

      this.$element.on('movestart', function(e) {
        // If the movestart is heading off in an upwards or downwards
        // direction, prevent it so that the browser scrolls normally.
        if ((e.distX > e.distY && e.distX < -e.distY) ||
            (e.distX < e.distY && e.distX > -e.distY)) {
          e.preventDefault();
        }
      });

      this.$element.bind('orbit.next', function () {
        self.shift('next');
      });

      this.$element.bind('orbit.prev', function () {
        self.shift('prev');
      });

      this.$element.bind('swipeleft', function () {
        $(this).trigger('orbit.next');
      });

      this.$element.bind('swiperight', function () {
        $(this).trigger('orbit.prev');
      });

      this.$element.bind('orbit.goto', function (event, index) {
        self.shift(index);
      });

      this.$element.bind('orbit.start', function (event, index) {
        self.startClock();
      });

      this.$element.bind('orbit.stop', function (event, index) {
        self.stopClock();
      });

      $imageSlides = this.$slides.filter('img');

      if ($imageSlides.length === 0) {
        this.loaded();
      } else {
        $imageSlides.bind('imageready', function () {
          imagesLoadedCount += 1;
          if (imagesLoadedCount === $imageSlides.length) {
            self.loaded();
          }
        });
      }
    },

    loaded: function () {
      this.$element
        .addClass('orbit')
        .css({width: '1px', height: '1px'});

      if (this.options.stackOnSmall) {
        this.$element.addClass('orbit-stack-on-small');
      }

      this.$slides.addClass('orbit-slide').css({"opacity" : 0});

      this.setDimentionsFromLargestSlide();
      this.updateOptionsIfOnlyOneSlide();
      this.setupFirstSlide();
      this.notifySlideChange();

      if (this.options.timer) {
        this.setupTimer();
        this.startClock();
      }

      if (this.options.captions) {
        this.setupCaptions();
      }

      if (this.options.directionalNav) {
        this.setupDirectionalNav();
      }

      if (this.options.bullets) {
        this.setupBulletNav();
        this.setActiveBullet();
      }

      this.options.afterLoadComplete.call(this);
      Holder.run();
    },

    currentSlide: function () {
      return this.$slides.eq(this.activeSlide);
    },

    notifySlideChange: function() {
      if (this.options.slideNumber) {
        var txt = (this.activeSlide+1) + ' of ' + this.$slides.length;
        this.$element.trigger("orbit.change", {slideIndex: this.activeSlide, slideCount: this.$slides.length});
        if (this.$counter === undefined) {
          var $counter = $(this.slideNumberHTML).html(txt);
          this.$counter = $counter;
          this.$wrapper.append(this.$counter);
        } else {
          this.$counter.html(txt);
        }
      }
    },

    setDimentionsFromLargestSlide: function () {
      //Collect all slides and set slider size of largest image
      var self = this,
          $fluidPlaceholder;

      self.$element.add(self.$wrapper).width(this.$slides.first().outerWidth());
      self.$element.add(self.$wrapper).height(this.$slides.first().height());
      self.orbitWidth = this.$slides.first().outerWidth();
      self.orbitHeight = this.$slides.first().height();
      $fluidPlaceholder = this.$slides.first().findFirstImage().clone();


      this.$slides.each(function () {
        var slide = $(this),
            slideWidth = slide.outerWidth(),
            slideHeight = slide.height();

        if (slideWidth > self.$element.outerWidth()) {
          self.$element.add(self.$wrapper).width(slideWidth);
          self.orbitWidth = self.$element.outerWidth();
        }
        if (slideHeight > self.$element.height()) {
          self.$element.add(self.$wrapper).height(slideHeight);
          self.orbitHeight = self.$element.height();
          $fluidPlaceholder = $(this).findFirstImage().clone();
        }
        self.numberSlides += 1;
      });

      if (this.options.fluid) {
        if (typeof this.options.fluid === "string") {
          // $fluidPlaceholder = $("<img>").attr("src", "http://placehold.it/" + this.options.fluid);
          $fluidPlaceholder = $("<img>").attr("data-src", "holder.js/" + this.options.fluid);
          //var inner = $("<div/>").css({"display":"inline-block", "width":"2px", "height":"2px"});
          //$fluidPlaceholder = $("<div/>").css({"float":"left"});
          //$fluidPlaceholder.wrapInner(inner);

          //$fluidPlaceholder = $("<div/>").css({"height":"1px", "width":"2px"});
          //$fluidPlaceholder = $("<div style='display:inline-block;width:2px;height:1px;'></div>");
        }

        self.$element.prepend($fluidPlaceholder);
        $fluidPlaceholder.addClass('fluid-placeholder');
        self.$element.add(self.$wrapper).css({width: 'inherit'});
        self.$element.add(self.$wrapper).css({height: 'inherit'});

        $(window).bind('resize', function () {
          self.orbitWidth = self.$element.outerWidth();
          self.orbitHeight = self.$element.height();
        });
      }
    },

    //Animation locking functions
    lock: function () {
      this.locked = true;
    },

    unlock: function () {
      this.locked = false;
    },

    updateOptionsIfOnlyOneSlide: function () {
      if(this.$slides.length === 1) {
        this.options.directionalNav = false;
        this.options.timer = false;
        this.options.bullets = false;
      }
    },

    setupFirstSlide: function () {
      //Set initial front photo z-index and fades it in
      var self = this;
      this.$slides.first()
        .css({"z-index" : 3, "opacity" : 1})
        .fadeIn(function() {
          //brings in all other slides IF css declares a display: none
          self.$slides.css({"display":"block"})
      });
    },

    startClock: function () {
      var self = this;

      if(!this.options.timer) {
        return false;
      }

      if (this.$timer.is(':hidden')) {
        this.clock = setInterval(function () {
          self.$element.trigger('orbit.next');
        }, this.options.advanceSpeed);
      } else {
        this.timerRunning = true;
        this.$pause.removeClass('active');
        this.clock = setInterval(this.rotateTimer, this.options.advanceSpeed / 180, false);
      }
    },

    rotateTimer: function (reset) {
      var degreeCSS = "rotate(" + this.degrees + "deg)";
      this.degrees += 2;
      this.$rotator.css({
        "-webkit-transform": degreeCSS,
        "-moz-transform": degreeCSS,
        "-o-transform": degreeCSS,
        "-ms-transform": degreeCSS
      });
      if (reset) {
        this.degrees = 0;
        this.$rotator.removeClass('move');
        this.$mask.removeClass('move');
      }
      if(this.degrees > 180) {
        this.$rotator.addClass('move');
        this.$mask.addClass('move');
      }
      if(this.degrees > 360) {
        this.$rotator.removeClass('move');
        this.$mask.removeClass('move');
        this.degrees = 0;
        this.$element.trigger('orbit.next');
      }
    },

    stopClock: function () {
      if (!this.options.timer) {
        return false;
      } else {
        this.timerRunning = false;
        clearInterval(this.clock);
        this.$pause.addClass('active');
      }
    },

    setupTimer: function () {
      this.$timer = $(this.timerHTML);
      this.$wrapper.append(this.$timer);

      this.$rotator = this.$timer.find('.rotator');
      this.$mask = this.$timer.find('.mask');
      this.$pause = this.$timer.find('.pause');

      this.$timer.click(this.clickTimer);

      if (this.options.startClockOnMouseOut) {
        this.$wrapper.mouseleave(this.startTimerAfterMouseLeave);
        this.$wrapper.mouseenter(this.clearClockMouseLeaveTimer);
      }

      if (this.options.pauseOnHover) {
        this.$wrapper.mouseenter(this.stopClock);
      }
    },

    startTimerAfterMouseLeave: function () {
      var self = this;

      this.outTimer = setTimeout(function() {
        if(!self.timerRunning){
          self.startClock();
        }
      }, this.options.startClockOnMouseOutAfter)
    },

    clearClockMouseLeaveTimer: function () {
      clearTimeout(this.outTimer);
    },

    clickTimer: function () {
      if(!this.timerRunning) {
          this.startClock();
      } else {
          this.stopClock();
      }
    },

    setupCaptions: function () {
      this.$caption = $(this.captionHTML);
      this.$wrapper.append(this.$caption);
      this.setCaption();
    },

    setCaption: function () {
      var captionLocation = this.currentSlide().attr('data-caption'),
          captionHTML;

      if (!this.options.captions) {
        return false;
      }

      //Set HTML for the caption if it exists
      if (captionLocation) {
        //if caption text is blank, don't show captions
        if ($.trim($(captionLocation).text()).length < 1){
          return false;
        }

        // if location selector starts with '#', remove it so we don't see id="#selector"
        if (captionLocation.charAt(0) == '#') {
            captionLocation = captionLocation.substring(1, captionLocation.length);
        }
        captionHTML = $('#' + captionLocation).html(); //get HTML from the matching HTML entity
        this.$caption
          .attr('id', captionLocation) // Add ID caption TODO why is the id being set?
          .html(captionHTML); // Change HTML in Caption
          //Animations for Caption entrances
        switch (this.options.captionAnimation) {
          case 'none':
            this.$caption.show();
            break;
          case 'fade':
            this.$caption.fadeIn(this.options.captionAnimationSpeed);
            break;
          case 'slideOpen':
            this.$caption.slideDown(this.options.captionAnimationSpeed);
            break;
        }
      } else {
        //Animations for Caption exits
        switch (this.options.captionAnimation) {
          case 'none':
            this.$caption.hide();
            break;
          case 'fade':
            this.$caption.fadeOut(this.options.captionAnimationSpeed);
            break;
          case 'slideOpen':
            this.$caption.slideUp(this.options.captionAnimationSpeed);
            break;
        }
      }
    },

    setupDirectionalNav: function () {
      var self = this,
          $directionalNav = $(this.directionalNavHTML);

      $directionalNav.find('.right').html(this.options.directionalNavRightText);
      $directionalNav.find('.left').html(this.options.directionalNavLeftText);

      this.$wrapper.append($directionalNav);

      this.$wrapper.find('.left').click(function () {
        self.stopClock();
        if (self.options.resetTimerOnClick) {
          self.rotateTimer(true);
          self.startClock();
        }
        self.$element.trigger('orbit.prev');
      });

      this.$wrapper.find('.right').click(function () {
        self.stopClock();
        if (self.options.resetTimerOnClick) {
          self.rotateTimer(true);
          self.startClock();
        }
        self.$element.trigger('orbit.next');
      });
    },

    setupBulletNav: function () {
      this.$bullets = $(this.bulletHTML);
      this.$wrapper.append(this.$bullets);
      this.$slides.each(this.addBullet);
      this.$element.addClass('with-bullets');
      if (this.options.centerBullets) this.$bullets.css('margin-left', -this.$bullets.outerWidth() / 2);
      if (this.options.bulletThumbsHideOnSmall) this.$bullets.addClass('hide-for-small');
    },

    addBullet: function (index, slide) {
      var position = index + 1,
          $li = $('<li>' + (position) + '</li>'),
          thumbName,
          self = this;

      if (this.options.bulletThumbs) {
        thumbName = $(slide).attr('data-thumb');
        if (thumbName) {
          $li
            .addClass('has-thumb')
            .css({background: "url(" + this.options.bulletThumbLocation + thumbName + ") no-repeat"});;
        }
      }
      this.$bullets.append($li);
      $li.data('index', index);
      $li.click(function () {
        self.stopClock();
        if (self.options.resetTimerOnClick) {
          self.rotateTimer(true);
          self.startClock();
        }
        self.$element.trigger('orbit.goto', [$li.data('index')])
      });
    },

    setActiveBullet: function () {
      if(!this.options.bullets) { return false; } else {
        this.$bullets.find('li')
          .removeClass('active')
          .eq(this.activeSlide)
          .addClass('active');
      }
    },

    resetAndUnlock: function () {
      this.$slides
        .eq(this.prevActiveSlide)
        .css({"z-index" : 1});
      this.unlock();
      this.options.afterSlideChange.call(this, this.$slides.eq(this.prevActiveSlide), this.$slides.eq(this.activeSlide));
    },

    shift: function (direction) {
      var slideDirection = direction;

      //remember previous activeSlide
      this.prevActiveSlide = this.activeSlide;

      //exit function if bullet clicked is same as the current image
      if (this.prevActiveSlide == slideDirection) { return false; }

      if (this.$slides.length == "1") { return false; }
      if (!this.locked) {
        this.lock();
        //deduce the proper activeImage
        if (direction == "next") {
          this.activeSlide++;
          if (this.activeSlide == this.numberSlides) {
              this.activeSlide = 0;
          }
        } else if (direction == "prev") {
          this.activeSlide--
          if (this.activeSlide < 0) {
            this.activeSlide = this.numberSlides - 1;
          }
        } else {
          this.activeSlide = direction;
          if (this.prevActiveSlide < this.activeSlide) {
            slideDirection = "next";
          } else if (this.prevActiveSlide > this.activeSlide) {
            slideDirection = "prev"
          }
        }

        //set to correct bullet
        this.setActiveBullet();
        this.notifySlideChange();

        //set previous slide z-index to one below what new activeSlide will be
        this.$slides
          .eq(this.prevActiveSlide)
          .css({"z-index" : 2});

        //fade
        if (this.options.animation == "fade") {
          this.$slides
            .eq(this.activeSlide)
            .css({"opacity" : 0, "z-index" : 3})
            .animate({"opacity" : 1}, this.options.animationSpeed, this.resetAndUnlock);
          this.$slides
              .eq(this.prevActiveSlide)
              .animate({"opacity":0}, this.options.animationSpeed);
        }

        //horizontal-slide
        if (this.options.animation == "horizontal-slide") {
          if (slideDirection == "next") {
            this.$slides
              .eq(this.activeSlide)
              .css({"left": this.orbitWidth, "z-index" : 3})
              .css("opacity", 1)
              .animate({"left" : 0}, this.options.animationSpeed, this.resetAndUnlock);
          }
          if (slideDirection == "prev") {
            this.$slides
              .eq(this.activeSlide)
              .css({"left": -this.orbitWidth, "z-index" : 3})
              .css("opacity", 1)
              .animate({"left" : 0}, this.options.animationSpeed, this.resetAndUnlock);
          }
          this.$slides
              .eq(this.prevActiveSlide)
              .css("opacity", 0);
        }

        //vertical-slide
        if (this.options.animation == "vertical-slide") {
          if (slideDirection == "prev") {
            this.$slides
              .eq(this.activeSlide)
              .css({"top": this.orbitHeight, "z-index" : 3})
              .css("opacity", 1)
              .animate({"top" : 0}, this.options.animationSpeed, this.resetAndUnlock);
            this.$slides
              .eq(this.prevActiveSlide)
              .css("opacity", 0);
          }
          if (slideDirection == "next") {
            this.$slides
              .eq(this.activeSlide)
              .css({"top": -this.orbitHeight, "z-index" : 3})
              .css("opacity", 1)
              .animate({"top" : 0}, this.options.animationSpeed, this.resetAndUnlock);
          }
          this.$slides
              .eq(this.prevActiveSlide)
              .css("opacity", 0);
        }

        //horizontal-push
        if (this.options.animation == "horizontal-push") {
          if (slideDirection == "next") {
            this.$slides
              .eq(this.activeSlide)
              .css({"left": this.orbitWidth, "z-index" : 3})
              .animate({"left" : 0, "opacity" : 1}, this.options.animationSpeed, this.resetAndUnlock);
            this.$slides
              .eq(this.prevActiveSlide)
              .animate({"left" : -this.orbitWidth}, this.options.animationSpeed, "", function(){
                $(this).css({"opacity" : 0});
              });
          }
          if (slideDirection == "prev") {
            this.$slides
              .eq(this.activeSlide)
              .css({"left": -this.orbitWidth, "z-index" : 3})
              .animate({"left" : 0, "opacity" : 1}, this.options.animationSpeed, this.resetAndUnlock);
            this.$slides
              .eq(this.prevActiveSlide)
              .animate({"left" : this.orbitWidth}, this.options.animationSpeed, "", function(){
                $(this).css({"opacity" : 0});
              });
          }
        }

        //vertical-push
        if (this.options.animation == "vertical-push") {
          if (slideDirection == "next") {
            this.$slides
              .eq(this.activeSlide)
              .css({top: -this.orbitHeight, "z-index" : 3})
              .css("opacity", 1)
              .animate({top : 0, "opacity":1}, this.options.animationSpeed, this.resetAndUnlock);
            this.$slides
              .eq(this.prevActiveSlide)
              .css("opacity", 0)
              .animate({top : this.orbitHeight}, this.options.animationSpeed, "");
          }
          if (slideDirection == "prev") {
            this.$slides
              .eq(this.activeSlide)
              .css({top: this.orbitHeight, "z-index" : 3})
              .css("opacity", 1)
              .animate({top : 0}, this.options.animationSpeed, this.resetAndUnlock);
            this.$slides
              .eq(this.prevActiveSlide)
              .css("opacity", 0)
              .animate({top : -this.orbitHeight}, this.options.animationSpeed);
          }
        }

        this.setCaption();
      }

      // if on last slide and singleCycle is true, don't loop through slides again
      // .length is zero based so must minus 1 to match activeSlide index
      if (this.activeSlide === this.$slides.length-1 && this.options.singleCycle) {
        this.stopClock();
      }
    }
  };

  $.fn.orbit = function (options) {
    return this.each(function () {
      var orbit = $.extend({}, ORBIT);
      orbit.init(this, options);
    });
  };

})(jQuery);

/*!
 * jQuery imageready Plugin
 * http://www.zurb.com/playground/
 *
 * Copyright 2011, ZURB
 * Released under the MIT License
 */
(function ($) {

  var options = {};

  $.event.special.imageready = {

    setup: function (data, namespaces, eventHandle) {
      options = data || options;
    },

    add: function (handleObj) {
      var $this = $(this),
          src;

      if ( this.nodeType === 1 && this.tagName.toLowerCase() === 'img' && this.src !== '' ) {
        if (options.forceLoad) {
          src = $this.attr('src');
          $this.attr('src', '');
          bindToLoad(this, handleObj.handler);
          $this.attr('src', src);
        } else if ( this.complete || this.readyState === 4 ) {
          handleObj.handler.apply(this, arguments);
        } else {
          bindToLoad(this, handleObj.handler);
        }
      }
    },

    teardown: function (namespaces) {
      $(this).unbind('.imageready');
    }
  };

  function bindToLoad(element, callback) {
    var $this = $(element);

    $this.bind('load.imageready', function () {
       callback.apply(element, arguments);
       $this.unbind('load.imageready');
     });
  }

}(jQuery));

/*

Holder - 1.3 - client side image placeholders
(c) 2012 Ivan Malopinsky / http://imsky.co

Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
Commercial use requires attribution.

*/

var Holder = Holder || {};
(function (app, win) {

var preempted = false,
fallback = false,
canvas = document.createElement('canvas');

//http://javascript.nwbox.com/ContentLoaded by Diego Perini with modifications
function contentLoaded(n,t){var l="complete",s="readystatechange",u=!1,h=u,c=!0,i=n.document,a=i.documentElement,e=i.addEventListener?"addEventListener":"attachEvent",v=i.addEventListener?"removeEventListener":"detachEvent",f=i.addEventListener?"":"on",r=function(e){(e.type!=s||i.readyState==l)&&((e.type=="load"?n:i)[v](f+e.type,r,u),!h&&(h=!0)&&t.call(n,null))},o=function(){try{a.doScroll("left")}catch(n){setTimeout(o,50);return}r("poll")};if(i.readyState==l)t.call(n,"lazy");else{if(i.createEventObject&&a.doScroll){try{c=!n.frameElement}catch(y){}c&&o()}i[e](f+"DOMContentLoaded",r,u),i[e](f+s,r,u),n[e](f+"load",r,u)}};

//https://gist.github.com/991057 by Jed Schmidt with modifications
function selector(a){
	a=a.match(/^(\W)?(.*)/);var b=document["getElement"+(a[1]?a[1]=="#"?"ById":"sByClassName":"sByTagName")](a[2]);
	var ret=[];	b!=null&&(b.length?ret=b:b.length==0?ret=b:ret=[b]);	return ret;
}

//shallow object property extend
function extend(a,b){var c={};for(var d in a)c[d]=a[d];for(var e in b)c[e]=b[e];return c}

function draw(ctx, dimensions, template) {
	var dimension_arr = [dimensions.height, dimensions.width].sort();
	var maxFactor = Math.round(dimension_arr[1] / 16),
		minFactor = Math.round(dimension_arr[0] / 16);
	var text_height = Math.max(template.size, maxFactor);
	canvas.width = dimensions.width;
	canvas.height = dimensions.height;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = template.background;
	ctx.fillRect(0, 0, dimensions.width, dimensions.height);
	ctx.fillStyle = template.foreground;
	ctx.font = "bold " + text_height + "px sans-serif";
	var text = template.text ? template.text : (dimensions.width + "x" + dimensions.height);
	if (Math.round(ctx.measureText(text).width) / dimensions.width > 1) {
		text_height = Math.max(minFactor, template.size);
	}
	ctx.font = "bold " + text_height + "px sans-serif";
	ctx.fillText(text, (dimensions.width / 2), (dimensions.height / 2), dimensions.width);
	return canvas.toDataURL("image/png");
}

if (!canvas.getContext) {
	fallback = true;
} else {
	if (canvas.toDataURL("image/png").indexOf("data:image/png") < 0) {
		//Android doesn't support data URI
		fallback = true;
	} else {
		var ctx = canvas.getContext("2d");
	}
}

var settings = {
	domain: "holder.js",
	images: "img",
	themes: {
		"gray": {
			background: "#eee",
			foreground: "#aaa",
			size: 12
		},
		"social": {
			background: "#3a5a97",
			foreground: "#fff",
			size: 12
		},
		"industrial": {
			background: "#434A52",
			foreground: "#C2F200",
			size: 12
		}
	}
};



app.flags = {
	dimensions: {
		regex: /([0-9]+)x([0-9]+)/,
		output: function(val){
			var exec = this.regex.exec(val);
			return {
				width: +exec[1],
				height: +exec[2]
			}
		}
	},
	colors: {
		regex: /#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,
		output: function(val){
			var exec = this.regex.exec(val);
			return {
					size: settings.themes.gray.size,
					foreground: "#" + exec[2],
					background: "#" + exec[1]
					}
		}
	},
	text: {
		regex: /text\:(.*)/,
		output: function(val){
			return this.regex.exec(val)[1];
		}
	}
}

for(var flag in app.flags){
	app.flags[flag].match = function (val){
		return val.match(this.regex)
	}
}

app.add_theme = function (name, theme) {
	name != null && theme != null && (settings.themes[name] = theme);
	return app;
};

app.add_image = function (src, el) {
	var node = selector(el);
	if (node.length) {
		for (var i = 0, l = node.length; i < l; i++) {
			var img = document.createElement("img")
			img.setAttribute("data-src", src);
			node[i].appendChild(img);
		}
	}
	return app;
};

app.run = function (o) {
	var options = extend(settings, o),
		images = selector(options.images),
		preempted = true;

	for (var l = images.length, i = 0; i < l; i++) {
		var theme = settings.themes.gray;
		var src = images[i].getAttribute("data-src") || images[i].getAttribute("src");
		if (src && !! ~src.indexOf(options.domain)) {
			var render = false,
				dimensions = null,
				text = null;
			var flags = src.substr(src.indexOf(options.domain) + options.domain.length + 1).split("/");
			for (sl = flags.length, j = 0; j < sl; j++) {
				if (app.flags.dimensions.match(flags[j])) {
					render = true;
					dimensions = app.flags.dimensions.output(flags[j]);
				} else if (app.flags.colors.match(flags[j])) {
					theme = app.flags.colors.output(flags[j]);
				} else if (options.themes[flags[j]]) {
					//If a theme is specified, it will override custom colors
					theme = options.themes[flags[j]];
				} else if (app.flags.text.match(flags[j])) {
					text = app.flags.text.output(flags[j]);
				}
			}
			if (render) {
				images[i].setAttribute("data-src", src);
				var dimensions_caption = dimensions.width + "x" + dimensions.height;
				images[i].setAttribute("alt", text ? text : theme.text ? theme.text + " [" + dimensions_caption + "]" : dimensions_caption);

				// Fallback
        // images[i].style.width = dimensions.width + "px";
        // images[i].style.height = dimensions.height + "px";
				images[i].style.backgroundColor = theme.background;

				var theme = (text ? extend(theme, {
						text: text
					}) : theme);

				if (!fallback) {
					images[i].setAttribute("src", draw(ctx, dimensions, theme));
				}
			}
		}
	}
	return app;
};
contentLoaded(win, function () {
	preempted || app.run()
})

})(Holder, window);
;/*
	Mosaic - Sliding Boxes and Captions jQuery Plugin
	Version 1.0.1
	www.buildinternet.com/project/mosaic

	By Sam Dunn / One Mighty Roar (www.onemightyroar.com)
	Released under MIT License / GPL License
*/

(function($){

    if(!$.omr){
        $.omr = new Object();
    };

    $.omr.mosaic = function(el, options){

        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("omr.mosaic", base);

        base.init = function(){
            base.options = $.extend({},$.omr.mosaic.defaultOptions, options);

            base.load_box();
        };

        // Preload Images
        base.load_box = function(){
        	// Hide until window loaded, then fade in
			if (base.options.preload){
				$(base.options.backdrop, base.el).hide();
				$(base.options.overlay, base.el).hide();

				$(window).load(function(){
					// IE transparency fade fix
					if(base.options.options.animation == 'fade' && $(base.options.overlay, base.el).css('opacity') == 0 ) $(base.options.overlay, base.el).css('filter', 'alpha(opacity=0)');

					$(base.options.overlay, base.el).fadeIn(200, function(){
						$(base.options.backdrop, base.el).fadeIn(200);
					});

					base.allow_hover();
				});
			}else{
				$(base.options.backdrop, base.el).show();
				$(base.options.overlay , base.el).show();
				base.allow_hover();
			}
        };

        // Initialize hover animations
        base.allow_hover = function(){
        	// Select animation
			switch(base.options.animation){

				// Handle fade animations
				case 'fade':
					$(base.el).hover(function () {
			        	$(base.options.overlay, base.el).stop().fadeTo(base.options.speed, base.options.opacity);
			        },function () {
			        	$(base.options.overlay, base.el).stop().fadeTo(base.options.speed, 0);
			      	});

			    	break;

			};
        };

        // Make it go!
        base.init();
    };

    $.omr.mosaic.defaultOptions = {
        animation	: 'fade',
        speed		: 150,
        opacity		: 1,
        preload		: 0,
        anchor_x	: 'left',
        anchor_y	: 'bottom',
        hover_x		: '0px',
        hover_y		: '0px',
        overlay  	: '.mosaic-overlay',	//Mosaic overlay
		backdrop 	: '.mosaic-backdrop'	//Mosaic backdrop
    };

    $.fn.mosaic = function(options){
        return this.each(function(){
            (new $.omr.mosaic(this, options));
        });
    };

})(jQuery);
;/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/


(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/

/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$('a[data-reveal-id]').live('click', function(e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		$('#'+modalLocation).reveal($(this).data());
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {


        var defaults = {
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 600, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
    	};

        //Extend dem' options
        var options = $.extend({}, defaults, options);

        return this.each(function() {

/*---------------------------
 Global Variables
----------------------------*/
        	var modal = $(this),
        		topMeasure  = parseInt(modal.css('top')),
				topOffset = modal.height() + topMeasure,
          		locked = false,
				modalBG = $('.reveal-modal-bg');

/*---------------------------
 Create Modal BG
----------------------------*/
			if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			}

/*---------------------------
 Open & Close Animations
----------------------------*/
			//Entrance Animations
			modal.bind('reveal:open', function () {
			  modalBG.unbind('click.modalEvent');
				$('.' + options.dismissmodalclass).unbind('click.modalEvent');
				if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible'});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"top": $(document).scrollTop()+topMeasure + 'px',
							"opacity" : 1
						}, options.animationspeed,unlockModal());
					}
				}
				modal.unbind('reveal:open');
			});

			//Closing Animation
			modal.bind('reveal:close', function () {
			  if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"top":  $(document).scrollTop()-topOffset + 'px',
							"opacity" : 0
						}, options.animationspeed/2, function() {
							modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
							unlockModal();
						});
					}
				}
				modal.unbind('reveal:close');
			});

/*---------------------------
 Open and add Closing Listeners
----------------------------*/
        	//Open Modal Immediately
    	modal.trigger('reveal:open')

			//Close Modal Listeners
			var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
			  modal.trigger('reveal:close')
			});

			if(options.closeonbackgroundclick) {
				modalBG.css({"cursor":"pointer"})
				modalBG.bind('click.modalEvent', function () {
				  modal.trigger('reveal:close')
				});
			}
			$('body').keyup(function(e) {
        		if(e.which===27){ modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
			});


/*---------------------------
 Animations Locks
----------------------------*/
			function unlockModal() {
				locked = false;
			}
			function lockModal() {
				locked = true;
			}

        });//each call
    }//orbit plugin call
})(jQuery);

;/*
|--------------------------------------------------------------------------
| UItoTop jQuery Plugin 1.1
| http://www.mattvarone.com/web-design/uitotop-jquery-plugin/
|--------------------------------------------------------------------------
*/

(function($){
	$.fn.UItoTop = function(options) {

 		var defaults = {
			text: 'To Top',
			min: 200,
			inDelay:600,
			outDelay:400,
  			containerID: 'toTop',
			containerHoverID: 'toTopHover',
			scrollSpeed: 600,
			easingType: 'linear'
 		};

 		var settings = $.extend(defaults, options);
		var containerIDhash = '#' + settings.containerID;
		var containerHoverIDHash = '#'+settings.containerHoverID;

		$('body').append('<a href="#" id="'+settings.containerID+'">'+settings.text+'</a>');
		$(containerIDhash).hide().click(function(){
			$('html, body').animate({scrollTop:0}, settings.scrollSpeed, settings.easingType);
			$('#'+settings.containerHoverID, this).stop().animate({'opacity': 0 }, settings.inDelay, settings.easingType);
			return false;
		})
		.prepend('<span id="'+settings.containerHoverID+'"></span>')
		.hover(function() {
				$(containerHoverIDHash, this).stop().animate({
					'opacity': 1
				}, 600, 'linear');
			}, function() {
				$(containerHoverIDHash, this).stop().animate({
					'opacity': 0
				}, 700, 'linear');
			});

		$(window).scroll(function() {
			var sd = $(window).scrollTop();
			if(typeof document.body.style.maxHeight === "undefined") {
				$(containerIDhash).css({
					'position': 'absolute',
					'top': $(window).scrollTop() + $(window).height() - 50
				});
			}
			if ( sd > settings.min )
				$(containerIDhash).fadeIn(settings.inDelay);
			else
				$(containerIDhash).fadeOut(settings.Outdelay);
		});

};
})(jQuery);;/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-inlinesvg-svg-cssclasses-teststyles-load
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.6.2',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,



    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) {
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr;
     };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;


    Modernizr.testStyles    = injectElementWithStyles;    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
/*yepnope1.5.4|WTFPL*/
(function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};
;;/*! responsive-nav.js v1.0.14
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2013 @viljamis
 * Available under the MIT license
 */

/* jshint strict:false, forin:false, noarg:true, noempty:true, eqeqeq:true,
boss:true, bitwise:true, browser:true, devel:true, indent:2 */
/* exported responsiveNav */

var responsiveNav = (function (window, document) {

  var computed = !!window.getComputedStyle;

  // getComputedStyle polyfill
  if (!window.getComputedStyle) {
    window.getComputedStyle = function(el) {
      this.el = el;
      this.getPropertyValue = function(prop) {
        var re = /(\-([a-z]){1})/g;
        if (prop === "float") {
          prop = "styleFloat";
        }
        if (re.test(prop)) {
          prop = prop.replace(re, function () {
            return arguments[2].toUpperCase();
          });
        }
        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
      };
      return this;
    };
  }

  var nav,
    opts,
    navToggle,
    docEl = document.documentElement,
    head = document.getElementsByTagName("head")[0],
    styleElement = document.createElement("style"),
    navOpen = false,

    // fn arg can be an object or a function, thanks to handleEvent
    // read more at: http://www.thecssninja.com/javascript/handleevent
    addEvent = function (el, evt, fn, bubble) {
      if ("addEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
          el.addEventListener(evt, fn, bubble);
        } catch (e) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.addEventListener(evt, function (e) {
              // Bind fn as this and set first arg as event object
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
      } else if ("attachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if (typeof fn === "object" && fn.handleEvent) {
          el.attachEvent("on" + evt, function () {
            // Bind fn as this
            fn.handleEvent.call(fn);
          });
        } else {
          el.attachEvent("on" + evt, fn);
        }
      }
    },

    removeEvent = function (el, evt, fn, bubble) {
      if ("removeEventListener" in el) {
        try {
          el.removeEventListener(evt, fn, bubble);
        } catch (e) {
          if (typeof fn === "object" && fn.handleEvent) {
            el.removeEventListener(evt, function (e) {
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
      } else if ("detachEvent" in el) {
        if (typeof fn === "object" && fn.handleEvent) {
          el.detachEvent("on" + evt, function () {
            fn.handleEvent.call(fn);
          });
        } else {
          el.detachEvent("on" + evt, fn);
        }
      }
    },

    getFirstChild = function (e) {
      var firstChild = e.firstChild;
      // skip TextNodes
      while (firstChild !== null && firstChild.nodeType !== 1) {
        firstChild = firstChild.nextSibling;
      }
      return firstChild;
    },

    setAttributes = function (el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    },

    addClass = function (el, cls) {
      el.className += " " + cls;
      el.className = el.className.replace(/(^\s*)|(\s*$)/g,"");
    },

    removeClass = function (el, cls) {
      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g,"");
    },

    ResponsiveNav = function (el, options) {
      var i;

      // Default options
      this.options = {
        animate: true,        // Boolean: Use CSS3 transitions, true or false
        transition: 400,      // Integer: Speed of the transition, in milliseconds
        label: "Menu",        // String: Label for the navigation toggle
        insert: "after",      // String: Insert the toggle before or after the navigation
        customToggle: "",     // Selector: Specify the ID of a custom toggle
        openPos: "relative",  // String: Position of the opened nav, relative or static
        jsClass: "js",        // String: 'JS enabled' class which is added to <html> el
        init: function(){},   // Function: Init callback
        open: function(){},   // Function: Open callback
        close: function(){}   // Function: Close callback
      };

      // User defined options
      for (i in options) {
        this.options[i] = options[i];
      }

      // Adds "js" class for <html>
      addClass(docEl, this.options.jsClass);

      // Wrapper
      this.wrapperEl = el.replace("#", "");
      if (document.getElementById(this.wrapperEl)) {
        this.wrapper = document.getElementById(this.wrapperEl);
      } else {
        // If el doesn't exists, stop here.
        throw new Error("The nav element you are trying to select doesn't exist");
      }

      // Inner wrapper
      this.wrapper.inner = getFirstChild(this.wrapper);

      // For minification
      opts = this.options;
      nav = this.wrapper;

      // Init
      this._init(this);
    };

  ResponsiveNav.prototype = {
    // Public methods
    destroy: function () {
      this._removeStyles();
      removeClass(nav, "closed");
      removeClass(nav, "opened");
      nav.removeAttribute("style");
      nav.removeAttribute("aria-hidden");
      nav = null;
      _instance = null;

      removeEvent(window, "load", this, false);
      removeEvent(window, "resize", this, false);
      removeEvent(navToggle, "mousedown", this, false);
      removeEvent(navToggle, "touchstart", this, false);
      removeEvent(navToggle, "touchend", this, false);
      removeEvent(navToggle, "keyup", this, false);
      removeEvent(navToggle, "click", this, false);

      if (!opts.customToggle) {
        navToggle.parentNode.removeChild(navToggle);
      } else {
        navToggle.removeAttribute("aria-hidden");
      }
    },

    toggle: function () {
      if (!navOpen) {
        removeClass(nav, "closed");
        addClass(nav, "opened");
        nav.style.position = opts.openPos;
        setAttributes(nav, {"aria-hidden": "false"});

        navOpen = true;
        opts.open();
      } else {
        removeClass(nav, "opened");
        addClass(nav, "closed");
        setAttributes(nav, {"aria-hidden": "true"});

        if (opts.animate) {
          setTimeout(function () {
            nav.style.position = "absolute";
          }, opts.transition + 10);
        } else {
          nav.style.position = "absolute";
        }

        navOpen = false;
        opts.close();
      }
    },

    handleEvent: function (e) {
      var evt = e || window.event;

      switch (evt.type) {
      case "mousedown":
        this._onmousedown(evt);
        break;
      case "touchstart":
        this._ontouchstart(evt);
        break;
      case "touchend":
        this._ontouchend(evt);
        break;
      case "keyup":
        this._onkeyup(evt);
        break;
      case "click":
        this._onclick(evt);
        break;
      case "load":
        this._transitions(evt);
        this._resize(evt);
        break;
      case "resize":
        this._resize(evt);
        break;
      }
    },

    // Private methods
    _init: function () {
      addClass(nav, "closed");
      this._createToggle();

      addEvent(window, "load", this, false);
      addEvent(window, "resize", this, false);
      addEvent(navToggle, "mousedown", this, false);
      addEvent(navToggle, "touchstart", this, false);
      addEvent(navToggle, "touchend", this, false);
      addEvent(navToggle, "keyup", this, false);
      addEvent(navToggle, "click", this, false);
    },

    _createStyles: function () {
      if (!styleElement.parentNode) {
        head.appendChild(styleElement);
      }
    },

    _removeStyles: function () {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    },

    _createToggle: function () {
      if (!opts.customToggle) {
        var toggle = document.createElement("a");
        toggle.innerHTML = opts.label;
        setAttributes(toggle, {
          "href": "#",
          "id": "nav-toggle"
        });

        if (opts.insert === "after") {
          nav.parentNode.insertBefore(toggle, nav.nextSibling);
        } else {
          nav.parentNode.insertBefore(toggle, nav);
        }

        navToggle = document.getElementById("nav-toggle");
      } else {
        var toggleEl = opts.customToggle.replace("#", "");

        if (document.getElementById(toggleEl)) {
          navToggle = document.getElementById(toggleEl);
        } else {
          throw new Error("The custom nav toggle you are trying to select doesn't exist");
        }
      }
    },

    _preventDefault: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.returnValue = false;
      }
    },

    _onmousedown: function (e) {
      var evt = e || window.event;
      // If the user isn't right clicking:
      if (!(evt.which === 3 || evt.button === 2)) {
        this._preventDefault(e);
        this.toggle(e);
      }
    },

    _ontouchstart: function (e) {
      // Touchstart event fires before
      // the mousedown and can wipe it
      navToggle.onmousedown = null;
      this._preventDefault(e);
      this.toggle(e);
    },

    _ontouchend: function () {
      // Prevents ghost click from happening on some Android browsers
      var that = this;
      nav.addEventListener("click", that._preventDefault, true);
      setTimeout(function () {
        nav.removeEventListener("click", that._preventDefault, true);
      }, opts.transition);
    },

    _onkeyup: function (e) {
      var evt = e || window.event;
      if (evt.keyCode === 13) {
        this.toggle(e);
      }
    },

    _onclick: function (e) {
      // For older browsers (looking at IE)
      this._preventDefault(e);
    },

    _transitions: function () {
      if (opts.animate) {
        var objStyle = nav.style,
          transition = "max-height " + opts.transition + "ms";

        objStyle.WebkitTransition = transition;
        objStyle.MozTransition = transition;
        objStyle.OTransition = transition;
        objStyle.transition = transition;
      }
    },

    _calcHeight: function () {
      var savedHeight = nav.inner.offsetHeight,
        innerStyles = "#" + this.wrapperEl + ".opened{max-height:" + savedHeight + "px}";

      // Hide from old IE
      if (computed) {
        styleElement.innerHTML = innerStyles;
        innerStyles = "";
      }
    },

    _resize: function () {
      if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {
        setAttributes(navToggle, {"aria-hidden": "false"});

        // If the navigation is hidden
        if (nav.className.match(/(^|\s)closed(\s|$)/)) {
          setAttributes(nav, {"aria-hidden": "true"});
          nav.style.position = "absolute";
        }

        this._createStyles();
        this._calcHeight();
      } else {
        setAttributes(navToggle, {"aria-hidden": "true"});
        setAttributes(nav, {"aria-hidden": "false"});
        nav.style.position = opts.openPos;
        this._removeStyles();
      }

      // Init callback
      opts.init();
    }

  };

  var _instance;
  function rn (el, options) {
    if (!_instance) {
      _instance = new ResponsiveNav(el, options);
    }
    return _instance;
  }

  return rn;
})(window, document);
