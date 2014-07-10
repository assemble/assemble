'use strict';

var gutil = require('gulp-util');
var through = require('through2');


/**
 * Assemble plugin to exclude certain files from being rendered.
 */

module.exports = function plugin(assemble) {
  return function (options) {

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
          this.emit('error', new gutil.PluginError('assemble-drafts', 'File is empty:', file.path));
          return callback();
        }
        if (file && file.locals && !file.locals.draft) {
          this.push(file);
          return callback();
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-drafts', err));
      }
    }, function (cb) {
      cb();
    });
  };
};