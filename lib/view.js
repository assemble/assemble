'use strict';

/**
 * Module dependencies.
 */

var parsePath = require('parse-filepath');
var gutil = require('gulp-util');
var path = require('path');
var _ = require('lodash');


/**
 * Private variables
 */

var File = gutil.File;

/**
 * ## View
 *
 * Initialize a new `View`.
 *
 * Options:
 *
 *   - `defaultEngine` the default view engine name
 *   - `engines` list of available engines
 *
 * @param {Object} `file` object containing file information
 * @param {Object} `options` additional options
 * @api public
 */

function View(file, options) {
  File.call(this, file);
  this.init(options);
}

require('util').inherits(View, File);

View.prototype.init = function (options) {

  // initial options
  this.options = options || {};
  this.engines = this.options.engines || {};
  this.encoding = this.options.encoding;

  // setup path information
  this.parsePath();
  this.defaultEngine = this.options.defaultEngine || this.ext;


  // this can happen in `minimal` mode
  if (!this.ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  if (this.defaultEngine[0] !== '.') {
    this.defaultEngine = '.' + this.defaultEngine;
  }

  // // this is setup if `file.path` was originally passed as just a name
  // if (!this.ext) {
  //   this.path += (this.ext = this.defaultEngine);
  // }

};

View.prototype.parsePath = function () {

  var parsed = parsePath(this.path);
  // Add path properties to the `this` object
  for (var key in parsed) {
    if (parsed.hasOwnProperty(key)) {
      this[key] = parsed[key];
    }
  }

  this.src = this.path;
  this.dest = this.src;
  this.ext = this.options.ext || path.extname(this.src);
  this.cwd = this.options.cwd || this.cwd;

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
 * @param  {Object} `options` Options and context to pass to views.
 * @param  {Function} `cb` function that receives the Vinyl file after rendering
 * @api public
 */

View.prototype.render = function (options, cb) {

  // get the engine needed for rendering based
  // on the current extension
  var engine = (this.engines[this.ext] || this.engines[this.defaultEngine]);

  // if a layout exists on this view
  // replace the view information with the layout information
  if (this.layout) {
    this.data = _.extend({}, this.layout.data, this.data);
    this.contents = this.layout.contents;
    this.orig = this.layout.orig;
  }

  // merge options
  // partials and helpers are expected to be passed in
  options = _.extend({}, this.options, options, this.data);
  var str = this.contents.toString(this.encoding);

  // call the engine to render the view
  engine.render(str, options, function (err, contents, ext) {
    if (err) {
      cb(err);
    }

    ext = engine.outputFormat || options.ext || ext;
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }
    this.contents = new Buffer(contents);
    cb(null, this, ext);
  }.bind(this));
};


/**
 * ## ._normalizePartials
 *
 * Return the partials in a format that engines understand
 *
 * **Example:**
 *
 * ```js
 * var partials = this.partials(assemble.partials);
 * //=> {
 * //=>   'foo': 'this is a foo partial',
 * //=>   'bar': 'this is a bar partial'
 * //=> }
 * ```
 *
 * @param {Object} `partials` object of key => View objects to normalize
 * @param  {Function} `fn` renaming function to identify partial
 * @return {Object} The normalized partials object
 * @api private
 */

View.prototype.partials = function (partials, fn) {
  fn = fn || function (key) {
    return path.basename(key, path.extname(key));
  };
  _.forOwn(partials, function (partial, key) {
    // `key` is most likely a filepath
    partials[fn(key)] = partial.contents.toString(this.encoding);
  }.bind(this));
  return partials;
};


/**
 * Expose `View`
 */

module.exports = View;