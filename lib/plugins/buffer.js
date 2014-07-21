'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');


module.exports = function (assemble) {
  return function (options) {
    options = options || {};

    // this is the plugin to return
    return through.obj(function (file, encoding, next) {
      // buffer everything. Don't worry about if it's null or a stream
      assemble.files.set(file.path, file);
      next();
    }, function (next) {
      // push all the files back into the stream
      assemble.files.forEach(function (file, key) {
        this.push(file);
      }, this);
      next();
    });
  };
};