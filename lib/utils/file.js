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
 * ## .parseFile
 *
 * Parses a file and its filepath, creates a new vinyl-fs `file` object
 * and extends it with extra properties:
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
 *   - `data`: {Object} Parsed data from front-matter
 *   - `stat`: {Object}
 *
 * @param {String} `filepath` path to file to parse
 * @param {Object} `options`
 * @return {Object} The `file` object.
 */

exports.parse = function parse (page, options) {
  var parsed = parsePath(options.filepath);
  var file = new File({
    path: normalize(options.filepath),
    contents: new Buffer(page.content)
  });

  // Buffer the original content, in case it's needed
  file.orig = new Buffer(page.original);
  file.data = page.data;

  // Normalize paths
  file.base = normalize(file.base);
  file.cwd = normalize(options.cwd || file.cwd);

  // Add path properties to the `file` object
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      file[key] = parsed[key];
    }
  }
  return file;
};

exports.parseFile = function parseFile(filepath, options) {
  options = options || {};
  options.filepath = path.resolve(filepath);
  var page = matter.read(options.filepath, options);
  return exports.parse(page, options);
};

exports.parseString = function parseString(str, options) {
  options = options || {};
  options.filepath = path.resolve(options.filepath || process.cwd());
  var page = matter(str, options);
  return exports.parse(page, options);
};
