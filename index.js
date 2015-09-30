'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Templates = require('templates');
var plugin = require('./lib/plugins');
var utils = require('./lib/utils');

/**
 * Create an `assemble` application. This is the main function exported
 * by the assemble module.
 *
 * ```js
 * var assemble = require('assemble');
 * var app = assemble();
 * ```
 * @param {Object} `options` Optionally pass default options to use.
 * @api public
 */

function Assemble(options) {
  if (!(this instanceof Assemble)) {
    return new Assemble(options);
  }
  Templates.apply(this, arguments);
  this.options = options || {};
  this.init(this);
}

/**
 * `Assemble` prototype methods
 */

Templates.extend(Assemble, {
  constructor: Assemble,

  /**
   * Initialize Assemble defaults
   */

  init: function(app) {
    this.define('isAssemble', true);
    this.use(plugin.vinyl());
    this.use(plugin.composer());
    this.use(plugin.collections());
    this.use(plugin.reloadViews());
    this.use(plugin.generate());
    this.use(plugin.process());

    /**
     * Default template engine and related extensions.
     */

    this.engine(['hbs', 'html', 'md'], utils.engine);

    /**
     * Default middleware for parsing front matter
     */

    this.onLoad(/\.(hbs|md|html)$/, function (view, next) {
      utils.matter.parse(view, next);
    });
  },

  /**
   * Copy files with the given glob `patterns` to the specified `dest`.
   *
   * ```js
   * app.task('assets', function() {
   *   app.copy('assets/**', 'dist/');
   * });
   * ```
   * @name .copy
   * @param {String|Array} `patterns` Glob patterns of files to copy.
   * @param  {String|Function} `dest` Desination directory.
   * @return {Stream} Stream, to continue processing if necessary.
   * @api public
   */

  copy: function(patterns, dest, options) {
    return utils.vfs.src(patterns, options)
      .pipe(utils.vfs.dest(dest, options));
  },

  /**
   * Push a view collection into a vinyl stream.
   *
   * ```js
   * app.toStream('posts', function(file) {
   *   return file.path !== 'index.hbs';
   * })
   * ```
   * @name .toStream
   * @param {String} `collection` The name of the view collection to push into the stream.
   * @param {Function} Optionally pass a filter function to use for filtering views.
   * @return {Stream}
   * @api public
   */

  toStream: function (name) {
    var views = this.getViews(name) || {};
    var stream = utils.through.obj();
    setImmediate(function () {
      Object.keys(views).forEach(function (key) {
        stream.write(views[key]);
      });
      stream.end();
    });
    return utils.srcStream(stream);
  },

  /**
   * Render a vinyl file.
   *
   * ```js
   * app.src('*.hbs')
   *   .pipe(app.renderFile());
   * ```
   *
   * @name .renderFile
   * @param  {Object} `locals` Optionally locals to pass to the template engine for rendering.
   * @return {Object}
   * @api public
   */

  renderFile: function (locals) {
    var app = this;
    var collection = this.collection();
    return utils.through.obj(function (file, enc, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }

      var view = collection.setView(file);
      app.handleView('onLoad', view);

      var ctx = utils.merge({}, app.cache.data, locals, view.data);
      app.render(view, ctx, function (err, res) {
        if (err) return cb(err);
        file = new utils.Vinyl(res);
        cb(null, file);
      });
    });
  }
});

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
