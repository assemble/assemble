'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var es = require('event-stream');
var vfs = require('vinyl-fs');
var slice = require('array-slice');
var Task = require('orchestrator');
var Template = require('template');
var _ = require('lodash');

/**
 * Local dependencies
 */

var stack = require('./stack');
var utils = require('./utils');
var session = require('./session');
var middleware = require('./middleware');

/**
 * Initialize a new `Assemble` with the given `context`.
 *
 * ```js
 * var config = new Assemble({foo: 'bar'});
 * ```
 *
 * @class `Assemble`
 * @param {Object} `context`
 * @constructor
 * @api public
 */

function Assemble() {
  var args = slice(arguments);
  Task.apply(this, args);
  Template.apply(this, args);
  this.session = session;
}

_.extend(Assemble.prototype, Task.prototype);
Assemble = Template.extend(Assemble.prototype);

/**
 * Initialize Assemble.
 *
 *   - default configuration
 *   - default middleware
 *   - default config
 *   - default options
 *   - default delimiters
 *   - default routes
 *   - default templates
 *   - default engines
 *
 * @api private
 */

Assemble.prototype.loadDefaults = function() {
  Assemble.__super__.loadDefaults.call(this);
  this.defaultPlugins();
};

/**
 * Initialize default configuration.
 *
 * @api private
 */

Assemble.prototype.defaultOptions = function() {
  Assemble.__super__.defaultOptions.apply(this, arguments);
  this.option('env', process.env.NODE_ENV || 'dev');
  this.option('assets', 'assets');
  this.option('viewEngine', '.hbs');
  this.option('defaults', {
    isRenderable: true,
    isPartial: true,
    engine: '.hbs',
    ext: '.hbs'
  });

  // file extensions
  this.option('engineExts', ['hbs', 'md']);
  this.option('destExt', '.html');
  this.option('ext', '.hbs');

  // view defaults
  this.option('delims', ['{{', '}}']);
  this.option('views', 'templates');
  this.option('templates', 'templates');

  this.disable('default engines');
  this.disable('default routes');

  // routes
  this.enable('case sensitive routing');
  this.enable('strict routing');

  this.option('renameKey', function(filepath) {
    return path.basename(filepath, path.extname(filepath));
  });
};

/**
 * Private method to load default plugins.
 *
 * @api private
 */

Assemble.prototype.defaultPlugins = function() {
  // enable all plugins
  this.disable('minimal config');

  // default `src` plugins
  this.enable('src:init plugin');
  this.enable('src:assets plugin');
  this.enable('src:extend plugin');
  this.enable('src:drafts plugin');
  this.enable('src:paginate plugin');

  // default `dest` plugins
  this.enable('dest:extend plugin');
  this.enable('dest:collections plugin');
  this.enable('dest:paths plugin');
  this.enable('dest:ext plugin');
  this.enable('dest:render plugin');
};

/**
 * Setup default routes and middleware
 */

Assemble.prototype.defaultRoutes = function() {
  Assemble.__super__.defaultRoutes.apply(this, arguments);
  this.onLoad(/./, middleware.props);
  this.onLoad(/./, middleware.parse);
  this.preRender(/./, middleware.assets(this));
};

/**
 * Register a default engine (handlebars)
 */

Assemble.prototype.defaultEngines = function() {
  var exts = this.option('engineExts');
  this.engine(exts, require('engine-assemble'), {
    layoutDelims: ['{%', '%}'],
    destExt: '.html'
  });
};

/**
 * Setup default template types
 */

Assemble.prototype.defaultTemplates = function() {
  var opts = this.option('defaults');
  this.create('page', _.defaults({ isRenderable: true, isPartial: false }, opts));
  this.create('layout', _.defaults({ isLayout: true }, opts));
  this.create('partial', _.defaults({ isPartial: true }, opts));
};

/**
 * Specify source files using glob patterns or filepaths.
 * Options may be passed as a second argument.
 *
 *
 * ```js
 * assemble.src('src/*.hbs', {layout: 'default'})
 * ```
 *
 * **Example usage**
 *
 * ```js
 * assemble.task('site', function() {
 *   assemble.src('src/*.hbs', {layout: 'default'})
 *     assemble.dest('dist')
 * });
 * ```
 *
 * @param {String|Array|Function} `patterns` Glob patterns, file paths, or renaming function.
 * @param {Object} `options` Options to pass to source plugins.
 * @api public
 */

