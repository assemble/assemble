'use strict';

/**
 * module dependencies
 */

var path = require('path');
var only = require('emitter-only');
var Templates = require('templates');
var render = require('assemble-render-file');
var stream = require('assemble-stream');
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
    this.use(stream());
    this.use(render());
    this.use(plugin.composer());
    this.use(plugin.collections());
    this.use(plugin.reloadViews());
    this.use(plugin.generate());
    this.use(plugin.process());

    /**
     * Default template engine and related extensions.
     */

    this.option('extensions', ['hbs', 'html', 'md']);

    /**
     * Default template engine and related extensions.
     */

    this.engine(this.options.extensions, utils.engine);

    /**
     * Default middleware for parsing front matter
     */

    this.onLoad(/\.(hbs|md|html)$/, function (view, next) {
      utils.matter.parse(view, next);
    });
  },

  /**
   * Allow events to be registered only once, so
   * that we can reinitialize the application and
   * avoid re-registering the same emitters.
   */

  only: function () {
    return only.apply(this, arguments);
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
      .pipe(utils.vfs.dest(dest, options))
      .on('data', function() {})
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
  }
});

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
