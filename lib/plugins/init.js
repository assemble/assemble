'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');

/**
 * Local dependencies.
 */

var parse = require('../utils/file').parse;

module.exports = function (assemble) {
  return function (options) {

    options = options || {};
    return through.obj(function (file, encoding, next) {
      file = parse(file, options);
      this.push(file);
      next();
    });
  };
};