'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var compute = require('computed-property');
var relative = require('relative-dest');
var extend = require('extend-shallow');

/**
 * Calculate the path from the `assets` or `public`
 * path define on the options to the destination
 * file.
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
