'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');


/**
 * ## Drafts plugin
 *
 * Assemble plugin to exclude certain files, such as drafts,
 * from being rendered.
 */

module.exports = function draftsPlugin() {
  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-drafts', 'Streaming not supported'));
      return cb();
    }

    try {
      if (file && file.data && file.data.draft) {
        return cb();
      }
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-drafts', err));
    }

    return cb();
  });
};
