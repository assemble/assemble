'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');


/**
 * Assemble plugin to exclude certain files from being rendered.
 */

module.exports = function plugin() {
  return function () {

    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-drafts', 'Streaming not supported'));
        return callback();
      }

      try {
        if (!file.contents.length) {
          return callback();
        }
        if (file && file.locals && !file.locals.draft) {
          this.push(file);
          return callback();
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-drafts', err));
      }
      return callback();
    });
  };
};