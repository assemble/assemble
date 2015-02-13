'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
var path = require('path');
var fs = require('vinyl-fs');
var es = require('event-stream');
var slice = require('array-slice');
var Task = require('orchestrator');
var Template = require('template');
var engineAssemble = require('engine-assemble');


/**
 * Local dependencies
 */

var stack = require('./stack');
var utils = require('./utils');
var session = require('./session');
var middleware = require('./middleware');

/**
 * Expose `Assemble`
 */

module.exports = Assemble;

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
 *   - setup default configuration
 *   - setup default middleware
 *
 * @api private
 */

Assemble.prototype.loadDefaults = function() {
  this.initializing = true;

  /**
   * this.defaultConfig();
   * this.defaultOptions();
   * this.defaultDelimiters();
   * this.defaultRoutes();
   * this.defaultTemplates();
   * this.defaultEngines();
   */

  Assemble.__super__.loadDefaults.call(this);

  this.defaultPlugins();
  // this.defaultHighlighter();
  this.initializing = false;
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
  this.option('destExt', '.html');
  this.option('ext', '.hbs');
  this.option('defaults', {
    isRenderable: true,
    isPartial: true,
    engine: '.hbs',
    ext: '.hbs'
  });

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

  /**
   * Path regex:
   *
   *   0 => full path
   *   1 => dirname
   *   2 => basename (with ext)
   *   3 => name (no ext)
   *   4 => extname
   *   5 => ext (no .)
   */

  var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
  this.onLoad(pathRe, middleware.parse(this));
  this.onLoad(/./, middleware.defaultProps(this));
  this.before(/./, middleware.assets(this));
};

/**
 * Register a default engine (handlebars)
 */

Assemble.prototype.defaultEngines = function() {
  Assemble.__super__.defaultEngines.apply(this, arguments);
  this.engine(['hbs', 'md'], engineAssemble, {
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


/********************************************
 * Task methods
 ********************************************/


/**
 * Define an assemble task.
 *
 * **Example**
 *
 * ```js
 * assemble.task('default', function() {
 *   // do stuff
 * });
 * ```
 *
 * @type method
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Assemble.prototype.task = Assemble.prototype.add;

/**
 * Wrapper around Orchestrator.start to normalize
 * task arguments.
 *
 * @api private
 */

Assemble.prototype.run = function () {
  var tasks = !arguments.length
    ? ['default']
    : arguments;
  this.start.apply(this, tasks);
};

/**
 * Wrapper around Orchestrator._runTask to enable
 * `sessions`
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


/********************************************
 * Template methods
 ********************************************/


/**
 * A session context specific `files` property that returns the `files` collection
 * being used in the current `task`.
 *
 * ```js
 * console.log(assemble.files);
 * //=>
 * { home:
 *   {
 *     base: '/site/template/pages/',
 *     content: '{{ msg }}',
 *     cwd: '/site',
 *     data: { msg: 'hello world', src: [Object], dest: [Object] },
 *     options: {},
 *     orig: '{{ msg }}',
 *     path: '/site/template/pages/home.hbs',
 *     relative: 'home.hbs'
 *   }
 * }
 * ```
 *
 * When using inside a plugin, the stream must be bound to the session via `session.bindEmitter`:
 *
 * ```js
 * var stream = through.obj( ... );
 * assemble.session.bindEmitter(stream);
 * return stream;
 * ```
 *
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


/********************************************
 * Vinyl-fs methods
 ********************************************/


/**
 * Glob patterns or filepaths to source files.
 *
 * **Example**
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
    return fs.src(glob, options);
  }

  return es.pipe.apply(es, utils.arrayify([
    fs.src(glob, options),
    stack.src.call(this, glob, options)
  ]));
};

/**
 * Specify a destination for processed files.
 *
 * **Example**
 *
 * ```js
 * assemble.task('sitemap', function() {
 *   assemble.src('src/*.txt')
 *     assemble.dest('dist', {ext: '.xml'})
 * });
 * ```
 * @param {String} `dest` Destination directory
 * @param {Object} `options` Options to be passed to `dest` plugins.
 * @api public
 */

Assemble.prototype.dest = function (dest, options) {
  var opts = _.extend({}, options);

  if (this.enabled('minimal config') || opts.minimal) {
    return fs.dest(dest, opts);
  }

  return es.pipe.apply(es, utils.arrayify([
    stack.dest.call(this, dest, opts),
    fs.dest(dest, opts)
  ]));
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

Assemble.prototype.watch = function(glob, options, fn) {
  if (typeof options === 'function' || Array.isArray(options)) {
    fn = options;
    options = null;
  }

  // Tasks to watch
  if (Array.isArray(fn)) {
    return fs.watch(glob, options, function() {
      this.start.apply(this, fn);
    }.bind(this));
  }
  return fs.watch(glob, options, fn);
};

/**
 * Copy a `glob` of files to the specified `dest`.
 *
 * **Example**
 *
 * ```js
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
