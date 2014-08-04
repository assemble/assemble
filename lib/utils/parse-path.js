'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var renamePath = require('rename-path');
var parsePath = require('parse-filepath');


/**
 * ## .parsePath
 *
 * Utility for parsing file paths and extending the
 * `file` object by adding the following properties:
 *
 *   - `src` object with the following properties
 *   - `src.dirname`: {String} The dirname from `path.dirname()`.
 *   - `src.basename`: {String} The basename from `path.basename()`.
 *   - `src.name`: {String} The basename of the file without extension.
 *   - `src.ext`: {String} The file extension from `path.extname()`.
 *   - `src.extSegments`: {Array} File extensions. e.g. `.min.js` => `['.min', '.js']`
 *
 *   - `dest` object with the following properties
 *   - `dest.dirname`: {String} The dirname from `path.dirname()`.
 *   - `dest.basename`: {String} The basename from `path.basename()`.
 *   - `dest.name`: {String} The basename of the file without extension.
 *   - `dest.ext`: {String} The file extension from `path.extname()`.
 *   - `dest.extSegments`: {Array} File extensions. e.g. `.min.js` => `['.min', '.js']`
 *
 * This should be used on every vinyl file that passes
 * through.
 *
 * @param  {String} `file` The file object.
 * @param  {Object} `options`  Options to pass to `parsePath`.
 * @return {Object} Extended `file` object.
 */

module.exports = function parsePath(file, encoding, options) {
  var opts = _.extend({}, options);
  var parsed = parsePath(file.path, opts);
  var fn = options.replace;

  file.src = {};
  file.dest = {};

  // Add path properties to the `file` fileect
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      file.src[key] = parsed[key];
      file.dest[key] = parsed[key];
    }
  }

  file.src = _.extend(file.src, {
    path: file.path,
    base: opts.src.base || file.base,
    cwd: opts.src.cwd || file.cwd,
    ext: parsed.extname
  });

  // TODO:
  // var destPath = renamePath(file.path, _.extend({}, file, opts));
  // var destPath = fn(file, opts);

  // Dest
  file.dest = _.extend(file.dest, {
    path: fn ? fn(file.path) : file.path,
    base: opts.dest.base,
    ext: opts.dest.ext || parsed.extname,
  });

  return file;
};