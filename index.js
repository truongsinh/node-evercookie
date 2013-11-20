'use strict';
var Png = require('png').Png;
module.exports = {
  backend: function evercookieMiddlewareBackendFactory(opts) {
    opts = opts || {};
    var defaultOptionMap = {
      pngCookieName: 'evercookie_png',
      etagCookieName: 'evercookie_etag',
      cacheCookieName: 'evercookie_cache',
      pngPath: '/evercookie_png.php',
      etagPath: '/evercookie_etag.php',
      cachePath: '/evercookie_cache.php'
    };
    var optionMap = {
    };
    for(var key in defaultOptionMap) {
      var overidenValue = opts[key];
      if(overidenValue) {
        optionMap[key] = opts[key];
      } else {
        optionMap[key] = defaultOptionMap[key];
      }
    }
    function evercookieMiddlewareBackend(req, res, next) {
      var cookieValue;
      switch(req.path) {
      case optionMap.pngPath:
        /**
         * Port to NodeJS by TruongSinh <i@truongsinh.pro>
         *
         * Defined by samy kamkar, 09/20/2010 https://github.com/samyk/evercookie/blob/master/evercookie_png.php
         *
         * This is the server-side variable PNG generator for evercookie.
         * If an HTTP cookie is passed, the cookie data gets converted into
         * RGB-values in a PNG image. The PNG image is printed out with a
         * 20-year cache expiration date.
         *
         * If for any reason this file is accessed again WITHOUT the cookie,
         * as in the user deleted their cookie, the code returns back with
         * a forced "Not Modified" meaning the browser should look at its
         * cache for the image.
         *
         * The client-side code then places the cached image in a canvas and
         * reads it in pixel by pixel, converting the PNG back into a cookie.
         */
        cookieValue = req.cookies[optionMap.pngCookieName];
        if(cookieValue) {
          var a = [];
          var length = Math.min(cookieValue.length, 600);
          for(var i = 0; i < length; i++) {
            a.push(cookieValue.charCodeAt(i));
          }
          // push a null value, as a string terminator
          a.push(0);
          var png = new Png(new Buffer(a), 200, 1);
          res.set({
            'Content-Type': 'image/png',
            'Expires': 'Tue, 31 Dec 2030 23:30:45 GMT',
            'Cache-Control': 'private, max-age=630720000'
          });
          png.encode(function(b) {
            res.send(b);
          });
          return;
        }
        res.send(304);
        return;
      case optionMap.etagPath:
        /**
         * Port to NodeJS by TruongSinh <i@truongsinh.pro>
         * Defined by samy kamkar, https://github.com/samyk/evercookie/blob/master/evercookie_etag.php
         *
         * This is the server-side ETag software which tags a user by
         * using the Etag HTTP header, as well as If-None-Match to check
         * if the user has been tagged before.
         */
        cookieValue = req.cookies[optionMap.etagCookieName];
        if(!cookieValue) {
          cookieValue = req.get('If-None-Match');
        } else {
          res.set('Etag', cookieValue);
        }
        if(cookieValue) {
          res.send(cookieValue);
          return;
        }
        res.send(304);
        return;
      case optionMap.cachePath:
        cookieValue = req.cookies[optionMap.cacheCookieName];
        if(cookieValue) {
          res.set({
            'Content-Type': 'text/html',
            'Expires': 'Tue, 31 Dec 2030 23:30:45 GMT',
            'Cache-Control': 'private, max-age=630720000'
          });
          res.send(cookieValue);
          return;
        }
        res.send(304);
        return;
      default:
        next();
      }
    }
    return evercookieMiddlewareBackend;
  }
};
