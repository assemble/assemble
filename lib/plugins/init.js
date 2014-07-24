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
    options.engines = options.engines || assemble.engines;
    options.defaultEngine = options.defaultEngine || assemble.get('view engine');

    return through.obj(function (file, encoding, next) {
      file = parse(file, options);
      this.push(file);
      next();
    });
  };
};