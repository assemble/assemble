'use strict';

/**
 * Module dependencies.
 */

var matter = require('gray-matter');
var _ = require('lodash');


/**
 * ## .parseMatter
 *
 * Utility for parsing front matter from a string using
 * default settings.
 *
 * This should only be used on files that have front-matter.
 *
 * @param  {String} `str` The string to parse.
 * @param  {Object} `options`  Options to pass to gray-matter.
 * @return {Object} Extended `file` object.
 */

module.exports = function parseMatter(file, encoding, options) {
  if (file.original) {
    return file;
  }
  var str = file.contents.toString(encoding || 'utf8');
  var obj = matter(str, _.extend({autodetect: true}, options));

  file.data = _.extend({}, file.data, obj.data);
  file.contents = new Buffer(obj.content);
  file.original = obj.original;
  return file;
};
