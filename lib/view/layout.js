'use strict';

/**
 * Module dependencies.
 */

var Layouts = require('assemble-layouts');
var path = require('path');
var _ = require('lodash');

/**
 * ## Layout
 *
 * Create a new instance of `Layout`.
 *
 * **Example:**
 *
 * ```js
 * var layout = new Layout( options );
 * ```
 *
 * @class `Layout`
 * @param {Object} `assemble`
 */

var instance = null;
function Layout(assemble) {
  if (instance) {
    return instance;
  }
  this.assemble = assemble;
  this._layouts = {};
  instance = this;
}


/**
 * ## .set
 *
 * Creates a new `Layouts` instance with the given `options`
 * for the given `ext`.
 *
 * **Example:**
 *
 * ```js
 * layout.set('.hbs', options);
 * ```
 *
 * @param  {String} `ext` The extension of the layout files to use.
 * @param  {Object} `options` Options to pass to `Layout`
 * @return {Object} this for chaining
 * @chainable
 * @api public
 */

Layout.prototype.set = function (ext, options) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }
  this._layouts[ext] = new Layouts(_.extend({layout: 'default', ext: ext}, options));
  this._mapLayouts(ext);
  return this;
};


/**
 * ## .get
 *
 * Get an existing `Layout` instance by file `ext`
 *
 * **Example:**
 *
 * ```js
 * var layouts = layout.get('.hbs');
 * file = layouts.render(file);
 * ```
 *
 * @param  {String} `ext` The extension of the layout files to use.
 * @return {Object} instance of `Layout`
 * @api public
 */

Layout.prototype.get = function (ext) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }
  this._mapLayouts(ext);
  return this._layouts[ext];
};


/**
 * ## ._mapLayouts
 *
 * Map layout files from assemble to the layout engine based on extension.
 *
 * **Example:**
 *
 * ```js
 * layout._mapLayouts('.hbs');
 * ```
 *
 * @param  {String} `ext` The extension of the layout files to use.
 * @return {undefined}
 * @api private
 */

Layout.prototype._mapLayouts = function (ext) {
  var layouts = _.filter(this.assemble.layouts(), function (layout) {
    return layout.extname === ext;
  });
  layouts.forEach(function (layout) {
    var key = path.basename(layout.path, ext);
    if (!this._layouts[ext].get(key)) {
      this._layouts[ext].set(key, layout);
    }
  }.bind(this));
};

/**
 * Expose `Layout`.
 */

module.exports = Layout;