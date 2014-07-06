'use strict';

/**
 * Module dependencies.
 */

var uri = require('url');

module.exports = function (options) {
  return function url(file, enc, cb) {
    console.log(file)
    cb();
  };
};
