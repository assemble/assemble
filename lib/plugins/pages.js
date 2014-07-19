'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');

// TODO: externalize to assemble-utils
// var normalizePages = require('../view/page');

module.exports = function (assemble) {
  return function (options) {
    options = options || {};

    // Normalize `pages` data structure
    var page = assemble.page(options);
    var pages = page.normalizePages(options);

    return through.obj(function (file, enc, callback) {
      var self = this;

      if (!pages.length && file.isNull()) {
        this.push(file);
        return callback();
      }

      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-pages', 'Streaming not supported'));
        return callback();
      }

      // Pass through all the files
      this.push(file);
      callback();
    }, function (callback) {

      // Push generated pages into the stream
      pages.forEach(function (file) {
        self.push(file);
      });

      callback();
    });
  };
};