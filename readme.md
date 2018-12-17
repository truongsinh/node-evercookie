# Evercookie Middleware for Connect/Express JS


[this repo]: (https://github.com/truongsinh/node-evercookie/)

[![Licence](https://img.shields.io/github/license/truongsinh/node-evercookie.svg)][this repo]
[![npm version](https://img.shields.io/npm/v/evercookie.svg?style=flat)](https://www.npmjs.com/package/evercookie)
[![Build Status](https://api.cirrus-ci.com/github/truongsinh/node-evercookie.svg)](https://cirrus-ci.com/github/truongsinh/node-evercookie)
[![Maintainability](https://api.codeclimate.com/v1/badges/7fc8c5c2a043171b8a82/maintainability)](https://codeclimate.com/github/truongsinh/node-evercookie/maintainability)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/truongsinh/node-evercookie.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/truongsinh/node-evercookie/alerts/)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7fc8c5c2a043171b8a82/test_coverage)](https://codeclimate.com/github/truongsinh/node-evercookie/test_coverage)
[![Dependencies Status](https://david-dm.org/truongsinh/node-evercookie.svg)](https://david-dm.org/truongsinh/node-evercookie)
[![DevDependencies Status](https://david-dm.org/truongsinh/node-evercookie/dev-status.svg)](https://david-dm.org/truongsinh/node-evercookie?type=dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)][this repo]
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][this repo]
<!-- [![OpenCollective](https://opencollective.com/node-evercookie/backers/badge.svg)](#backers)  -->
<!-- [![OpenCollective](https://opencollective.com/node-evercookie/sponsors/badge.svg)](#sponsors) -->

[Express](http://expressjs.com) is a sinatra inspired web development framework for node.js, insanely fast, flexible, and simple.
[Evercookie](http://samy.pl/evercookie/) is a Javascript API that produces extremely persistent cookies in a browser.
It is written in JavaScript and additionally uses a SWF (Flash) object for the Local Shared Objects and,
originally, PHPs for the server-side generation of cached PNGs and ETags.

This middleware port original PHP script to Connect/Express JS

# Support
- Node: 6 - 11
- Express: 4.x, 5.x
- See detail at [![Build Status](https://api.cirrus-ci.com/github/truongsinh/node-evercookie.svg)](https://cirrus-ci.com/github/truongsinh/node-evercookie)

# Usage

## Install
```bash
npm install --save evercookie
```

## In your code
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

## Settings
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

# Contributing
- [Contrubuting guideline](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [MIT licensed](./LICENSE)
- [![Become a Backer](https://opencollective.com/node-evercookie/tiers/backer.svg?avatarHeight=36)](https://opencollective.com/node-evercookie) or [![Become a Sponsor](https://opencollective.com/node-evercookie/tiers/sponsor.svg?avatarHeight=36)](https://opencollective.com/node-evercookie)
- [Spread word on Twitter](https://twitter.com/intent/tweet?text=%23evercookie%20on%20%23nodejs&url=https%3A%2F%2Fgithub.com%2Ftruongsinh%2Fnode-evercookie%2F&via=truongsinhtn)

# Acknowledgement
- [Samy Kamkar](https://github.com/samyk) for his awesome idea and implementation of [Evercookie](http://samy.pl/evercookie/)
- [TJ Holowaychuk](https://github.com/tj) for his awesome [Express framework](http://expressjs.com/)
- Ryan Dahl, Joyent and the whole Node.js community
