'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var through = require('through2');
var gutil = require('gulp-util');
var remarked = require('../engines/remarked');


/**
 * Assemble plugin for Remarked.
 */

module.exports = function assembleRemarked(assemble) {
  var opts = _.extend({}, assemble.options);

  return function (options, data) {
    _.extend(opts, options);

    return through.obj(function (file, encoding, next) {
      if (file.isNull()) {
        this.push(file);
        return next();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-remarked', 'Streaming not supported'));
        return next();
      }

      function render(err, html) {
        if (err) {
          next(err);
        } else {
          file.contents = new Buffer(html);
          next(null, file);
        }
      }

      // Set remarked options.
      remarked.setOptions(opts);

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
      next();
    });
  };
};
