'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var debug = require('debug')('assemble:View');


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

function View(file, options, settings) {
  var opts = _.extend({}, options);
  opts.encoding = opts.encoding || 'utf8';

  this.options = opts;
  this.data = opts.data;
  this.settings = settings;

  this.file = file;
  this.ext = this.file.ext || this.file.src.ext;

  // this can happen in `minimal` mode
  if (!this.ext && !opts.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  if (opts.defaultEngine && opts.defaultEngine[0] !== '.') {
    opts.defaultEngine = '.' + opts.defaultEngine;
  }

  // If `file.path` was originally passed as just a name
  if (!this.ext) {
    this.path += (this.ext = opts.defaultEngine);
  }

  // get the engine needed for rendering based on the current extension
  this.engine = (this.options.engines[this.ext] || this.options.engines[opts.defaultEngine]);
  // when no engine is found, use the noop engine and setup
  // the ext so it'll be passed around correctly.
  if (!this.engine) {
    this.engine = opts.engines['.*'];
    this.options.ext = this.ext;
  }

  this.layoutEngine = (opts.layoutEngines[this.ext] || opts.layoutEngines[opts.defaultEngine]);
  this.settings.partials = this.makePartialsObject(this.settings.partials || {});
}


/**
 * Wrap the current `file` with any specified layouts.
 *
 * @api private
 */

View.prototype._applyLayout = function (file, options) {
  var opts = _.extend({}, options);
  opts.data = _.defaults({}, this.data, opts.data);

  file = file || {};

  if (this.layoutEngine) {
    var str = file.contents.toString(this.options.encoding);
    var obj = this.layoutEngine.render(str, file.layout, opts);

    file.data = _.extend({}, obj.data, file.data);
    file.contents = new Buffer(obj.content);
  }
};


/**
 * Update each `partial` object to ensure that it has the
 * correct properties, and is wrapped any layouts defined
 * for that partial.
 *
 * @param  {Object} `partials`
 * @param  {Function} fn
 * @return {[type]}
 */

View.prototype.makePartialsObject = function (partials) {
  var results = {};

  // `name` is most likely a filepath
  _.forOwn(partials, function (partial, name) {
    // let partials use layouts
    if (!partial.hasLayout) {
      this._applyLayout(partial, { defaultLayout: false });
      partial.hasLayout = true;
    }

    if (partial.contents) {
      results[name] = partial.contents.toString(this.options.encoding);
    }
  }.bind(this));

  return results;
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

View.prototype.render = function (cb) {
  var args = [].slice.call(arguments);
  debug('View#render', args);

  var opts = _.extend({}, this.options);
  var engine = this.engine;
  var file = this.file;

  if (!file.hasLayout) {
    this._applyLayout(file, {
      defaultLayout: opts.layout || false
    });
    file.hasLayout = true;
  }

  var o = {};
  o.data = {};

  _.extend(o.data, this.data);
  _.extend(o.data, file.data);

  _.extend(o, engine.options);
  _.extend(o, opts);
  _.extend(o, file);
  _.extend(o, this.settings);

  o.filename = file.path;

  var str = file.contents.toString(this.options.encoding);

  // call the engine to render the view
  engine.render(str, o, function (err, contents, ext) {
    if (err) {
      return cb(err);
    }

    ext = engine.outputFormat || ext || opts.ext;
    if (ext && ext[0] !== '.') {
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
