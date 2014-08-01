'use strict';

/**
 * Module dependencies.
 */

var renamePath = require('rename-path');
var parsePath = require('parse-filepath');
var _ = require('lodash');


/**
 * ## .extendFileObject
 *
 * Extends a vinyl `File` object with the following properties:
 *
 *   - `cwd`: {String} The current working directory.
 *   - `assets`: {String} The user-defined `assets` directory.
 *   - `base`: {String} Typically where a glob starts, used to generate relative paths.
 *   - `path`: {String} The full path to the file.
 *   - `dirname`: {String} The dirname from `path.dirname()`.
 *   - `basename`: {String} The basename from `path.basename()`.
 *   - `name`: {String} The basename of the file without extension.
 *   - `extname`: {String} The file extension from `path.extname()`.
 *   - `extSegments`: {Array} File extensions. e.g. `.min.js` => `['.min', '.js']`
 *   - `orig`: {Buffer} The original, unparsed content of the file.
 *   - `contents`: {Buffer} The parsed content of the file, excluding front-matter.
 *   - `data`: {Object} Parsed data from front-matter
 *   - `stat`: {Object}
 *
 * @param {Object} Initial `file` object
 * @param {Object} `options`
 * @return {Object} Extended `file` object
 */

module.exports = function extendFileObject(file, options) {
  var opts = _.extend({}, options);
  var filepath = file.path || opts.filepath;
  var parsed = parsePath(filepath, opts);

  file = file || {};
  file.data = file.data || {};

  var obj = {
    src: filepath,
    assets: file.assets || file.data.assets || opts.assets || '',
    layout: file.data.layout || opts.layout,
    data: file.data,

    path: filepath,
    contents: file.content || file.contents,

    // Buffer the original content
    orig: file.original
  };

  // Normalize paths
  obj.base = opts.base || file.base;
  obj.cwd = opts.cwd || file.cwd || process.cwd();
  obj.ext = parsed.extname;

  // Add path properties to the `obj` object
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      obj[key] = parsed[key];
    }
  }

  obj.dest = renamePath(obj.path, _.extend({}, obj, opts));
  return obj;
};
