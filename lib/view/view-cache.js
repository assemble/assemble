'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var glob = require('globby');
var file = require('fs-utils');
var isAbsolute = require('is-absolute');
var _ = require('lodash');
var parse = require('../utils/file');


/**
 * ## ViewCache
 *
 * Create a new instance of `ViewCache` with the given `name`.
 *
 * **Example:**
 *
 * ```js
 * var ViewCache = require('./view-cache');
 * var cache = new ViewCache( options );
 * ```
 *
 * @class `ViewCache`
 * @param {Object} `options` Options to pass to [delims] and [Lo-Dash][lodash]
 */

function ViewCache(cache, options) {
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

ViewCache.prototype.lookup = function (filepath) {
  var cwd = this.options.cwd;

  if (!isAbsolute(filepath)) {
    if (file.exists(path.join(cwd, filepath))) {
      return path.join(cwd, filepath);
    } else if (file.exists(path.resolve(cwd, filepath))) {
      return path.resolve(cwd, filepath);
    }
  }
  return filepath;
};

ViewCache.prototype.parse = function (filepath, str, options) {
  return parse(filepath, str, options);
};


/**
 * ## .cache
 *
 * Cache a view or views. Can be a filepath, array of filepaths or glob
 * patterns.
 *
 * **Example:**
 *
 * ```js
 * var partials = new ViewCache(options);
 * partials.cache('src/views/partials/*.hbs');
 * ```
 *
 * @param  {Array|String} `patterns` File path(s) or glob patterns.
 * @param  {Array} `options`
 * @return {Object} return parsed object if exists or current instance of `ViewCache`
 * @api public
 */

ViewCache.prototype.cache = function (patterns, options) {
  if (typeof patterns === 'undefined') {
    return this;
  }
  this.options = _.extend({}, this.options, options);
  if (typeof patterns === 'string' && isAbsolute(patterns)) {
    if (this._cache.hasOwnProperty(patterns)) {
      return this._cache[patterns];
    }
    return this.setFile(patterns, options);
  }

  glob.sync(patterns, this.options).forEach(function (filepath) {
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
 * partials.set('path/to/foo.hbs', '<%= foo %>');
 * ```
 *
 * @param  {String} `key` The name of the template. Typically the full file path.
 * @param  {String} `str` The actual template string.
 * @param  {Object} `options` options to pass to [gray-matter]
 * @return {Object} this for chaining
 * @chainable
 * @api public
 */

ViewCache.prototype.set = function (key, str, options) {
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
 * partials.setFile('templates/index.tmpl');
 * ```
 *
 * @param  {String} `filepath`
 * @param  {Object} `options`
 *  @param {String} [option] `autodetect` default to `true`
 * @return {Object} this for chaining
 * @chainable
 * @api public
 */

ViewCache.prototype.setFile = function (filepath, options) {
  var str = file.readFileSync(filepath);
  return this.set(filepath, str, options);
};


/**
 * Expose `ViewCache`.
 */

module.exports = ViewCache;