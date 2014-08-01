'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var matter = require('gray-matter');
var extendFile = require('./extend-file-obj');


/**
 * ## .parseFile
 *
 * Parses a file from a filepath and turns it into a `View` object.
 *
 * @param  {String} `filepath` Filepath to the file to load and parse
 * @param  {Object} `options`  Additional options ot pass to the new `View`
 * @return {Object} New `View` object with the parsed information
 */

module.exports = function parseFile(filepath, options) {
  options = options || {};
  options.filepath = path.resolve(filepath);
  var file = matter.read(options.filepath, options);
  return extendFile(file, options);
};
