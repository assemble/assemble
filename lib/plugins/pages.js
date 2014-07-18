'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');
var normalizePages = require('../view/page');


module.exports = function () {
  return function (options) {
    options = options || {};
    var pages = normalizePages(options);

    // if no pages, just return a noop
    if (!pages.length) {
      return gutil.noop();
    }

    // The actual plugin
    return through.obj(function (file, enc, callback) {

      // just pass through all the files
      this.push(file);
      callback();

    }, function (callback) {

      // add all the page to the stream
      pages.forEach(function (file) {
        this.push(file);
      }.bind(this));

      callback();

    });
  };
};