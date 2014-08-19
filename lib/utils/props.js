var _ = require('lodash');


/**
 * Common properties that may be applied to `src` and/or
 * `dest` file objects.
 *
 * @return {Array}
 * @api private
 */

var common = exports.common = [
  'assets',
  'basename',
  'ext',
  'extSegments',
  'name',
  'path'
];


/**
 * Properties that should only be applied to `src` file
 * objects.
 *
 * @return {Array}
 * @api private
 */

exports.src = common.concat([
  'base',
  'cwd'
]);


/**
 * Properties that should only be applied to `dest` file
 * objects.
 *
 * @return {Array}
 * @api private
 */

exports.dest = ommon.concat([
  'root'
]);


/**
 * Convenience method for creating an object composed only
 * of valid `src` properties.
 *
 * @return {Object}
 * @api private
 */

exports.srcProps = function (obj) {
  return _.pick(obj, exports.src);
};


/**
 * Convenience method for creating an object composed only
 * of valid `dest` properties.
 *
 * @return {Object}
 * @api private
 */

exports.destProps = function (obj) {
  return _.pick(obj, exports.dest);
};
