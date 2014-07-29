'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var matter = require('gray-matter');
var parsePath = require('parse-filepath');


/**
 * ## .parseFile
 *
 * Parses a file and its filepath, creates a new `View` object
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
 * @param {Object} `file` object to turn into a `View`
 * @param {Object} `options`
 * @return {Object} The `View` object.
 */

exports.parse = function parse(file, options) {
  options = options || {};
  var parsed = parsePath(file.path || options.filepath);
  file = file || {};
  file.data = file.data || {};

  var obj = {
    path: options.filepath,
    layout: file.data.layout || options.layout,
    contents: file.content || file.contents,
    data: file.data,

    // Buffer the original content
    orig: file.original
  };

  // Normalize paths
  obj.base = obj.base;
  obj.cwd = options.cwd || process.cwd();

  // Add path properties to the `obj` object
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      obj[key] = parsed[key];
    }
  }
  return obj;
};


/**
 * ## .parseFile
 *
 * Parses a file from a filepath and turns it into a `View` object.
 *
 * @param  {String} `filepath` Filepath to the file to load and parse
 * @param  {Object} `options`  Additional options ot pass to the new `View`
 * @return {Object} New `View` object with the parsed information
 */

exports.parseFile = function parseFile(filepath, options) {
  options = options || {};
  options.filepath = path.resolve(filepath);
  var file = matter.read(options.filepath, options);
  return exports.parse(file, options);
};


/**
 * ## .parseString
 *
 * Parses a file from a string and turns it into a `View` object.
 *
 * @param  {String} `str` String that represents the file to parse
 * @param  {Object} `options`  Additional options ot pass to the new `View`
 * @return {Object} New `View` object with the parsed information
 */

exports.parseString = function parseString(str, options) {
  options = options || {};
  options.filepath = path.resolve(options.filepath || process.cwd());
  var file = matter(str, options);
  return exports.parse(file, options);
};
