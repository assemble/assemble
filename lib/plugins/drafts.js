'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');


/**
 * ## Drafts plugin
 *
 * Assemble plugin to exclude certain records, such as drafts,
 * from being rendered.
 */

module.exports = function draftsPlugin() {
  return through.obj(function (record, encoding, cb) {
    try {
      if (record && record.data && record.data.draft) {
        return cb();
      }
      this.push(record);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-drafts', err));
    }

    return cb();
  });
};
