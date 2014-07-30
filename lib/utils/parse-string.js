'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var matter = require('gray-matter');
var extendFile = require('./extend-file-obj');


/**
 * ## .parseString
 *
 * Parses a file from a string and turns it into a `View` object.
 *
 * @param  {String} `str` String that represents the file to parse
 * @param  {Object} `options`  Additional options ot pass to the new `View`
 * @return {Object} New `View` object with the parsed information
 */

module.exports = function parseString(str, options) {
  options = options || {};
  options.filepath = path.resolve(options.filepath || process.cwd());
  var file = matter(str, options);
  return extendFile(file, options);
};
