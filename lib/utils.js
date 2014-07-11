'use strict';

var _ = require('lodash');



exports.noop = function (value) {
  return value;
};



exports.glob = require('globby');


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

exports.parseFile = function(filepath) {
  return _.extend({}, exports.matter.read(filepath),
    exports.parsePath(filepath));
};
