'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');


/**
 * ## View
 *
 * Initialize a new `View`.
 *
 * Options:
 *
 *   - `defaultEngine` the default view engine name
 *   - `engines` list of available engines
 *   - `encoding` the encoding to use. Defaults to `utf8`.
 *
 * @param {Object} `file` object containing file information
 * @param {Object} `options` additional options
 * @api public
 */

function View(file, options) {
  this.encoding = options.encoding || 'utf8';
  this.engines = options.engines || {};
  this.layouts = options.layouts || {};
  this.options = options || {};


  this.file = file;
  this.ext = this.file.ext;
  this.defaultEngine = options.defaultEngine || this.ext;

  // this can happen in `minimal` mode
  if (!this.ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }


  if (this.defaultEngine && this.defaultEngine[0] !== '.') {
    this.defaultEngine = '.' + this.defaultEngine;
  }

  // this is setup if `file.path` was originally passed as just a name
  if (!this.ext) {
    this.path += (this.ext = this.defaultEngine);
  }

  // get the engine needed for rendering based on the current extension
  this.engine = (this.engines[this.ext] || this.engines[this.defaultEngine] || this.engines['.*']);
  this.layout = (this.layouts[this.ext] || this.layouts[this.defaultEngine]);
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
  var engine = this.engine;

  // if a layout exists on this view
  // replace the view information with the layout information
  if (this.layout) {
    var str = this.file.contents.toString(this.encoding);
    var obj = this.layout.inject(str, this.file.layout);
    this.file.data = _.extend({}, obj.data, this.file.data);
    this.file.contents = new Buffer(obj.content);
  }


  /**
   *   - context method
   *   - partials and helpers are expected to be passed in
   *
   */

  var opts = _.extend({}, this.options, engine.options, options, this.file.data);

  // call the engine to render the view
  engine.render(str, opts, function (err, contents, ext) {
    if (err) {
      cb(err);
    }
    ext = engine.outputFormat || options.ext || ext;
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }
    this.file.contents = new Buffer(contents);
    cb(null, this.file, ext);
  }.bind(this));
};


/**
 * Expose `View`
 */

module.exports = View;