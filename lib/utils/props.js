'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');


/**
 * ## File properties
 *
 * The following properties may be applied to the root
 * level of `file` objects.
 *
 * See the [file properties] documentation for more detail.
 *
 * @return {Array}
 * @api private
 */

exports.file = [
  'data',
  'original',
  'contents',
  'cwd',
  'base',
  'path',
  'stat'
];


/**
 * Common properties that can be used with the `src`
 * and/or `dest` on a `file` object.
 *
 * **Example:**
 *
 * ```js
 * var file = {
 *   src: {},
 *   dest: {}
 * };
 * ```
 *
 * @return {Array}
 * @api private
 */

exports.common = [
  'path',
  'contents',
  'assets',
  'data',
  'dirname',
  'basename',
  'ext',
  'extSegments',
  'name'
];


/**
 * Properties that should only be applied to `src` file
 * objects.
 *
 *
 * @return {Array}
 * @api private
 */

exports.src = exports.common.concat([
  'cwd',
  'orig'
]);


/**
 * Properties that should only be applied to `dest` file
 * objects.
 *
 *   - `base` The `dest` version of `cwd`, basically the dirname for dest.
 *
 * @return {Array}
 * @api private
 */

exports.dest = exports.common.concat([
  'base'
]);


/**
 * Create an object composed only of `src` properties.
 *
 * @return {Object}
 * @api private
 */

exports.getSrcProps = function (obj) {
  return _.pick(obj, exports.src);
};


/**
 * Create an object composed only of `dest` properties.
 *
 * @return {Object}
 * @api private
 */

exports.getDestProps = function (obj) {
  return _.pick(obj, exports.dest);
};


/**
 * Create an object without any `src` properties.
 *
 * @return {Object}
 * @api private
 */

exports.omitSrcProps = function (obj) {
  return _.omit(obj, exports.src);
};


/**
 * Create an object without any `dest` properties.
 *
 * @return {Object}
 * @api private
 */

exports.omitDestProps = function (obj) {
  return _.omit(obj, exports.dest);
};
