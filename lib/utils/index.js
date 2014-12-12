'use strict';

/**
 * Module dependencies
 */

var delimsMap = require('delimiter-map');
var language = require('lang-map');
var through = require('through2');
var globby = require('globby');
var path = require('path');
var _ = require('lodash');

/**
 * Expose globby
 */

exports.glob = globby;

/**
 * Expose stream
 */

exports.stream = require('./stream');

/**
 * @param  {*} `value`
 * @return {*}
 * @api private
 */

exports.noop = function (value) {
  return value;
};

/**
 * Inspired by gulp-util
 *
 * @api private
 */

exports.noopStream = function () {
  return through.obj();
};

/**
 * Convenience method for debugging vinyl file objects
 * without the `contents` property.
 *
 * @api private
 */

exports.debug = function (obj, omit) {
  var o = _.omit(obj, ['contents', '_contents', 'orig'].concat(omit || []));
  return JSON.stringify(o, null, 2);
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
 * Coerce value to an array
 *
 * @api private
 */

exports.arrayify = function arrayify(val) {
  return !Array.isArray(val)
    ? [val]
    : val;
};

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
 * Return the destination extension for the given `file`.
 *
 * @param {Object} `file` A file object with `ext`/`dest` properties.
 * @param {Object} `assemble`
 * @api public
 */

exports.getDestExt = function(file, assemble) {
  var data = file && file.data;
  var dest = data.dest;

  if (!dest) {
    return assemble.option('destExt');
  }

  var ext = file.ext || data.src.ext;
  if (ext) {
    ext = exports.formatExt(ext);

    var engine = assemble.engines[ext];
    if (engine) {
      ext = engine.options.destExt;
      if (ext) {
        return ext;
      }
      ext = assemble.option('destExt');
      if (ext) {
        return ext;
      }
    }
  }

  return file.ext || dest.ext || assemble.option('destExt');
};

/**
 * Ensure that a file extension is formatted properly.
 *
 * @param {String} `ext`
 * @api private
 */

exports.formatExt = function(ext) {
  if (ext && ext[0] !== '.') {
    ext = '.' + ext;
  }
  return ext;
};

/**
 * Remove the dot from a file extension.
 *
 * @param {String} `ext`
 * @api private
 */

exports.stripExtDot = function (ext) {
  if (ext[0] === '.') {
    return ext.slice(1);
  }
  return ext;
};

/**
 * Returns `true` if the file extension is mapped to
 * a template engine with known delimiters.
 *
 * @param {String} `ext`
 * @api private
 */

exports.isValidEngineExt = function(ext) {
  var lang = language.lang(exports.stripExtDot(ext));
  return !!(/md/.test(ext) || (delimsMap(lang) &&
    delimsMap(lang).length));
};

/**
 * Remove the dot from a file extension.
 *
 * @param {String} `ext`
 * @api private
 */

exports.engineDelims = function (ext) {
	return delimsMap(exports.stripExtDot(ext));
};
