'use strict';

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var calculate = require('calculate-assets');
var _ = require('lodash');

function computedProperty (obj, name, getter, setter) {
  Object.defineProperty(obj, name, {
    enumerable: true,
    get: getter || function () { return undefined; },
    set: setter || function () { }
  });
}

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

    // add the `assets` property to the file
    computedProperty(file, 'assets', function () {
      var assets = opts.assets || assemble.get('assets');
      var dest = (this.dest && this.dest.dirname || this.dest);

      var _assets = calculate(dest, assets);

      if (this._assets !== _assets) {
        this._assets = _assets;
      }

      return this._assets;
    });

    this.push(file);
    return callback();
  });
};
