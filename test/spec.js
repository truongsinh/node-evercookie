/* global describe, beforeEach, afterEach, it, before, after */

'use strict';
var request = require('supertest');
var express = require('express');
const cookieParser = require('cookie-parser')
var evercookieMiddleware = require('../index.js');

var app = express();
app.use(cookieParser());

describe('Default setting', () => {
  before(()=> {
    app.use(evercookieMiddleware.backend());
  });
  after(() => {
    // no known method to remove connect's middleware
  })
  describe('request PNG', function () {
    it('responds 201', function (done) {
      request(app)
        .get('/evercookie_png.php')
        .expect(201)
        .end(done);
    }
    );
  });
  describe('request Cache', function () {
    describe('without cookie', function () {
      it('responds 304', function (done) {
        request(app)
          .get('/evercookie_cache.php')
          .expect(304)
          .end(done);
      });
    });
    describe('with cookie', function () {
      it('responds id body and has cache headers', function (done) {
        request(app)
          .get('/evercookie_cache.php')
          .set('Cookie', 'evercookie_cache=111')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect('Expires', 'Tue, 31 Dec 2030 23:30:45 GMT')
          .expect('Cache-Control', 'private, max-age=630720000')
          .expect(200)
          .expect('111')
          .end(done);
      });
    });
  });
  describe('request Etag', function () {
    describe('with Etag cookie', function () {
      it('with If-None-Match header responds id both in Etag header and body, favors cookie value', function (done) {
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
      it('without If-None-Match header responds id both in Etag header and body', function (done) {
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
    describe('without Etag cookie', function () {
      it('with If-None-Match header responds id only in Etag header', function (done) {
        request(app)
          .get('/evercookie_etag.php')
          .set('If-None-Match', '131')
          .expect('Etag', '131')
          .expect(304)
          .end(done);
      }
      );
      it('without If-None-Match header responds 304', function (done) {
        request(app)
          .get('/evercookie_etag.php')
          .expect(304)
          .end(done);
      }
      );
    });
  });

  describe('request Basic Auth', function () {
    describe('without Auth header', function () {
      it('responds 304', function (done) {
        request(app)
          .get('/evercookie_auth.php')
          .set('Authorization', 'Basic NTg5Og==')
          .expect(200)
          .expect('589')
          .end(done);
      });
    });
    describe('without Auth header', function () {
      it('responds id in body', function (done) {
        request(app)
          .get('/evercookie_auth.php')
          .expect(401)
          .expect('WWW-Authenticate', 'Basic')
          .end(done);
      });
    });
  });

});

describe('Custom setting', () => {
  before(()=> {
    app.use(evercookieMiddleware.backend({
      cachePath: '/custom_path.php'
    }));
  });
  after(() => {
    // no known method to remove connect's middleware
  });
  describe('request Cache', function () {
    describe('without cookie', function () {
      it('responds 304', function (done) {
        request(app)
          .get('/custom_path.php')
          .expect(304)
          .end(done);
      });
    });
  });
});
