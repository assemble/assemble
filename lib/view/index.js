'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var utils = require('../utils');
var path = require('path');

var noop = function (str, options, cb) {
  cb(null, str, this.ext);
};

/**
 * ## View
 *
 * Initialize a new `View` with the given `file`.
 *
 * Options:
 *
 *   - `defaultEngine` the default view engine name
 *
 * @param {Object} `file` Vinyl object containing file information
 * @param {Object} `assemble` main assemble instance used to get information from assemble
 * @param {Object} `options` additional options including the `defaultEngine`
 * @api private
 */

function View(file, assemble, options) {
  this.file = file;
  this.assemble = assemble;
  this.options = options || {};

  var engines = assemble.engines;

  var ext = this.ext = path.extname(file.path);
  this.defaultEngine = options.defaultEngine;

  // this can happen in `minimal` mode
  if (!ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }
  if (!ext) {
    file.path += (ext = this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine);
  }

  this.engine = engines[ext] || noop;
  this.partials = assemble.partials;
  this.layouts = assemble.layouts;
}


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
 * @param  {String|Function} The `function`, `file` or `string` to render.
 * @param  {Object} `context` Options and context to pass to views.
 * @return {String} The final string.
 * @api public
 */

View.prototype.render = function (options, cb) {
  this.options = _.extend({}, this.options, options);
  var settings = this.settings(this.options.settings);
  this.engine(this.file.contents.toString(this.assemble.get('encoding')), settings, function (err, contents, ext) {
    if (err) {
      cb(err);
    }
    this.file.contents = new Buffer(contents);
    cb(null, this.file, ext);
  }.bind(this));
};


/**
 * ## .settings
 *
 * Generate the settings needed to pass into the engine for rendering.
 *
 * **Example:**
 *
 * ```js
 * var settings = this.settings(this.options.settings);
 * ```
 *
 * @param  {Object} `settings` Additional settings to extend.
 * @return {Object} The complete settings.
 * @api private
 */

View.prototype.settings = function (settings) {
  var results = {};
  results.partials = this.partials;
  results.helpers = this.helpers;
  results = _.extend(results, this.options, settings);
  return results;
};


/**
 * Expose `View`
 */

module.exports = View;