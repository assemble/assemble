'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var file = require('fs-utils');
var isAbsolute = require('is-absolute');


var noop = function (str) {
  return {
    data: {},
    content: str,
    orig: str
  };
};


/**
 * ## View
 *
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine `require()` cache
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
  this.path = this.lookup(filepath);
}


/**
 * Lookup view by the given `path`
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

View.prototype.lookup = function (filepath) {
  var ext = this.ext;

  // <filepath>.<engine>
  if (!isAbsolute(filepath)) {
    filepath = path.join(this.cwd, filepath);
  }
  if (file.exists(filepath)) {
    return filepath;
  }

  // <filepath>/index.<engine>
  filepath = path.join(path.dirname(filepath), path.basename(filepath, ext), 'index' + ext);
  if (file.exists(filepath)) {
    return filepath;
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

View.prototype.render = function (options, callback) {
  this.engine.render(this.filepath, options, callback);
};


/**
 * ## .renderFile
 *
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} `options`
 * @param {Function} `fn`
 * @api private
 */

View.prototype.renderFile = function (options, callback) {
  if (typeof this.engine.renderFile !== 'function') {
    throw new Error('file rendering not supported by "' + this.ext + '" engine');
  }
  this.engine.renderFile(this.filepath, options, callback);
};


/**
 * Expose `View`
 */

module.exports = View;
