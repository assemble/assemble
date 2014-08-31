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
  'orig',
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
  'assets',
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
 *   - `root` The `dest` version of `cwd`, essentially the dirname for `dest`.
 *
 * @return {Array}
 * @api private
 */

exports.dest = exports.common.concat([
  'root',
  'base'
]);


/**
 * Properties that should only be passed to globbing libraries
 *
 *   - `maxDepth` defaults to 1000
 *   - `maxLength` defaults to Infinity
 *   - `cache` defaults to {}
 *   - `stateCache` deaults to {}
 *   - `cwd` defaults to `process.cwd()`
 *   - `root`
 *   - `nomount`
 *   - `matchBase`
 *   - `noglobstar`
 *   - `strict`
 *   - `dot`
 *   - `mark`
 *   - `sync`
 *   - `nounique`
 *   - `nonull`
 *   - `nosort`
 *   - `nocase`
 *   - `stat`
 *   - `debug`
 *   - `globDebug`
 *   - `silent`
 *
 * @return {Array}
 * @api private
 */

exports.glob = [
  'maxDepth',
  'maxLength',
  'cache',
  'stateCache',
  'cwd',
  'root',
  'nomount',
  'matchBase',
  'noglobstar',
  'strict',
  'dot',
  'mark',
  'sync',
  'nounique',
  'nonull',
  'nosort',
  'nocase',
  'stat',
  'debug',
  'globDebug',
  'silent'
];


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
 * Create an object composed only of `glob` properties.
 *
 * @return {Object}
 * @api private
 */

exports.getGlobProps = function (obj) {
  return _.pick(obj, exports.glob);
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


/**
 * Create an object without any `glob` properties.
 *
 * @return {Object}
 * @api private
 */

exports.omitGlobProps = function (obj) {
  return _.omit(obj, exports.glob);
};


/**
 * Merge all `file.src` properties from assemble config.
 *
 * @return {Object}
 * @api private
 */

exports.mergeSrcProps = function (assemble, options) {
  var src = {};
  _.merge(src, exports.getSrcProps(assemble.cache));
  _.merge(src, exports.getSrcProps(assemble.cache.data));
  _.merge(src, exports.getSrcProps(assemble.options));
  _.merge(src, exports.getSrcProps(options));
  return src;
};


/**
 * Merge all `file.dest` properties from assemble config.
 *
 * @return {Object}
 * @api private
 */

exports.mergeDestProps = function (assemble, options) {
  var dest = {};
  _.merge(dest, exports.getDestProps(assemble.cache.data));
  _.merge(dest, exports.getDestProps(assemble.options));
  _.merge(dest, exports.getDestProps(assemble.cache));
  _.merge(dest, exports.getDestProps(options));
  return dest;
};
