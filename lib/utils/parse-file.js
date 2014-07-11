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
 * Parses a file and its filepath, and adds the resulting properties
 * to a `file` object.
 *
 * @param {String} `filepath`
 * @return {Object} The `file` object.
 */

module.exports = function parseFile(filepath) {
  filepath = path.resolve(filepath);
  var parsed = parsePath(filepath);
  var page = matter.read(filepath);

  var file = new File({
    path: normalize(filepath),
    contents: new Buffer(page.content)
  });
  file.orig = new Buffer(page.original);
  file.locals = page.data;


  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      file[key] = parsed[key];
    }
  }
  return file;
};

console.log(module.exports('file.txt.md'))