Assemble.prototype.src = function (glob, options) {
  options = _.extend({}, this.options, options);

  if(this.enabled('minimal config') || options.minimal) {
    return vfs.src(glob, options);
  }

  return es.pipe.apply(es, utils.arrayify([
    vfs.src(glob, options),
    stack.src.call(this, glob, options)
  ]));
};

/**
 * Specify the destination for processed files. Options
 * may be passed as a second argument.
 *
 * ```js
 * assemble.dest('_gh_pages/', {ext: '.html'});
 * ```
 * @param {String} `dest` Destination directory
 * @param {Object} `options` Options to be passed to `dest` plugins.
 * @api public
 */

Assemble.prototype.dest = function (dest, options) {
  var opts = _.extend({}, options);

  if (this.enabled('minimal config') || opts.minimal) {
    return vfs.dest(dest, opts);
  }

  return es.pipe.apply(es, utils.arrayify([
    stack.dest.call(this, dest, opts),
    vfs.dest(dest, opts)
  ]));
};

/**
 * Copy a `glob` of files to the specified `dest`.
 *
 * ```js
 * assemble.copy('assets/**', 'dist/');
 *
 * // or in a task
 * assemble.task('copy-assets', function() {
 *   return assemble.copy('assets/**', 'dist/');
 * });
 * ```
 *
 * @param  {String|Array}    `filepath` Source file path and/or glob patterns.
 * @param  {String|Function} `dest` Destination folder or function for renaming.
 * @param  {Object}          `options` Additional options
 * @return {Stream}          Stream to allow doing additional work.
 */

Assemble.prototype.copy = function(glob, dest, options) {
  var opts = _.extend({ minimal: true }, options);
  return this.src(glob, opts).pipe(this.dest(dest, opts));
};

/**
 * Define an assemble task.
 *
 * ```js
 * assemble.task('default', function() {
 *   assemble.src('templates/*.hbs')
 *     .pipe(assemble.dest('dist/'));
 * });
 * ```
 *
 * Read more about [tasks](./docs/tasks.md)
 *
 * @type method
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Assemble.prototype.task = Assemble.prototype.add;

/**
 * The `files` property is session-context-specific
 * and returns the `files` collection being used in
 * the current `task`.
 *
 * @name assemble.files
 * @return {Object} Template files from current task.
 * @api public
 */

Object.defineProperty(Assemble.prototype, 'files', {
  enumerable: true,
  configurable: true,
  get: function () {
    var taskName = this.session.get('task name');
    var templateType = 'page';
    if (taskName) {
      templateType = '__task__' + taskName;
    }
    var plural = this.collection[templateType];
    return this.views[plural];
  }
});

/**
 * Run an array of tasks.
 *
 * ```js
 * assemble.run(['foo', 'bar']);
 * ```
 *
 * @param {Array} `tasks`
 * @api private
 */

Assemble.prototype.run = function () {
  var tasks = !arguments.length
    ? ['default']
    : arguments;
  this.start.apply(this, tasks);
};

/**
 * Wrapper around Task._runTask to enable `sessions`
 *
 * @param  {Object} `task` Task to run
 * @api private
 */

Assemble.prototype._runTask = function(task) {
  var assemble = this;
  assemble.session.run(function () {
    assemble.session.set('task name', task.name);
    Task.prototype._runTask.call(assemble, task);
  });
};

/**
 * Rerun the specified task when a file changes.
 *
 * ```js
 * assemble.task('watch', function() {
 *   assemble.watch('docs/*.md', ['docs']);
 * });
 * ```
 *
 * @param  {String|Array} `glob` Filepaths or glob patterns.
 * @param  {String} `options`
 * @param  {Function} `fn` Task(s) to watch.
 * @return {String}
 */

Assemble.prototype.watch = function(glob, opts, fn) {
  if (Array.isArray(opts) || typeof opts === 'function') {
    fn = opts; opts = null;
  }

  if (Array.isArray(fn)) {
    return vfs.watch(glob, opts, function () {
      this.start.apply(this, fn);
    }.bind(this));
  }

  return vfs.watch(glob, opts, fn);
};

/**
 * Expose `Assemble`
 */

module.exports = Assemble;
