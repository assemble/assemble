'use strict';

/**
 * Module dependencies.
 */

var PluginError = require('gulp-util').PluginError;
var ms = require('map-stream');
var remarked = require('../engines/remarked');

module.exports = function assembleRemarked(options) {
 return function (options, data) {
    options = options || {};

    return ms(function (file, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new PluginError('assemble-remarked', 'Streaming not supported'));
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
        callback(err);
      }

      // try {
      //   file.contents = new Buffer(remarked(file.contents.toString('utf8')));
      // } catch (err) {
      //   this.emit('error', new PluginError('assemble-remarked', err));
      // }

      // this.push(file);
      // callback();
    });
  };
};
