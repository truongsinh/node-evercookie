'use strict';
var express = require('express');
//var evercookieMiddleware = require('evercookie');
var evercookieMiddleware = require('../index');

var app = express();
app.use(express.cookieParser());
app.use(evercookieMiddleware.backend());
app.use(express.static(__dirname + '/bower_components/evercookie')); // be careful, you may want to use path.join instead!
app.listen(8080,function(err){
  if(err){
    throw err;
  }
  console.info('Listening on %s', 8080);
});
