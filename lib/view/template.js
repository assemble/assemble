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
var parseFile = require('../utils/parse').parseFile;
var parseString = require('../utils/parse').parseString;
var utils = require('../utils');



/**
 * ## Template
 *
 * Create a new instance of `Template` with the given `name`.
 *
 * **Example:**
 *
 * ```js
 * var Template = require('./template');
 * var cache = new Template( {}, options );
 * ```
 *
 * @class `Template`
 * @param {Object} `options` Options to pass to [delims] and [Lo-Dash][lodash]
 */

function Template(cache, options) {
  this.options = options || {};
  this.options.cwd = this.options.cwd || process.cwd();
  this.options.delims = this.options.delims || ['---', '---'];
  this.engine = this.options.engine || _.template;

  this.templates = cache || {};
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
 * Lookup a template by the given `filepath`
 *
 * @param {String} `filepath`
 * @return {String}
 * @api private
 */

Template.prototype.lookup = function (filepath) {
  return lookupPath(filepath);
};


/**
 * ## .cache
 *
 * Cache a `template` or templates. Can be a filepath, array of filepaths,
 * or glob patterns.
 *
 * **Example:**
 *
 * ```js
 * var templates = new Template(options);
 * templates.cache('src/templates/*.hbs');
 * ```
 *
 * @param  {Array|String} `patterns` File path(s) or glob patterns.
 * @param  {Array} `options`
 * @return {Object} return parsed object if exists or current instance of `Template`
 * @api public
 */

Template.prototype.cache = function (patterns, options) {
  if (_.isEmpty(patterns)) {
    return this;
  }

  this.options = _.extend({}, this.options, options);
  if (typeof patterns === 'string' && isAbsolute(patterns)) {
    if (this.templates.hasOwnProperty(patterns)) {
      return this.templates[patterns];
    }
    return this.setFile(patterns, options);
  }

  patterns = _.unique(arrayify(patterns).map(function(filepath) {
    return path.normalize(filepath);
  }));

  // Expand file paths with [globby], then cache the file if it exists
  glob.sync(patterns, this.options).forEach(function (filepath) {
    if (this.templates.hasOwnProperty(filepath)) {
      return this.templates[filepath];
    }
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
 * templates.set('path/to/foo.hbs', '<%= foo %>');
 * ```
 *
 * @chainable
 * @param  {String} `key` The name of the template. Typically a full file path, but can also be a name.
 * @param  {String} `str` The actual template string.
 * @param  {Object} `options` options to pass to [gray-matter]
 * @return {Object} this for chaining
 * @api public
 */

Template.prototype.set = function (key, str, options) {
  this.templates[key] = this.parse(key, str, options);
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
 * templates.setFile('templates/index.tmpl');
 * ```
 *
 * @chainable
 * @param  {String} `filepath`
 * @param  {Object} `options`
 * @api private
 */

Template.prototype.setFile = function (filepath, options) {
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
 * var foo = templates.get('path/to/foo.hbs');
 * ```
 *
 * @chainable
 * @param  {String} `key` The name of the template. Typically a full file path, but can also be a name.
 * @return {Object} parsed template object
 * @api public
 */

Template.prototype.get = function (key) {
  if (!key) {
    return this.templates;
  }
  return this.templates[key];
};


/**
 * ## .parse
 *
 * Parse the file into an object using [gray-matter].
 *
 * @param  {String} `name` The name of the template or a filepath of the file to parse.
 * @param  {String} `str` Optional string to parse. If this is passed, `name` probably shouldn't be a file path.
 * @param  {Object} `options`
 * @return {Object}
 */

Template.prototype.parse = function (name, str, options) {
  if (arguments.length === 2) {
    if (utils.typeOf(str) === 'object') {
      options = str;
      str = null;
    }
  }

  options.filepath = name;
  return str
    ? parseString(str, options)
    : parseFile(name, options);
};


/**
 * Expose `Template`.
 */

module.exports = Template;