'use strict';

/**
 * Module dependencies.
 */

var uri = require('url');

module.exports = function (options) {
  options = options || {};

  return function url(file, enc, cb) {
    console.log('url:', uri.parse(file));

    cb();
  };
};
