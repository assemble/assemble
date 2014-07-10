'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');
var remarked = require('../engines/remarked');

module.exports = function assembleRemarked(assemble) {
  return function (options, data) {
    options = options || {};
    remarked.setOptions(options);

    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-remarked', 'Streaming not supported'));
        return callback();
      }

      function render(err, html) {
        if (err) {
          callback(err);
        } else {
          file.contents = new Buffer(html);
          callback(null, file);
        }
      }

      try {
        if (options.filepath) {
          remarked(file.path, data, render);
        } else {
          remarked.render(String(file.contents), data, render);
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-template', err));
      }

      this.push(file);
      callback();
    });
  };
};
