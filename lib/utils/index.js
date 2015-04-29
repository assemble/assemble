'use strict';

/**
 * Expose `utils/` modules on `utils`
 */

var utils = require('export-files')(__dirname);

/**
 * Coerce value to an array
 *
 * @api private
 */

utils.arrayify = function arrayify(val) {
  return !Array.isArray(val) ? [val] : val;
};

/**
 * Return the destination extension for the given `file`.
 *
 * @param {Object} `file` A file object with `ext`/`dest` properties.
 * @param {Object} `assemble`
 * @api public
 */

utils.getDestExt = function(file, assemble) {
  var data = file && file.data;
  var dest = data.dest;
  var engine;

  if (!dest) {
    return assemble.option('destExt');
  }

  var ext = file.ext || data.src.ext;
  if (ext) {
    ext = utils.formatExt(ext);
    engine = assemble.engines[ext];
  }

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

  return file.ext || dest.ext || assemble.option('destExt');
};

/**
 * Ensure that a file extension is formatted properly.
 *
 * @param {String} `ext`
 * @api private
 */

utils.formatExt = function(ext) {
  if (ext && ext[0] !== '.') {
    ext = '.' + ext;
  }
  return ext;
};

/**
 * Expose `utils`
 */

module.exports = utils;
