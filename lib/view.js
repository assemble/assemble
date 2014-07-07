'use strict';

var path = require('path');
var file = require('fs-utils');
var isAbsolute = require('is-absolute');


/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *
 * @param {String} name
 * @param {Object} options
 * @api private
 */

function View(name, options) {
  options = options || {};
  this.name = name;
  this.root = options.root;
  var engines = options.engines;
  this.defaultEngine = options.defaultEngine || require('assemble-handlebars');
  var ext = this.ext = path.extname(name);
  // this can happen in `minimal` mode
  if (!ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }
  if (!ext) {
    name += (ext = this.ext = ('.' !== this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
  }
  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
  this.path = this.lookup(name);
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
    filepath = path.join(this.root, filepath);
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
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function (options, fn) {
  var engine = this.engine;

  if (typeof engine.renderFile !== 'function') {
    throw new Error('file rendering not supported by "' + this.ext + '" engine');
  }

  engine.renderFile(this.path, options, fn);
};


/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

// View.prototype.render = function (options, fn) {
//   this.engine(this.path, options, fn);
// };


/**
 * Expose `View`.
 */

module.exports = View;