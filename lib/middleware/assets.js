'use strict';

var path = require('path');
var compute = require('computed-property');
var relative = require('relative-dest');
var extend = require('extend-shallow');

/**
 * Calculate `assets` or `public` path so that it's dynamically updated for each file:
 *   - `assets` => path from `dest` to `options.assets`
 *
 * @name assets
 * @param {Object} `assemble` the current assemble instance
 * @param {Object} `options` Additonal options to determine assets path
 * @api public
 */

module.exports = function (assemble, options) {
  return function assetsPath(file, next) {
    calculate(assemble, file, 'assets', options);
    calculate(assemble, file, 'public', options);
    next();
  };
};

function calculate(assemble, file, destDir, options) {
  compute(file.data, destDir, function () {
    var opts = extend({}, assemble.options, options);
    this.dest = this.dest || {};

    // full resolved destination filepath for the file
    var dest = path.resolve(this.dest.path
        || this.dest.dirname
        || process.cwd());

    var dir = opts[destDir] || assemble.get(destDir);
    var res = relative(dest, dir);

    if (this._assets !== res) {
      this._assets = res;
    }
    return this._assets;
  });
}
