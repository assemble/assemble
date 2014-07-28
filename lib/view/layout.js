'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var Layouts = require('assemble-layouts');
var _ = require('lodash');
var instance = null;


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

function Layout(assemble) {
  if (instance) {
    return instance;
  }
  this.assemble = assemble;
  this.layoutEngine = {};
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
  var opts = _.extend({ext: ext}, options);
  if (opts.ext[0] !== '.') {
    opts.ext = '.' + opts.ext;
  }
  this.layoutEngine[opts.ext] = new Layouts(opts);
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
  this.mapEngine(ext);
  return this.layoutEngine[ext];
};


/**
 * ## .layoutdir
 *
 * Get an existing `Layout` instance by file `ext`
 *
 * **Example:**
 *
 * ```js
 * var layouts = layout.layoutdir('.hbs');
 * file = layouts.render(file);
 * ```
 *
 * @param  {String} `ext` The extension of the layout files to use.
 * @return {Object} instance of `Layout`
 * @api public
 */

// Layout.prototype.layoutdir = function (ext) {
//   if (ext[0] !== '.') {
//     ext = '.' + ext;
//   }
//   this.mapEngine(ext);
//   return this.layoutEngine[ext];
// };


/**
 * ## .mapEngine
 *
 * Map layout files from assemble to the layout engine based on extension.
 *
 * **Example:**
 *
 * ```js
 * layout.mapEngine('.hbs');
 * ```
 *
 * @param  {String} `ext` The extension of the layout files to use.
 * @return {undefined}
 * @api private
 */

Layout.prototype.mapEngine = function (ext) {
  var layouts = _.filter(this.assemble.layouts, function (layout) {
    return layout.extname === ext;
  }).filter(Boolean);

  layouts.forEach(function (layout) {
    var name = path.basename(layout.path, ext);
    if (!this.layoutEngine[ext].get(name)) {
      this.layoutEngine[ext].set(name, layout);
    }
  }.bind(this));
};


/**
 * Expose `Layout`.
 */

module.exports = Layout;