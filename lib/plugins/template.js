'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var delims = require('escape-delims');
var _ = require('lodash');


module.exports = function templatePlugin(options) {
  var assemble = this;
  options = _.extend({}, {delims: ['{%', '%}']}, options);
  var data = options.data || options;

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-template', 'Streaming not supported'));
      return cb();
    }

    try {
      var str = file.contents.toString('utf8');
      if (options && !options.noescape) {
        str = delims.escape(str);
      }

      data = _.extend({}, assemble.cache, data, file.data);
      var rendered = _.template(str, data, options);
      file.contents = new Buffer(rendered);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-template', err));
    }

    this.push(file);
    cb();
  });
};
