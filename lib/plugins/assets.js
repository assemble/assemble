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
 * Calculate asset path so that it's dynamically updated for each file:
 *   - `assets` => path from `dest` to `options.assets`
 *
 * @param {Object} `assemble` the current assemble instance
 * @api public
 */

module.exports = function assets(options) {
  var assemble = this;

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('Assemble plugin assets()', 'Streaming not supported'));
      return cb();
    }

    if (typeof file.dest !== 'object') {
      this.emit('error', new gutil.PluginError('Assemble plugin assets()', '`file.dest` should be an object.'));
    }

    // add the `assets` property to the file
    computedProperty(file, 'assets', function () {
      var opts = _.extend({}, assemble.options, options);

      // full resolved destination filepath for the file
      var dest = path.resolve(this.dest.path || this.dest.dirname);
      var assets = opts.assets || assemble.get('assets');
      var _assets = calculate(dest, assets);

      if (this._assets !== _assets) {
        this._assets = _assets;
      }
      return this._assets;
    });

    this.push(file);
    return cb();
  });
};
