'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var Layout = require('../view/layout');


module.exports = function rendererPlugin(options, locals) {
  var assemble = this;
  var opts = _.extend({}, options);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-renderer', 'Streaming is not supported with engines.'));
      return callback();
    }

    try {
      var stream = this;
      assemble.render(file, opts, function (err, file, ext) {
        if (err) {
          callback(err);
        } else {
          file.ext = opts.ext || ext || assemble.get('ext');
          file.path = gutil.replaceExtension(file.path, file.ext);
          stream.push(file);
          callback();
        }
      });
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-renderer', err));
      return callback();
    }
  });
};