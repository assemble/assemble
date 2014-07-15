'use strict';

var _ = require('lodash');


/**
 * Utils
 */

exports.noop = function (value) {
  return value;
};


exports.toString = Object.prototype.toString;


exports.typeOf = function(val) {
  return exports.toString.call(val)
    .toLowerCase()
    .replace(/\[object ([\S]+)\]/, '$1');
};



/**
 * `src` and `dest` plugins
 */

exports.src = require('./utils/src');
exports.dest = require('./utils/dest');


exports.parseFile = require('./utils/file');


exports.glob = require('globby');



exports.passthrough = require('./utils/passthrough');

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

exports.isAbsolute = require('is-absolute');


/**
 * Flatten the given `arr`.
 *
 * @param {Array} `arr`
 * @return {Array}
 * @api private
 */

exports.flatten = require('array-flatten');


/**
 * Coerce value to an flattened, dense array.
 *
 * @api private
 */

exports.arrayify = require('arrayify-compact');



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
 * Parse front matter from a string.
 *
 * @api private
 */

exports.matter = require('gray-matter');




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

// exports.parseFile = function(filepath) {
//   return _.extend({}, exports.matter.read(filepath),
//     exports.parsePath(filepath));
// };
