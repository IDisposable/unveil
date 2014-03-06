/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback, throttle) {

    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina ? "data-src-retina" : "data-src",
        images = this,
        tr = throttle || 100,
        loaded,
        timer,
        wh,
        eh;

    this.one("unveil", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        loadImg(source, this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        if (!wh) {
            wh = $w.height();
        }

        var wt = $w.scrollTop(),
            wb = wt + wh,
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    function loadImg(source, el) {
       $.get(source, function() {
           if (this.tagName === "IMG") {
               el.setAttribute("src", source);
           } else {
               el.style["backgroundImage"] = "url('" + source + "')";
           }
           if (typeof callback === "function") callback.call(el);
        })
    }
    
    function throttledUnveil() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            unveil();
        }, tr);
    }
    
    function onResize() {
        wh = $w.height();
        throttledUnveil();
    }
 
    $w.on('scroll.unveil', throttledUnveil);
    $w.on('resize.unveil', onResize);

    unveil();

    return this;
  };

})(window.jQuery || window.Zepto);
