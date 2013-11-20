/* global describe, beforeEach, afterEach, it, before, after */

'use strict';
var request = require('supertest');
var express = require('express');
var assert = require('assert');
var Png = require('png-js');
var evercookieMiddleware = require('../index.js');

var app = express();
app.use(express.cookieParser());
app.use(evercookieMiddleware.backend());
describe('request PNG', function() {
  describe('without png cookie', function() {
    it('responds 304', function(done) {
        request(app)
          .get('/evercookie_png.php')
          .expect(304)
          .end(done);
      }
    );
  });
  describe('with png cookie', function() {
    it('responds 200 with correct values and headers', function(done) {
        request(app)
          .get('/evercookie_png.php')
          .set('Cookie', 'evercookie_png=12345')
          .expect('Content-Type', 'image/png')
          .expect('Last-Modified', 'Wed, 30 Jun 2010 21:36:48 GMT')
          .expect('Expires', 'Tue, 31 Dec 2030 23:30:45 GMT')
          .expect('Cache-Control', 'private, max-age=630720000')
          .expect(200)
          .parse( function (res, fn) {
            res.on( 'data', function (chunk) {
              res.data = chunk;
            });
            res.on( 'end', function () {
              try {
                fn( null, res.data  );
              } catch ( err ) {
                fn( err );
              }
            });
          })
          .end(function(err, res){
            if(err){
              done(err);
              return;
            }
            var p = new Png(res.body);
            p.decode(function(pixArray){
              assert.strictEqual(String.fromCharCode(pixArray[0]), '1');
              assert.strictEqual(String.fromCharCode(pixArray[1]), '2');
              assert.strictEqual(String.fromCharCode(pixArray[2]), '3');
              // pixArray[3] is 255, alpha value
              assert.strictEqual(String.fromCharCode(pixArray[4]), '4');
              assert.strictEqual(String.fromCharCode(pixArray[5]), '5');
              // pix RGB value 0, or null value, terminates the string
              assert.strictEqual(pixArray[6], 0);
              done();
            });
          });
      }
    );
  });
});
describe('request Cache', function() {
  describe('without cookie', function() {
    it('responds 304', function(done) {
      request(app)
        .get('/evercookie_cache.php')
        .expect(304)
        .end(done);
    });
  });
  describe('with cookie', function() {
    it('responds id body and has cache headers', function(done) {
      request(app)
        .get('/evercookie_cache.php')
        .set('Cookie', 'evercookie_cache=111')
        .expect('Content-Type', 'text/html')
        .expect('Last-Modified', 'Wed, 30 Jun 2010 21:36:48 GMT')
        .expect('Expires', 'Tue, 31 Dec 2030 23:30:45 GMT')
        .expect('Cache-Control', 'private, max-age=630720000')
        .expect('Last-Modified', 'Wed, 30 Jun 2010 21:36:48 GMT')
        .expect(200)
        .expect('111')
        .end(done);
    });
  });
});
describe('request Etag', function() {
  describe('with Etag cookie', function() {
    it('with If-None-Match header responds id both in Etag header and body, favors cookie value', function(done) {
        request(app)
          .get('/evercookie_etag.php')
          .set('Cookie', 'evercookie_etag=111')
          .set('If-None-Match', '112')
          .expect('Etag', '111')
          .expect('111')
          .expect(200)
          .end(done);
      }
    );
    it('without If-None-Match header responds id both in Etag header and body', function(done) {
        request(app)
          .get('/evercookie_etag.php')
          .set('Cookie', 'evercookie_etag=121')
          .expect('Etag', '121')
          .expect('121')
          .expect(200)
          .end(done);
      }
    );
  });
  describe('without Etag cookie', function() {
    it('with If-None-Match header responds id both in Etag header and body', function(done) {
        request(app)
          .get('/evercookie_etag.php')
          .set('If-None-Match', '131')
          .expect('131')
          .expect(200)
          .end(done);
      }
    );
    it('without If-None-Match header responds 304', function(done) {
        request(app)
          .get('/evercookie_etag.php')
          .expect(304)
          .end(done);
      }
    );
  });
});
