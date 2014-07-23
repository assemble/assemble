'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');


/**
 * Local dependencies.
 */

var Layout = require('./layout');
var utils = require('../utils');


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

  var fileExt = file.ext || path.extname(file.src) || path.extname(file.path);
  var ext = this.ext = fileExt || assemble.get('ext');
  this.defaultEngine = assemble.get('view engine') || assemble.get('defaultEngine');

  // this can happen in `minimal` mode
  if (!ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  if (this.defaultEngine[0] !== '.') {
    this.defaultEngine = '.' + this.defaultEngine;
  }
  if (!ext) {
    file.path += (ext = this.ext = this.defaultEngine);
  }

  this.engine = (engines[ext] || engines[this.defaultEngine]);
  this.encoding = this.assemble.get('encoding');

  // assemble doesn't really need to be passed here because
  // an instance has already been created.
  var layout = new Layout(assemble);

  // Get layout based on the current engine.
  this.layout = layout.get(ext);
  this.partials = assemble.partials;
  this.helpers = assemble.helpers();
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
 * @param  {Object} `options` Options and context to pass to views.
 * @param  {Function} `cb` function that receives the Vinyl file after rendering
 * @api public
 */

View.prototype.render = function (options, cb) {
  if (this.layout) {
    var layout = this.layout.render(this.file);
    this.file.data = _.extend({}, layout.data, this.file.data);
    this.file.contents = layout.contents;
    this.file.orig = layout.orig;
  }

  options = _.extend({}, this.options, options);
  var settings = this.settings(this.options.settings || {});
  var opts = _.extend({}, settings, options, this.file.data);

  var str = this.file.contents.toString(this.encoding);
  this.engine.render(str, opts, function (err, contents, ext) {
    if (err) {
      cb(err);
    }

    ext = this.engine.outputFormat || options.ext || ext;
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }

    this.file.path = gutil.replaceExtension(this.file.path, ext);
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
  settings = settings || {};

  // Allow a function to be passed to rename partial keys.
  var fn = settings.key;
  var results = {
    partials: this._normalizePartials(fn),
    helpers: this.helpers
  };
  results = _.extend({}, this.options, results, settings);
  return results;
};


/**
 * ## ._normalizePartials
 *
 * Return the partials in a format that engines understand
 *
 * **Example:**
 *
 * ```js
 * var partials = this._normalizePartials();
 * //=> {
 * //=>   'foo': 'this is a foo partial',
 * //=>   'bar': 'this is a bar partial'
 * //=> }
 * ```
 *
 * @param  {Function} `fn` renaming function to identify partial
 * @return {Object} The normalized partials object
 * @api private
 */

View.prototype._normalizePartials = function (fn) {
  fn = fn || function (key) {
    return path.basename(key, path.extname(key));
  };
  var partials = {};
  _.forOwn(this.partials, function (partial, key) {

    // `key` is most likely a filepath
    partials[fn(key)] = partial.contents.toString(this.encoding);
  }.bind(this));
  return partials;
};


/**
 * Expose `View`
 */

module.exports = View;