'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var parsePath = require('parse-filepath');

module.exports = function (assemble) {
  var View = assemble.get('view');
  return function (options) {

    options = options || {};
    options.engines = options.engines || assemble.engines;
    options.defaultEngine = options.defaultEngine || assemble.get('view engine');

    return through.obj(function (file, encoding, next) {
      file = new View(file, options);
      this.push(file);
      next();
    });
  };
};