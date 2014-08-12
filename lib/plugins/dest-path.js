'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');


/**
 * ## Dest path plugin
 *
 * Assemble plugin to calcuate the destination for each file.
 */

module.exports = function destPathPlugin(dest) {
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-dest-path', 'Streaming not supported'));
      return callback();
    }

    try {
      file.dest = file.dest || {};
      file.dest.dirname = dest;
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-dest-path', err));
    }

    return callback();
  });
};