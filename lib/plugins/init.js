'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var parsePath = require('parse-filepath');

module.exports = function (/*assemble*/) {
  return function (options) {
    options = options || {};

    return through.obj(function (file, encoding, next) {
      var parsed = parsePath(file.path);

      // Add path properties to the `file` object
      for (var key in parsed) {
        if (parsed.hasOwnProperty(key)) {
          file[key] = parsed[key];
        }
      }

      file.src = file.path;
      file.dest = file.path;
      file.cwd = options.cwd || file.cwd;
      file.options = options;

      this.push(file);
      next();
    });
  };
};