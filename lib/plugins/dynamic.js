'use strict';

var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var relative = require('relative');
var lookup = require('lookup-path');
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
 * Calculate properties that must be dynamically updated for each file:
 *   - `assets` => path from `dest` to `options.assets`
 *
 * @param {Object} `assemble` the current assemble instance
 * @return undefined
 * @api public
 */

module.exports = function dynamic(options) {
  var assemble = this;

  return through.obj(function (file, encoding, callback) {
    var self = this;

    if (file.isNull()) {
      this.push(file);
      return callback();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('Assemble plugin dynamic()', 'Streaming not supported'));
      return callback();
    }

    var opts = _.extend({}, assemble.options, options);

    // add the `assets` property to the file
    computedProperty(file, 'assets', function () {
      var root = path.resolve(opts.root || this.dest.root || assemble.get('root'));

      if (typeof this.dest !== 'object') {
        self.emit('error', new gutil.PluginError('Assemble plugin dynamic()', '`this.dest` should be an object.'));
      }

      var dest = this.dest.path || this.dest.dirname;
      var assets = opts.assets || assemble.get('assets');
      // var assets = path.join(root, opts.assets || assemble.get('assets'));
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
