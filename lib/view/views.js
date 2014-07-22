'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var path = require('path');
var glob = require('globby');
var file = require('fs-utils');
var isAbsolute = require('is-absolute');
var lookupPath = require('lookup-path');
var arrayify = require('arrayify-compact');
var parseFile = require('../utils/file').parseFile;
var parseString = require('../utils/file').parseString;


/**
 * ## Views
 *
 * Create a new instance of `Views` with the given `name`.
 *
 * **Example:**
 *
 * ```js
 * var Views = require('./views');
 * var cache = new Views( options );
 * ```
 *
 * @class `Views`
 * @param {Object} `options` Options to pass to [delims] and [Lo-Dash][lodash]
 */

function Views(cache, options) {
  this.options = options || {};
  this.options.cwd = this.options.cwd || process.cwd();
  this.options.delims = this.options.delims || ['<%', '%>'];

  this.engine = this.options.engine || _.template;

  this._cache = cache || {};
  this.defaults = {
    body: '',
    beginning: '',
    end: '',
    flags: 'g',
    noncapture: false,
    escape: true
  };
}


/**
 * Lookup a view by the given `filepath`
 *
 * @param {String} `filepath`
 * @return {String}
 * @api private
 */

Views.prototype.lookup = function (filepath) {
  return lookupPath(filepath);
};


/**
 * ## .cache
 *
 * Cache a view or views. Can be a filepath, array of filepaths,
 * or glob patterns.
 *
 * **Example:**
 *
 * ```js
 * var viewCache = new Views(options);
 * viewCache.cache('src/views/viewCache/*.hbs');
 * ```
 *
 * @param  {Array|String} `patterns` File path(s) or glob patterns.
 * @param  {Array} `options`
 * @return {Object} return parsed object if exists or current instance of `Views`
 * @api public
 */

Views.prototype.cache = function (patterns, options) {
  if (_.isEmpty(patterns)) {
    return this;
  }

  this.options = _.extend({}, this.options, options);
  if (typeof patterns === 'string' && isAbsolute(patterns)) {
    if (this._cache.hasOwnProperty(patterns)) {
      return this._cache[patterns];
    }
    return this.setFile(patterns, options);
  }

  // Expand file paths with [globby]
  glob.sync(arrayify(patterns), this.options).forEach(function (filepath) {

    // Lookup the file to ensure it exists, then cache it.
    this.cache(this.lookup(filepath), options);
  }.bind(this));
  return this;
};


/**
 * ## .set
 *
 * Adds a template to the cache
 *
 * **Example:**
 *
 * ```js
 * viewCache.set('path/to/foo.hbs', '<%= foo %>');
 * ```
 *
 * @chainable
 * @param  {String} `key` The name of the template. Typically a full file path, but can also be a name.
 * @param  {String} `str` The actual template string.
 * @param  {Object} `options` options to pass to [gray-matter]
 * @return {Object} this for chaining
 * @api public
 */

Views.prototype.set = function (key, str, options) {
  this._cache[key] = this.parse(key, str, options);
  return this;
};


/**
 * ## .setFile
 *
 * Reads a template from a file and sets it
 *
 * **Example:**
 *
 * ```js
 * viewCache.setFile('templates/index.tmpl');
 * ```
 *
 * @chainable
 * @param  {String} `filepath`
 * @param  {Object} `options`
 * @api private
 */

Views.prototype.setFile = function (filepath, options) {
  var str = file.readFileSync(this.lookup(filepath));
  return this.set(filepath, str, options);
};


/**
 * ## .get
 *
 * Gets a template from the cache
 *
 * **Example:**
 *
 * ```js
 * var foo = viewCache.get('path/to/foo.hbs');
 * ```
 *
 * @chainable
 * @param  {String} `key` The name of the template. Typically a full file path, but can also be a name.
 * @return {Object} parsed template object
 * @api public
 */

Views.prototype.get = function (key) {
  if (!key) {
    return this._cache;
  }
  return this._cache[key];
};


/**
 * ## .parse
 *
 * Parse the file into an object using [gray-matter].
 *
 * @param  {String} `name` The name of the view or a filepath of the file to parse.
 * @param  {String} `str` Optional string to parse. If this is passed, `name` probably shouldn't be a file path.
 * @param  {Object} `options`
 * @return {Object}
 */

Views.prototype.parse = function (name, str, options) {
  if (arguments.length === 2) {
    if (utils.typeof(str) === 'object') {
      options = str;
      str = null;
    }
  }
  options.filepath = options.filepath || name;
  return str ? parseString(str, options) : parseFile(name, options);
};


/**
 * Expose `Views`.
 */

module.exports = Views;