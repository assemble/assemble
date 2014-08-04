'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var delimsMap = require('delimiter-map');
var through = require('through2');
var globby = require('globby');

/**
 * Expose globby
 */

exports.glob = globby;


/**
 * ## .noop
 *
 * @param  {*} `value`
 * @return {*}
 * @api private
 */

exports.noop = function (value) {
  return value;
};


/**
 * ## .noopStream
 *
 * Inspired by gulp-util
 *
 * @api private
 */

exports.noopStream = function () {
  return through.obj();
};


/**
 * Temporarily fix the node.js v0.11.x drive letter and file path bug
 * see: https://github.com/joyent/node/issues/7880
 *
 * @return {[type]}
 */

exports.fixPath = function () {
  var args = [].slice.call(arguments);
  var filepath = path.join.apply(path, args);
  var segments = filepath.split(':\\');
  segments[0] = segments[0].toUpperCase();
  return segments.join(':\\\\');
};


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
 * ## .typeOf
 *
 * Return a string indicating the type of the given value.
 *
 * @method `typeOf`
 * @param {*} `value`
 * @api private
 */

exports.typeOf = function(value) {
  return Object.prototype.toString.call(value)
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


/**
 * ## .stripDot
 *
 * Remove the dot from a file extension.
 *
 * @method `stripDot`
 * @param {String} `ext`
 * @api private
 */

exports.stripDot = function (ext) {
  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }
  return ext;
};


/**
 * ## .engineDelims
 *
 * Remove the dot from a file extension.
 *
 * @method `engineDelims`
 * @param {String} `ext`
 * @api private
 */

exports.engineDelims = function (ext) {
	return delimsMap(exports.stripDot(ext));
};
