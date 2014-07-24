'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var matter = require('gray-matter');
var parsePath = require('parse-filepath');
var _ = require('lodash');

/**
 * Local dependencies
 */

var View = require('../view');


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

exports.parse = function parse (file, options) {
  file = _.defaults(file, {
    path: options.filepath || file.path,
    contents: (file.content ? new Buffer(file.content) : file.contents)
  });
  var view = new View(file, options);

  // Buffer the original content, in case it's needed
  view.orig = (file.original ? new Buffer(file.original) : file.orig);
  view.data = file.data || view.data || {};

  return view;
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
