'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');

module.exports = function routesPlugin(options) {
  options = options || {};
  return through.obj(function (file, encoding, next) {
    this.push(file);
    next();
  });
};