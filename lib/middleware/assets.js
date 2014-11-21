/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var computedProperty = require('computed-property');
var calculate = require('calculate-assets');
var path = require('path');
var _ = require('lodash');

/**
 * Calculate asset path so that it's dynamically updated for each file:
 *   - `assets` => path from `dest` to `options.assets`
 *
 * @param {Object} `assemble` the current assemble instance
 * @param {Object} `options` Additonal options to determine assets path
 * @api public
 * @name  assets
 */

module.exports = function (assemble, options) {
  return function assets (file, next) {
    // add the `assets` property to the file
    computedProperty(file.data, 'assets', function () {
      var opts = _.extend({}, assemble.options, options);
      this.dest = this.dest || {};

      // full resolved destination filepath for the file
      var dest = path.resolve(this.dest.path || this.dest.dirname || process.cwd());
      var assets = opts.assets || assemble.get('assets');
      var _assets = calculate(dest, assets);

      if (this._assets !== _assets) {
        this._assets = _assets;
      }
      return this._assets;
    });
    next();
  };
};