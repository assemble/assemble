'use strict';

var path = require('path');

/**
 * Expose `utils/` modules on `utils`
 */

var utils = require('export-files')(__dirname);

/**
 * Coerce value to an array
 *
 * @api private
 */

utils.arrayify = function arrayify(val) {
  return !Array.isArray(val) ? [val] : val;
};

/**
 * Get the basename of a file path, excluding extension.
 *
 * @param {String} `fp`
 * @param {String} `ext` Optionally pass the extension.
 */

utils.basename = function basename(fp, ext) {
  return fp.substr(0, fp.length - (ext || path.extname(fp)).length);
};

/**
 * Expose `utils`
 */

module.exports = utils;
