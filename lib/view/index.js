'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var utils = require('../utils');
var path = require('path');
var Layouts = require('assemble-layouts');

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
  this.defaultEngine = options.defaultEngine;

  // this can happen in `minimal` mode
  if (!ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }
  if (!ext) {
    file.path += (ext = this.ext = (this.defaultEngine[0] !== '.' ? '.' : '') + this.defaultEngine);
  }

  this.engine = (engines[ext] || noopEngine).render;
  this.partials = assemble.partials();
  this.layouts = assemble.layouts();
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
  var file = this._processLayouts(this.options);
  var settings = _.extend({}, this.settings(this.options.settings), file.data);

  var str = file.contents.toString(this.assemble.get('encoding'));
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
  var results = {
    partials: this._normalizePartials(),
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
 * //=> { 'foo': 'this is a foo partial' }
 * ```
 *
 * @return {Object} The normalized partials object
 * @api private
 */

View.prototype._normalizePartials = function () {
  var partials = {};
  _.forOwn(this.partials, function (partial, key) {
    partials[path.basename(key, path.extname(key))] = partial.contents.toString(this.assemble.get('encoding'));
  }.bind(this));
  return partials;
};


/**
 * ## ._processLayouts
 *
 * Process the layout stack based on file locals.
 *
 * **Example:**
 *
 * ```js
 * var file = this._processLayouts(options);
 * //=> { contents: '<html><head><title>{{title}}</title></head><body>{{body}}</body></html>' }
 * ```
 *
 * @return {Object} File with processed templates
 * @api private
 */

View.prototype._processLayouts = function (options) {
  var layouts = new Layouts(_.extend({layout: 'default'}, options));
  _(this.layouts).forEach(function (layout, name) {
    layouts.set(path.basename(name, path.extname(name)), layout);
  });
  return layouts.render(this.file);
};


/**
 * Expose `View`
 */

module.exports = View;