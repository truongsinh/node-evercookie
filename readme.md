# Evercookie Middleware for Connect/Express JS

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![npm version](https://img.shields.io/npm/v/evercookie.svg?style=flat)](https://www.npmjs.com/package/evercookie)
[![Build Status](https://travis-ci.org/truongsinh/node-evercookie.svg?branch=master)](https://travis-ci.org/truongsinh/node-evercookie)
[![Coverage Status](https://img.shields.io/coveralls/truongsinh/node-evercookie/master.svg?style=flat)](https://coveralls.io/github/truongsinh/node-evercookie?branch=master)
[![Dependencies Status](https://david-dm.org/truongsinh/node-evercookie.svg)](https://david-dm.org/truongsinh/node-evercookie)
[![DevDependencies Status](https://david-dm.org/truongsinh/node-evercookie/dev-status.svg)](https://david-dm.org/truongsinh/node-evercookie?type=dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

[Express](http://expressjs.com) is a sinatra inspired web development framework for node.js, insanely fast, flexible, and simple.
[Evercookie](http://samy.pl/evercookie/) is a Javascript API that produces extremely persistent cookies in a browser.
It is written in JavaScript and additionally uses a SWF (Flash) object for the Local Shared Objects and,
originally, PHPs for the server-side generation of cached PNGs and ETags.

This middleware port original PHP script to Connect/Express JS

# Node version support
- 6
- 8
- 10
- 11

# Express version support:
- 4.x
- 5.x

# Install
```bash
npm install --save evercookie
```

# Usage
Evercookie backend middleware needs cookie, thus `cookieParser()` middleware must come before Evercookie backend middleware.
In addition, express server must serve front end assets, such as index.html and evercookie.js as well.
```js
var express = require('express');
var evercookie = require('evercookie');
const cookieParser = require('cookie-parser')

var app = express();
app.use(cookieParser());
app.use(evercookie.backend());
app.use(express.cookieParser());
app.use(express.static(__dirname + '/public')); // be careful, you may want to use path.join instead!
```

# Settings
Customized settings can be used, but up to this moment, it makes no sense to change the dafault one,
as all these values are hardcoded in (frontend) `evercookie.js`.
```js
//...
app.use(evercookie.backend({
  pngCookieName: 'evercookie_png',
  etagCookieName: 'evercookie_etag',
  cacheCookieName: 'evercookie_cache',
  pngPath: '/evercookie_png.php',
  etagPath: '/evercookie_etag.php',
  cachePath: '/evercookie_cache.php'
}));
//...
```

# Test
```bash
npm test
```

# Acknowledgement
- [Samy Kamkar] (https://github.com/samyk) for his awesome idea and implementation of [Evercookie](http://samy.pl/evercookie/)
- [TJ Holowaychuk] (https://github.com/tj) for his awesome [Express framework](http://expressjs.com/)
- Ryan Dahl, Joyent and the whole Node.js community

# License
The MIT License (MIT)
Copyright (c) 2013 [TruongSinh Tran-Nguyen](i@truongsinh.pro)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
