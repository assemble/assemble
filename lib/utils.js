'use strict';

/**
 * Module dependencies
 */

var delimsMap = require('delimiter-map');
var globby = require('globby');


/**
 * Expose `utils`
 */

var utils = module.exports;


/**
 * Expose globby
 */

utils.glob = globby;


/**
 * ## .noop
 *
 * @param  {*} `value`
 * @return {*}
 * @api private
 */

utils.noop = function (value) {
  return value;
};


/**
 * `src` and `dest` plugins
 */

utils.dest = require('./utils/dest');
utils.src = require('./utils/src');
utils.parseFile = require('./utils/file').parseFile;
utils.parseString = require('./utils/file').parseString;


/**
 * Coerce value to an flattened, dense array.
 *
 * @api private
 */

utils.arrayify = require('arrayify-compact');


/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

utils.isAbsolute = require('is-absolute');


/**
 * Parse front matter from a string.
 *
 * @api private
 */

utils.matter = require('gray-matter');


/**
 * Normalize a filepath.
 *
 * @api private
 */

utils.normalize = require('normalize-path');


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

utils.parsePath = require('parse-filepath');


/**
 * ## .normalize
 *
 * Normalize `path` relative to the given `cwd`.
 *
 * @param {String} `cwd`
 * @param {String} `path`
 * @return {String}
 * @api private
 */

utils.normalize = function(cwd, filepath) {
  var segments = [];

  if (filepath.charAt(0) !== '.') {
    return filepath;
  }

  cwd = cwd.split('/');
  filepath = filepath.split('/');

  for (var i = 0; i < filepath.length; ++i) {
    if (filepath[i] === '..') {
      cwd.pop();
    } else if (filepath[i] !== '.'&& filepath[i] !== '') {
      segments.push(filepath[i]);
    }
  }

  return cwd.concat(segments).join('/');
};


/**
 * ## .typeOf
 *
 * Return a string indicating the type of the given value.
 *
 * @method `typeOf`
 * @param {*} `value`
 * @api private
 */

utils.typeOf = function(value) {
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

utils.ensureExt = function(ext) {
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

utils.stripDot = function (ext) {
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

utils.engineDelims = function (ext) {
	return delimsMap(utils.stripDot(ext))
};
