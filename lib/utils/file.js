'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var matter = require('gray-matter');
var parsePath = require('parse-filepath');
var normalize = require('normalize-path');
var File = require('gulp-util').File;


/**
 * ## .assembleFile
 *
 * Parses a file and its filepath, and extends a new vinyl-fs `file`
 * object with additional properties:
 *
 *   - `cwd`: {String} The current working directory.
 *   - `base`: {String} Typically where a glob starts, used to generate relative paths.
 *   - `path`: {String} The full path to the file.
 *   - `dirname`: {String} The dirname from `path.dirname()`.
 *   - `basename`: {String} The basename from `path.basename()`.
 *   - `name`: {String} The basename of the file without extension.
 *   - `extname`: {String} The file extension from `path.extname()`.
 *   - `extSegments`: {Array} File extensions. e.g. `.min.js` => `['.min', '.js']`
 *   - `orig`: {Buffer} The original, unparsed content of the file.
 *   - `contents`: {Buffer} The parsed content of the file, excluding front-matter.
 *   - `locals`: {Object} Parsed data from front-matter
 *   - `stat`: {Object}
 *
 * @param {String} `filepath`
 * @return {Object} The `file` object.
 */

module.exports = function assembleFile(filepath, options) {
  options = options || {};

  filepath = path.resolve(filepath);
  var parsed = parsePath(filepath);
  var page = matter.read(filepath);

  var file = new File({
    path: normalize(filepath),
    contents: new Buffer(page.content)
  });

  file.orig = new Buffer(page.original);
  file.locals = page.data;
  file.base = normalize(file.base);
  file.cwd = normalize(options.cwd || file.cwd);

  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      file[key] = parsed[key];
    }
  }
  return file;
};