'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var matter = require('gray-matter');
var parsePath = require('parse-filepath');
var extend = require('xtend');
var noop = function(dest) { return dest; };

module.exports = function pathParser(options) {
  options = extend({}, options);
  var fn = options.replace || noop;

  return function (file, encoding, opts) {
    var parsed = parsePath(file.path);
    for (var i in parsed) {
      if (parsed.hasOwnProperty(i)) {
        file[i] = parsed[i];
      }
    }

    var src = file.path;
    var dest = fn(file.path);
    file.src = src;
    file.dest = dest;
    return file;
  };
};