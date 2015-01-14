'use strict';

/**
 * Module dependencies
 */

var _ = require('lodash');
var path = require('path');
var slice = require('array-slice');
var Task = require('orchestrator');
var Template = require('template');
var engineAssemble = require('engine-assemble');

/**
 * Local dependencies
 */

var session = require('./session');
var extension = require('./extensions');
var middleware = require('./middleware');
var defaultExtensions = [
  __dirname + '/extensions/vinyl-fs'
];

/**
 * Expose `Assemble`
 */

module.exports = Assemble;

/**
 * Create an `assemble` task.
 *
 * ```js
 * var assemble = require('assemble');
 *
 * assemble.task('site', function() {
 *   assemble.src('templates/*.hbs')
 *     .pipe(assemble.dest('_gh_pages'));
 * });
 * ```
 *
 * Optionally initialize a new `Assemble` with the given `context`.
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

  Assemble.constructorStack.forEach(function (ctor) {
    ctor.apply(this, args);
  }, this);
  this.session = session;
}

_.extend(Assemble.prototype, Task.prototype);
Assemble = Template.extend(Assemble.prototype);

extension.extend(Assemble);
extension.initialize(Assemble, defaultExtensions);

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

Assemble.prototype.defaultConfig = function () {
  // defaultConfig from `engine`
  Assemble.__super__.defaultConfig.apply(this, arguments);

  // Set the environment
  var env = process.env.NODE_ENV || 'development';
  this.set('env', env);
  this.set('encoding', 'utf8');

  // dest config
  this.set('base', this.cache.cwd);
  this.set('assets', 'assets');
  this.set('root', 'dist');
};

Assemble.prototype.defaultOptions = function() {
  Assemble.__super__.defaultOptions.apply(this, arguments);

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
  this.set('delims', ['{{', '}}']);
  this.set('views', 'templates');
  this.set('templates', 'templates');

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
 * Private method to load default engines.
 *
 * @api private
 */

Assemble.prototype.defaultEngines = function() {
  Assemble.__super__.defaultEngines.apply(this, arguments);
  this.engine(['*', 'hbs', 'md'], engineAssemble, {
    layoutDelims: ['{%', '%}'],
    destExt: '.html'
  });
};

/**
 * Default template delimiters
 *
 * @return {[type]}
 * @api private
 */

Assemble.prototype.defaultDelimiters = function() {
  Assemble.__super__.defaultDelimiters.apply(this, arguments);
};

/**
 * Private method to load default templates.
 *
 * @api private
 */

Assemble.prototype.defaultTemplates = function() {
  // Assemble.__super__.defaultTemplates.apply(this, arguments);
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
