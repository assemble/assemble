'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var calculate = require('calculate-assets');
var _ = require('lodash');

/**
 * ## Dynamic Plugin
 *
 * Calculate dynamic properties for each file:
 *   - `assets` => path from `dest` to `options.assets`
 *
 * @param {Object} `assemble` the current assemble instance
 * @return undefined
 * @api public
 */

module.exports = function assets(options) {
  var assemble = this;
  var opts = _.extend({}, assemble.options, options);
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble.parse()', 'Streaming not supported'));
      return callback();
    }
    var assets = file.assets || opts.assets || assemble.get('assets');
    try {
      var dest = (file.dest && file.dest.dirname || file.dest)
      file.assets = calculate(dest, assets);
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-assets', err));
    }
    return callback();
  });
};
