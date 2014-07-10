'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var isFalsey = require('falsey');


/**
 * Assemble plugin to exclude certain files from being rendered.
 */

module.exports = function plugin(assemble) {
  return function (options) {

    return through.obj(function (file, encoding, callback) {
      var locals = file && file.locals;

      if (!locals.draft) {
        this.push(file);
        return callback();
      }
    }, function (cb) {
      cb();
    });
  };
};