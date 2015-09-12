(function ($) {
  var CONTAINER_CLASS = 'popper-container',
      SECONDARY_CLASS = 'secondary-popper',
      PRIMARY_CLASS = 'primary-popper',
      ACTIVE_CLASS = 'popped',
      DEFAULT_OPTIONS = {
        transitionOutDuration: 300,
        transiationInDuration: 450,
        transitionOutEasing: 'easeOutBack',
        transitionInEasing: 'easeInBack'
      };

  function Popper (element, options) {
    this.element = $(element);
    this.primary = this.element.find('[data-primary]');
    this.poppers = this.element.find(':not([data-primary])');
    this.options = $.extend({}, DEFAULT_OPTIONS, options || {});

    this.primary.on('click', this.primaryClicked.bind(this));
    this.element.addClass(CONTAINER_CLASS);
    this.poppers.addClass(SECONDARY_CLASS);
    this.primary.addClass(PRIMARY_CLASS);
    this.hidePoppers(true);
  }

  Popper.prototype.getPoppersStartingPosition = function () {
    return {
      left: Math.abs(this.primary.position().left + (this.primary.width()/2)),
      top: Math.abs(this.primary.position().top + (this.primary.height()/2))
    };
  };

  Popper.prototype.hidePoppers = function (noAnimation) {
    var position = this.getPoppersStartingPosition();
    if (noAnimation) {
      this.poppers.each(function () {
        $(this).css({
          left: position.left - ($(this).width() / 2),
          top: position.top - ($(this).height()/2)
        });
      });
    } else {
      this.poppers.each(function (index) {
        $(this).stop().delay(index * (this.options.transitionInDuration/3)).animate({
          left: position.left - ($(this).width() / 2),
          top: position.top - ($(this).width()/2)
        }, {
          duration: this.options.transitionInDuration,
          easing: this.options.transitionInEasing,
        });
      });
    }
    this.element.removeClass(ACTIVE_CLASS);
  };

  Popper.prototype.showPoppers = function () {
    this.element.addClass(ACTIVE_CLASS);
    this.poppers.show();
    this.positionPoppers();
  };

  Popper.prototype.positionPoppers = function () {
    var radius = 100,
        angle = 0,
        step = (2 * Math.PI) / this.poppers.length;

    var position = this.getPoppersStartingPosition(),
        elementW = this.element.width(),
        elementH = this.element.height();
    this.poppers.each(function (index) {
      var width = $(this).width(),
          height = $(this).height(),
          deltaWidth = (elementW / 2) - ($(this).width() / 2),
          deltaHeight = (elementH / 2) - ($(this).height() / 2),
          x = Math.round(width + radius * Math.cos(angle) - deltaWidth/2),
          y = Math.round(height + radius * Math.sin(angle) - deltaHeight/2);


      $(this).delay(index * (this.options.transitionOutDuration / 3)).animate({
        left: x + 'px',
        top: y + 'px'
      }, {
        duration: this.options.transitionOutDuration,
        easing: this.options.transitionOutEasing
      });
      angle += step;
    });
  };

  Popper.prototype.primaryClicked = function () {
    if (this.element.hasClass('popped')) {
      this.hidePoppers();
    } else {
      this.showPoppers();
    }
  };


  $.fn.popper = function (options) {
    return this.each(function () {
      var popper = new Popper(this);
      $(this).attr('popper', popper, options);
    });
  };
})(jQuery);
