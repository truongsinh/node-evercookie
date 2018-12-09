/*jshint node:true*/
'use strict';
var connect;
try {
  connect = require('connect');
} catch(e) {
  try {
    connect = require('express');
  } catch(e) {
    throw new Error('Neither express nor connect is available');
  }
}
module.exports = {
  backend: function evercookieMiddlewareBackendFactory(opts) {
    opts = opts || {};
    var defaultOptionMap = {
      etagCookieName: 'evercookie_etag',
      cacheCookieName: 'evercookie_cache',
      authPath: '/evercookie_auth.php',
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
      case optionMap.authPath:
        try{
          cookieValue = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString().split(':')[0];
        } catch(e){}
        if(cookieValue){
          res.send(cookieValue);
          return;
        }
        res.setHeader('WWW-Authenticate', 'Basic');
        res.sendStatus(401);
        return;
      case optionMap.pngPath:
        /**
         * PNG cache is technically no difference than text cache, but adds much more overhead to encode and decode.
         * Return 201 No content
         */
        res.sendStatus(201);
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
        }
        if(cookieValue) {
          res.set('Etag', cookieValue);
          res.send(cookieValue);
          return;
        }
        res.sendStatus(304);
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
        res.sendStatus(304);
        return;
      default:
        next();
      }
    }
    return evercookieMiddlewareBackend;
  }
};
