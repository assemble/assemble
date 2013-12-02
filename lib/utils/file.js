/**
 * File Utils
 */

// Node.js
var path = require('path');
var fs = require('fs');


// The module to be exported.
var file = module.exports = {};



/**
 * TODO:
 *  - exists (file exists)
 *  - isEmpty (check for content)
 *  - endsWith
 *  - filename
 *  - basename (filename sans extension)
 *  - lastExt (last extension)
 *  - readData (read JSON or YAML. We might consider adding YFM to this as well.)
 *  - readYFM
 *  - readContent (returns the content of a page, without YFM)
 *
 */



/**
 * Read JSON or YAML based on file extension
 * @param  {String} filepath The file path to read.
 * @return {Object}          Data object returned by the reader.
 */
var readData = function(filepath) {
  // we can either use grunt-helpers or create
  // utils using native node.js methods
};



/**
 * Utility function for globbing files and returning an array
 * of objects.
 *
 * @param  {Array|String} src        File path(s)
 * @param  {Function}     compare_fn Function for sorting the returned
 * @return {Array}                   Array of objects (obj for each page)
 */
var globFiles = function (src, compare_fn) {
  compare_fn = compareFn(compare_fn);
  var content = void 0;
  var index = 0;
  content = grunt.file.expand(src).map(function (path) {
    index += 1;
    return {
      index: index,
      path: path,
      context: assemble.data.readYFM(path),
      content: assemble.data.readContent(path)
    };
  }).sort(compare_fn).map(function (obj) {
    return obj;
  }); // or .join(grunt.util.normalizelf(grunt.util.linefeed));
  return content;
};
