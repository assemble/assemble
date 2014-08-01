'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var calculate = require('calculate-assets');
var _ = require('lodash');

/**
 * ## Assets plugin
 *
 * Calculate the path from each `dest` file to `options.assets`.
 *
 * @param {Object} `assemble` the current assemble instance
 * @return undefined
 * @api public
 */

module.exports = function assets(assemble) {
  var opts = _.extend({}, assemble.options);

  return function (options) {
    options = _.extend({}, opts, options);

    return through.obj(function (file, encoding, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError('assemble-assets', 'Streaming not supported'));
        return callback();
      }

      var assets = file.assets || options.assets || assemble.get('assets');
      try {
        file.assets = calculate(file.dest, assets);
        this.push(file);
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble-assets', err));
      }

      return callback();
    });
  };
};