'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');

// TODO: externalize to assemble-utils
// var normalizePages = require('../view/page');

module.exports = function (assemble) {

  return function (src, options) {
    src = src || [];
    options = options || {};

    // Normalize `pages` data structure
    var page = assemble.page(options);
    var pages = page.normalize(src, options);

    return through.obj(function (file, enc, callback) {
      // Pass through all the files
      this.push(file);
      callback();
    }, function (callback) {

      // Push generated pages into the stream
      pages.forEach(function (file) {
        this.push(file);
      }.bind(this));

      callback();
    });
  };
};