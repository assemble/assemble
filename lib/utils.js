'use strict';

exports.glob = require('globby');
exports.toString = Object.prototype.toString;


/**
 * Utils
 */

exports.noop = function (value) {
  return value;
};


/**
 * `src` and `dest` plugins
 */

exports.dest = require('./utils/dest');
exports.parseFile = require('./utils/file');
exports.passthrough = require('./utils/passthrough');
exports.src = require('./utils/src');


/**
 * Coerce value to an flattened, dense array.
 *
 * @api private
 */

exports.arrayify = require('arrayify-compact');


/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

exports.isAbsolute = require('is-absolute');


/**
 * Parse front matter from a string.
 *
 * @api private
 */

exports.matter = require('gray-matter');


/**
 * Normalize a filepath.
 *
 * @api private
 */

exports.normalize = require('normalize-path');


/**
 * Parse a filepath into an object with properties
 * matching the methods on the node.js path module,
 * with a few extras:
 *
 *   - `dirname`
 *   - `basename` (with extension)
 *   - `name` (without extension)
 *   - `extname` (src)
 *   - `ext` (dest)
 *
 * @api private
 */

exports.parsePath = require('parse-filepath');


/**
 * ## .typeOf
 *
 * Return a string indicating the type of the given value.
 *
 * @method `typeOf`
 * @param {*} `value`
 * @api private
 */

exports.typeOf = function(value) {
  return exports.toString.call(value)
    .toLowerCase()
    .replace(/\[object ([\S]+)\]/, '$1');
};


/**
 * ## .ensureExt
 *
 * Ensure that a file extension is formatted properly.
 *
 * @method `ensureExt`
 * @param {String} `ext`
 * @api private
 */

exports.ensureExt = function(ext) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }
  return ext;
};
