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
 * ## .add
 *
 * Cache a `template` or templates. Can be a filepath, array of filepaths,
 * or glob patterns.
 *
 * **Example:**
 *
 * ```js
 * var templates = new Template(options);
 * templates.add('src/templates/*.hbs');
 * ```
 *
 * @param  {Array|String} `patterns` File path(s) or glob patterns.
 * @param  {Array} `options`
 * @return {Object} return parsed object if exists or current instance of `Template`
 * @api public
 */

Template.prototype.add = function (patterns, options) {
  if (_.isEmpty(patterns)) {
    return this;
  }

  if (utils.typeOf(patterns) === 'object') {
    this.setObject(patterns);
    return this;
  }

  var opts = _.extend({}, this.options, options);

  if (typeof patterns === 'string' && isAbsolute(patterns)) {
    if (this.templates.hasOwnProperty(patterns)) {
      return this.templates[patterns];
    }
    return this.setFile(patterns, options);
  }

  var filepaths = [];
  var objects = [];

  arrayify(patterns).forEach(function(filepath) {
    if (utils.typeOf(filepath) === 'object') {
      objects.push(filepath);
    } else {
      filepaths.push(path.normalize(filepath));
    }
  });

  objects.forEach(this.setObject.bind(this));

  // Expand file paths with [globby], then cache the file if it exists
  glob.sync(_.uniq(filepaths), opts).forEach(function (filepath) {
    if (this.templates.hasOwnProperty(filepath)) {
      return this.templates[filepath];
    }
    this.add(this.lookup(filepath), options);
  }.bind(this));

  return this;
};


/**
 * ## .setObject
 *
 * Set an object on the `templates` cache.
 *
 * @param {Object} `obj`
 * @api private
 */

Template.prototype.setObject = function (obj) {
  if (obj.name) {
    this.templates[obj.name] = obj;
    return this;
  }
  _.extend(this.templates, obj);
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
 * @api public
 */

Template.prototype.parse = function (name, str, options) {
  if (arguments.length === 2) {
    if (utils.typeOf(str) === 'object') {
      options = str;
      str = null;
    }
  }

  options = options || {};
  options.filepath = name;
  return str
    ? parseString(str, options)
    : parseFile(name, options);
};


/**
 * Expose `Template`.
 */

module.exports = Template;