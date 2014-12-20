'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var _ = require('lodash');

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
