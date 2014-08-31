'use strict';

/**
 * Module dependencies.
 */

var matter = require('gray-matter');
var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');

module.exports = function matterPlugin(options) {
  var assemble = this;
  var opts = _.extend({}, assemble.options, options);

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-gray-matter', 'Streaming not supported'));
      return cb();
    }
    try {
      var obj = matter(file.contents.toString(), opts);
      file.data = obj.data;
      file.contents = new Buffer(obj.content.replace(/^\s*/, ''));
      if (!file.contents.length) {
        this.emit('error', new gutil.PluginError('assemble-gray-matter', 'File is empty:', file.path));
        return cb();
      }
      file.orig = new Buffer(obj.orig);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-gray-matter', err));
    }

    this.push(file);
    cb();
  });
};
