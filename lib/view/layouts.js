'use strict';

var delims = require('delims');
var isFalsey = require('falsey');
var File = require('vinyl');
var _ = require('lodash');


/**
 * ## Layouts
 *
 * A new instance of `Layouts` is created for each template engine
 * that has been defined.
 *
 * **Example:**
 *
 * ```js
 * var layouts = new Layouts(options);
 * ```
 *
 * {%= docs("layouts") %}
 *
 * @class `Layouts`
 * @param {Object} `options` global options for how to determine layouts.
 * @returns {Layouts} new `Layouts` instance
 * @constructor
 */

function Layouts(options) {
  if (!this instanceof Layouts) {
    return new Layouts(options);
  }

  var defaults = {
    delims: ['{{', '}}'],
    tag: '{{ body }}',
    re: '\\s*body\\s*',
    flags: 'gi',
    beginning: '',
    end: '',
    body: ''
  };

  this.layoutStack = {};
  this.options = _.extend({}, defaults, options);
  this.options.matter = this.options.re;
  this.tag = this.options.tag;
  this.regex = delims(this.options.delims, this.options).evaluate;
}


/**
 * ## .set
 *
 * Store a layout.
 *
 * @param {String} `name` name of the layout to store.
 * @param {Object} `layout` object containing `data` and `content` properties.
 */

Layouts.prototype.set = function (name, layout) {
  this.layoutStack[name] = layout;
  return this;
};


/**
 * ## .get
 *
 * Return a stored layout.
 *
 * @param {String} `name` name of the layout
 * @returns {Object} object containing `data` and `content` properties.
 */

Layouts.prototype.get = function (name) {
  return this.layoutStack[name];
};


/**
 * ## .assertLayout
 *
 * Return a valid layout name if one should be used, otherwise, returns `null`
 * to indicate a layout should not be used.
 *
 * @param {String} `layout` layout to use, or a negative value to not use a layout
 * @returns {*} either a valid layout name or null
 */

Layouts.prototype.assertLayout = function (layout) {
  if (!layout || isFalsey(layout)) {
    return null;
  }
  return layout;
};


/**
 * ## .createStack
 *
 * Create a layout stack based on options and layout data. Returned stack is
 * an array with the layouts to use going from the top level parent to the
 * lowest level child.
 *
 * @param {String|Boolean|Falsey} `name` or falsey value used to determine the layout to use.
 * @returns {Array} `stack` parent => child layouts.
 */

Layouts.prototype.createStack = function (name) {
  name = this.assertLayout(name);
  var layout = null;
  var stack = [];

  while (name && (layout = this.get(name))) {
    stack.unshift(name);
    name = this.assertLayout(layout.data && layout.data.layout);
  }
  return stack;
};


/**
 * ## .injectLayout
 *
 * Injects the inner content into the outer content based on the body regex
 *
 * @param {String} `outer` content that wraps the inner content
 * @param {String} `inner` content to be injected into the outer content
 * @returns {String} resulting content
 * @api private
 */

Layouts.prototype.injectLayout = function (outer, inner) {
  var innerLayout = inner.toString('utf8');
  var outterLayout = outer.toString('utf8')
    .replace(this.regex, innerLayout);
  return new Buffer(outterLayout);
};


/**
 * ## .render
 *
 * Flatten and render the entire layout stack based on the `file` and `options`
 * and how the layout stack is defined.
 *
 * @param {Object} `file` object containing `data` and `contents` properties.
 * @param {Object} `options` additional options to override `global` and/or `file` options
 * @returns {String} rendered template
 */

Layouts.prototype.render = function (file, options) {
  var opts = _.extend({}, this.options, file.data, options);
  var stack = this.createStack(opts.layout);

  // Setup the object to be returned, and store file.contents on `orig`
  var results = new File({contents: new Buffer(this.tag)});
  results.data = _.extend({}, file.data, file.locals);
  results.orig = file.contents;

  // loop over the layout stack building the context and content
  results = stack.reduce(function (acc, name) {
    var layout = this.get(name);
    _.extend(acc.data, layout.data);
    acc.contents = this.injectLayout(acc.contents, layout.contents);
    return acc;
  }.bind(this), results);

  // Pass the accumlated, final results
  _.extend(results.data, file.data);
  results.contents = this.injectLayout(results.contents, file.contents);
  return results;
};


module.exports = Layouts;