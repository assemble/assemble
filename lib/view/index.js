'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var path = require('path');
var glob = require('globby');
var file = require('fs-utils');
var isAbsolute = require('is-absolute');
var utils = require('../utils');


/**
 * ## View
 *
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default view engine name
 *   - `engines` view engine `require()` cache
 *   - `cwd` current working directory for view lookup
 *
 * @param {String} `filepath`
 * @param {Object} `options`
 * @api private
 */

function View(filepath, options) {
  options = options || {};
  this.filepath = filepath;
  this.cwd = options.cwd;
  var engines = options.engines;

  var ext = this.ext = path.extname(filepath);
  this.defaultEngine = options.defaultEngine;

  // this can happen in `minimal` mode
  if (!ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }
  if (!ext) {
    filepath += (ext = this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine);
  }

  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)));
  this.filepath = this.lookup(filepath);
}


/**
 * Lookup a view by the given `filepath`
 *
 * @param {String} `filepath`
 * @return {String}
 * @api private
 */

View.prototype.lookup = function (filepath) {
  var cwd = this.cwd;

  if (!isAbsolute(filepath)) {
    if (file.exists(path.join(cwd, filepath))) {
      return path.join(cwd, filepath);
    } else if (file.exists(path.resolve(cwd, filepath))) {
      return path.resolve(cwd, filepath);
    }
  }
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
 * view.cache('src/views/partials/*.hbs');
 * ```
 *
 * @param  {Array|String} `patterns` File path(s) or glob patterns.
 * @param  {Array} `options`
 * @return {Array}
 * @api public
 */

View.prototype.cache = function (patterns, options) {
  this.options = _.extend({}, this.options, options);
  if (typeof patterns === 'string' && isAbsolute(patterns)) {
    if (this._cache.hasOwnProperty(patterns)) {
      return this._cache[patterns];
    }
    return this.compileFile(patterns, this.options);
  }

  glob.sync(patterns, this.options).forEach(function (filepath) {
    this.cache(this.view.lookup(filepath), options);
  }.bind(this));
  return this;
};


/**
 * ## .compile
 *
 * Compile a view string.
 *
 * **Example:**
 *
 * ```js
 * view.compile('<%= foo %>');
 * ```
 *
 * @param  {String} `str` The actual view string.
 * @param  {String} `settings` Delimiters to pass to Lo-dash.
 * @return {String}
 * @api public
 */

View.prototype.compile = function (str, options) {
  this.options = _.extend({}, this.options, options);
  var settings = this._delims(this.options.settings);
  var fn = options.fn || utils.parseFile;
  var obj = fn(str);
  obj.content = this.engine(obj.content, null, settings);
  return obj;
};


/**
 * ## .compileFile
 *
 * Compile a view from a filepath.
 *
 * **Example:**
 *
 * ```js
 * view.compileFile('views/index.tmpl');
 * ```
 *
 * @param  {String} `filepath`
 * @param  {Object} `options`
 * @return {String}
 * @api public
 */

View.prototype.compileFile = function (filepath, options) {
  var str = file.readFileSync(this.view.lookup(filepath));
  return this._cache[filepath] = this.compile(str, options);
};


/**
 * ## .render
 *
 * Render a view with the given context.
 *
 * **Example:**
 *
 * ```js
 * view.render('<%= a %>', {a: 'b'});
 * ```
 *
 * @param  {String|Function} The `function`, `filepath` or `string` to render.
 * @param  {Object} `context` Options and context to pass to views.
 * @return {String} The final string.
 * @api public
 */

View.prototype.render = function (filepath, context) {
  this.options = _.extend({}, this.options, context);
  var str = filepath; // store a reference

  filepath = this.view.lookup(filepath);
  if (this._cache[filepath]) {
    return this._cache[filepath](this.options);
  }
  try {
    return this.cache(filepath, this.options)(this.options);
  } catch (err) {
    return this.compile(str, this.options)(this.options);
  }
};


/**
 * ## .render
 *
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} `options`
 * @param {Function} `fn`
 * @api private
 */

// View.prototype.render = function (options, callback) {
//   this.engine.render(this.filepath, options, callback);
// };


/**
 * ## .renderFile
 *
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} `options`
 * @param {Function} `fn`
 * @api private
 */

// View.prototype.renderFile = function (options, callback) {
//   if (typeof this.engine.renderFile !== 'function') {
//     throw new Error('file rendering not supported by "' + this.ext + '" engine');
//   }
//   this.engine.renderFile(this.filepath, options, callback);
// };


/**
 * Expose `View`
 */

module.exports = View;



//var view = new View();

//console.log(view.cache('../../test/fixtures/includes/*.hbs'));