'use strict';

var path = require('path');
var Vinyl = require('vinyl');

/**
 * Expose `utils/` modules on `utils`
 */

var utils = require('export-files')(__dirname);

/**
 * Push a collection of templates into the stream (as vinyl files)
 */

utils.pushToStream = function pushToStream(collection, stream, fn) {
  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      stream.push(typeof fn === 'function'? fn(collection[key], Vinyl) : collection[key]);
    }
  }
};

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
 * Ensure that a file extension is formatted properly.
 *
 * @param {String} `ext`
 */

utils.formatExt = function formatExt(ext) {
  if (ext && ext[0] !== '.') ext = '.' + ext;
  return ext;
};

/**
 * Expose `utils`
 */

module.exports = utils;
