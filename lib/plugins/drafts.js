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
    return through.obj(function (file, encoding, next) {
      if (file.isNull()) {
        this.push(file);
        return next();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-drafts', 'Streaming not supported'));
        return next();
      }

      try {
        if (!file.contents.length) {
          return next();
        }
        if (file && file.data && !file.data.draft) {
          this.push(file);
          return next();
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-drafts', err));
      }
      return next();
    });
  };
};