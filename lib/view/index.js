'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var utils = require('../utils');
var path = require('path');

var Layout = require('./layout');

var noopEngine = {
  render: function (str, options, cb) {
    cb(null, str, this.ext);
  }
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
  this.defaultEngine = this.options.defaultEngine;

  // this can happen in `minimal` mode
  if (!ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }
  if (!ext) {
    file.path += (ext = this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine);
  }

  this.engine = (engines[ext] || noopEngine).render;
  // assemble doesn't really need to be passed here because
  // an instance has already been created.
  this.layouts = new Layout(assemble).get(ext);
  this.partials = assemble.partials();
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
  this.options = _.extend({}, this.options, options);
  if (this.layouts) {
    var layout = this.layouts.render(this.file);
    this.file.locals = _.extend({}, layout.locals, this.file.locals);
    this.file.contents = layout.contents;
    this.file.orig = layout.orig;
  }
  var settings = _.extend(this.settings(this.options.settings), this.file.locals);

  var str = this.file.contents.toString(this.assemble.get('encoding'));
  this.engine(str, settings, function (err, contents, ext) {
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
  settings = settings || {};
  var results = {
    partials: this._normalizePartials(settings.fn),
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
    // key is most likely full filepath
    partials[fn(key)] = partial.contents.toString(this.assemble.get('encoding'));
  }.bind(this));
  return partials;
};


/**
 * Expose `View`
 */

module.exports = View;