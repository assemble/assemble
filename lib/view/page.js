'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var resolve = require('resolve-dep');

/**
 * Local dependencies.
 */

var utils = require('../utils');


/**
 * ## `options.pages`
 *
 * If a `pages` option is passed in, use it to generate Viynl files
 *
 */

function extend (file, page) {
  file.data = _.extend(file.data || {}, page.data);
  return file;
}

function parseFile (filepath, page, options) {
  var file = utils.parseFile(filepath, options);
  return extend(file, page);
}

function parseString (page, options) {
  var file = utils.parseString(page.content, options);
  return extend(file, page);
}


/**
 * Normalize the data structure to
 *
 * @param {Object} `options` options used to generate the pages.
 * @returns {Array} List of generated pages.
 */

function Page(options) {
  this.options = options || {};
}


/**
 * Resolve, load, and parse all pages
 * based on type.
 *
 * @param  {mixed}  `pages`   Array, object, function, or string to load pages from.
 * @param  {Object} `options` additional options to pass to loading/parsing methods
 * @return {Array}  a list of pages as Vinyl objects
 */

Page.prototype.normalize = function(pages, options) {
  options = _.extend({}, this.options, options);
  var files = [];
  var process = this[utils.typeOf(pages)];
  if (process) {
    files = process.call(this, pages, options);
  }
  return _.flatten(files);
};


/**
 * Resolve pages paths and require them in.
 * Call `normalize` for futher processing.
 *
 * @param  {String} `str`     Glob pattern used for resolving file paths
 * @param  {Object} `options` Additional options to pass to resolve-dep
 * @return {Array}  a list of pages as Vinyl objects
 */

Page.prototype.string = function (str, options) {
  var resolved = resolve(str, options);
  return _.flatten(resolved.map(function (filepath) {
    var pages = require(filepath);
    return this.normalize(pages, options);
  }.bind(this)));
};


/**
 * Call the function and pass the results to
 * `normalize` for futher processing.
 *
 * @param  {Function} `fn`    Function to call.
 * @param  {Object} `options` Additional options to pass
 * @return {Array}  a list of pages as Vinyl objects
 */

Page.prototype.function = function (fn, options) {
  return this.normalize(fn(), options);
};


/**
 * Map an object to Vinyl files
 *
 * @param  {Object} `obj`     object to map
 * @param  {Object} `options` Additional options to pass
 * @return {Array}  a list of pages as Vinyl objects
 */

Page.prototype.object = function (obj, options) {

  // when the object has a `filepath` property
  // map it directly
  if ('filepath' in obj) {
    options.filepath = obj.filepath;
    var file = null;
    if ('content' in obj) {
      file = parseString(obj, options);
    } else {
      file = parseFile(obj.filepath, obj, options);
    }
    return [file];
  }

  // When the object is a list of filepath/page properties
  // map each one, calling normalize if needed.
  return _.flatten(_.keys(obj).map(function (filepath) {
    var page = obj[filepath];
    var type = utils.typeOf(page);
    if (type === 'object') {
      page.filepath = page.filepath || filepath;
      return this.object(page, options);
    }
    return this.normalize(page, options);
  }.bind(this)));
};


/**
 * Call `normalize` for each item in the array.
 *
 * @param  {Object} `arr`     array to normalize
 * @param  {Object} `options` Additional options to pass
 * @return {Array}  a list of pages as Vinyl objects
 */

Page.prototype.array = function (arr, options) {
  return _.flatten(arr.map(function (page) {
    return this.normalize(page, options);
  }.bind(this)));
};


module.exports = Page;
