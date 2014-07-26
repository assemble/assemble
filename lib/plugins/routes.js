'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');

module.exports = function (options) {
  options = options || {};
  return through.obj(function (file, encoding, next) {
    this.push(file);
    next();
  });
};