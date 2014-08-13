/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

// Module dependencies
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var fs = require('vinyl-fs');
var gutil = require('gulp-util');
var es = require('event-stream');
var Cache = require('config-cache');
var Context = require('context-manager');
var Orchestrator = require('orchestrator');
var arrayify = require('arrayify-compact');
var delimiterMap = require('delimiter-map');
var loader = require('template-loader');
var helpers = require('helper-loader');
var debug = require('debug')('assemble');
var hljs = require('highlight.js');
var language = require('lang-map');
var Router = require('en-route');
var Layouts = require('layouts');
var _ = require('lodash');
var extend = _.extend;


/**
 * Just about all the deps below this line
 * will be externalized into modules.
 */

// Local modules.
var Files = require('./view/file');
var View = require('./view/view');
var session = require('./session');

// Plugins and middleware
var defaultPlugins = require('./defaults');
var middleware = require('./middleware');
var noopParser = require('./parsers/noop');
var matter = require('./parsers/front-matter');
var markdown = require('./parsers/markdown');
var collection = require('./plugins/collection');
var parsers = require('./plugins/parser');
var buffer = require('./plugins/buffer');
var routes = require('./plugins/routes');
// var pages = require('./plugins/pages');
var normalize = require('./utils/normalize-file');
var utils = require('./utils');


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

function Assemble(options) {
  Orchestrator.call(this, options);
  Cache.call(this, options);
}

/**
 * Extend `Assemble`
 */

util.inherits(Assemble, Orchestrator);
_.defaults(Assemble.prototype, Cache.prototype);


/**
 * Initialize Assemble.
 *
 *   - setup default configuration
 *   - setup default middleware
 *
 * @api private
 */

Assemble.prototype.init = function(options) {
  var opts = extend(this.options, options);

  this.files = new Files();
  this.layoutSettings = {};
  this.engines = {};

  this.defaultConfig(opts);
  this.defaultParsers(opts);
  this.defaultEngines(opts);
  this.defaultHighlighter(opts);
  this.option(opts);
};


/**
 * Initialize default configuration.
 *
 * @api private
 */

Assemble.prototype.defaultConfig = function (opts) {
  // Set the environment
  var env = process.env.NODE_ENV || 'development';
  this.set('env', env);
  this.set('encoding', 'utf8');

  // src config
  this.set('cwd', process.cwd());
  this.set('ext', '.html');

  // dest config
  this.set('base', this.cache.base || '_gh_pages');
  this.set('assets', this.cache.base + '/assets');

  // engines
  this.set('view', View);
  this.set('view engine', 'noop');
  this.set('engines', this.cache.engines || {});
  this.set('helpers', this.cache.helpers || {});

  // parsers
  this.set('parsers', this.cache.parsers || {});

  // data
  this.set('imports', this.cache.imports || {});
  this.set('locals', this.cache.locals || {});
  this.set('data', this.cache.data || {});

  // view defaults
  this.set('delims', ['{{', '}}']);
  this.set('views', 'templates');
  this.set('templates', 'templates');

  this.set('pages', {});
  this.set('partials', {});
  this.set('layouts', {});

  this.option('helpers', 'helpers');
  this.option('templates', 'templates');
  this.option('partials', opts.templates + '/partials');
  this.option('layouts', opts.templates + '/layouts');
  this.option('rename', function(filepath) {
    return path.basename(filepath, path.extname(filepath));
  });

  // this.listen(this);

  // routes
  this.enable('case sensitive routing');
  this.enable('strict routing');
  this.enable('flatten');

  // enable all plugins
  this.disable('minimal config');

  // default `src` plugins
  this.enable('init plugin');
  this.enable('dynamic plugin');
  this.enable('src-routes plugin');
  this.enable('buffer plugin');
  this.enable('extend-src plugin');
  this.enable('parser plugin');
  this.enable('drafts plugin');
  this.enable('paginate plugin');

  // default `dest` plugins
  this.enable('extend-dest plugin');
  this.enable('collections plugin');
  this.enable('dest plugin');
  this.disable('dest-routes plugin');
  this.enable('render plugin');

  this.option(opts);
};


/**
 * Fallback on default options if
 * they are not defined by the user.
 *
 * @api private
 */

Assemble.prototype.defaults = function(key, value) {
  return this.options[key] ?
    this.option(key) :
    this.option(key, value);
};


/**
 * Intialize context manager, with default context
 * levels.
 *
 * @api private
 */

Assemble.prototype.initContext = function() {
  this.context = new Context();
  this.context
    // Add `this.cache` and `this.data` to the context
    .add('cache', 10)
    .add('data', 20)

    // Create a namespaced context for each template
    .add('layouts', 30)
    .add('pages', 40)
    .add('partials', 50)

    // Add a context for each template type
    .add('layout', 60)
    .add('page', 80)
    .add('partial', 90)

    // Add a context for locals and front-matter
    .add('locals', 100)
    .add('matter', 110);
};


/**
 * Fallback on default options if
 * they are not defined by the user.
 *
 * @api private
 */

// Assemble.prototype.setContext = function(file, locals) {
//   file.context = new Context();
//   file.context
//     .add('cache', 1, this.cache)
//     .add('cache.data', 2, this.cache.data)
//     .add('options.data', 2, this.options.data)


//     .add('file.data', 2, file.data)
//     .add('locals', 3, locals)
//     .add('matter', 4, matter)
//     .add('page', 5)
//     .add('partial', 6)
//     .add('layout', 7)
//     .add('file', 8);
// };

// Assemble.prototype.fileContext = function(name, file) {
//   this.context.add(name);
//   this.context.extend(name, file);
//   return context.calculate(order);
// };

// Assemble.prototype.fileContext = function(file, locals) {
//   context.extend('file', file, file.data, locals);
//   return context.calculate();
// };


/**
 * Private method to register default parsers.
 *
 * @api private
 */

Assemble.prototype.defaultParsers = function() {
  this.parser('*', noopParser());
  this.parser('md', matter({autodetect: true}));
  this.parser('hbs', matter({autodetect: true}));
  this.parser('md', markdown({
    gfm: true,
    pedantic: false,
    sanitize: false,
    highlight: function (code, lang) {
      return this.highlight(code, lang);
    }
  }));
};


/**
 * Private method to register default view engines.
 *
 * @api private
 */

Assemble.prototype.defaultEngines = function() {
  this.engine('*', require('./engine/noop'));
  this.engine('hbs', require('./engine/handlebars'));
  this.engine('md', require('./engine/handlebars'));
};


/**
 * Private method to register default syntax highlighter.
 *
 * @api private
 */

Assemble.prototype.defaultHighlighter = function() {
  this.highlight(function (code, lang) {
    if (lang) {
      return hljs.highlight(lang, code).value;
    }
    return hljs.highlightAuto(code).value;
  });
};


/**
 * Lazily initalize router, to allow options to
 * be passed in after init.
 *
 * @api private
 */

Assemble.prototype.lazyRouter = function() {
  if (!this._router) {
    this._router = new Router({
      caseSensitive: this.enabled('case sensitive routing'),
      strict: this.enabled('strict routing')
    });
  }
};


/**
 * Lazily add a `Layout` instance if it has not yet been added.
 * Also normalizes settings to pass to the `layouts` library.
 *
 * We can't instantiate `Layout` in the `defaultConfig` because
 * it reads settings which might not be set until after init.
 *
 * A new instance of `Layouts` is added to `this.layoutSettings`
 * for each engine that is instantiated.
 *
 * @api private
 */

Assemble.prototype.lazyLayouts = function(ext, options) {
  if (!this.layoutSettings[ext]) {
    var opts = _.extend({}, this.options, options);

    this.layoutSettings[ext] = new Layouts({
      locals: opts.locals,
      layouts: opts.layouts,
      delims: opts.layoutDelims,
      tag: opts.layoutTag
    });
  }
};


/**
 * Private method to setup event listeners on Assemble.
 *
 * @api private
 */

Assemble.prototype.listen = function() {
  this.on('set', function (key, value) {
    if (key === 'partials') {
      this.partials(value);
    }
    if (key === 'pages') {
      this.pages(value);
    }
    if (key === 'layouts') {
      this.layouts(value);
    }
  });

  this.on('option', function (key, value) {
    if (key === 'partials') {
      this.partials(value);
    }
    if (key === 'pages') {
      this.pages(value);
    }
    if (key === 'layouts') {
      this.layouts(value);
    }
  });
};


/**
 * Set the current working directory for all paths.
 * Default is `process.cwd()`, this does not need to
 * be changed unless you require something different.
 *
 * ```js
 * assemble.cwd('bench');
 * ```
 * @param  {String|Array} `args` File path or paths.
 * @return {String}
 * @api public
 */

Assemble.prototype.cwd = function () {
  var cwd = this.cache.cwd || process.cwd();
  var args = [].slice.call(arguments);
  if (!args.length) {
    return cwd;
  }
  var paths = [cwd].concat(args);
  return path.join.apply(path, paths);
};


/**
 * Run the given middleware `fns` during the specified
 * stage or stages.
 *
 * ```js
 * assemble.middleware('src:*', function() {
 *   // do stuff
 * });
 * ``
 *
 * @param  {String} `stage`
 * @param  {Array} `fns`
 * @return {Object} `Assemble` to enable chaining.
 */

Assemble.prototype.middleware = function (stage, fns) {
  if (typeof stage === 'function') {
    var current = this.fns[stage] || gutil.noop();
    return current.map(function (fn) {
      return fn(this);
    }.bind(this));
  }
  this.fns[stage] = (this.fns[stage] || [])
    .concat(arrayify(fns));
  return this;
};


/**
 * Define an assemble task.
 *
 * **Example**
 *
 * ```js
 * assemble.task('site', function() {
 *   // do stuff
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Assemble.prototype.task = Assemble.prototype.add;


/**
 * Wrapper around Orchestrator.start to normalize task arguments.
 *
 * @api private
 */

Assemble.prototype.run = function () {
  var tasks = arguments.length ? arguments : ['default'];
  this.start.apply(this, tasks);
};


/**
 * Wrapper around Orchestrator._runTask to enable sessions
 *
 * @param  {Object} `task` Task to run
 * @api private
 */

Assemble.prototype._runTask = function(task) {
  var assemble = this;
  session.run(function () {
    session.set('task name', task.name);
    Orchestrator.prototype._runTask.call(assemble, task);
  });
};


/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * assemble.src([patterns], [options])
 * ```
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
 * @param {String} `filepath`
 * @api public
 */

Assemble.prototype.src = function (glob, options) {
  this.lazyRouter();

  options = _.extend({}, this.options, options);
  if(this.enabled('minimal config')) {
    return fs.src(glob, options);
  }

  return es.pipe.apply(es, utils.arrayify([
    fs.src(glob, options),
    defaultPlugins.src.call(this, glob, options)
  ]));
};


/**
 * Specify a destination for processed files.
 *
 * ```js
 * assemble.dest([patterns], [opts])
 * ```
 *
 * **Example**
 *
 * ```js
 * assemble.task('sitemap', function() {
 *   assemble.src('src/*.txt')
 *     assemble.dest('dist', {ext: '.xml'})
 * });
 * ```
 * @param {String|Array|Function} `patterns` Glob patterns, file paths, or renaming function.
 * @param {Object} `opts` Options to be passed to `dest` plugins.
 * @api public
 */

Assemble.prototype.dest = function (patterns, options) {
  this.lazyRouter();

  var opts = _.extend({}, this.options, options);
  if (this.enabled('minimal config')) {
    return fs.dest(patterns, opts);
  }

  var destFn = patterns;
  if (typeof destFn !== 'function') {
    // setup the dest function to use the file.dest properties
    destFn = function (file) {
      return (file.dest && file.dest.dirname || file.dest) || patterns;
    };
  }

  return es.pipe.apply(es, utils.arrayify([
    defaultPlugins.dest.call(this, patterns, opts),
    fs.dest(destFn, opts)
  ]));
};


/**
 * The collection method returns a plugin used to create `index` pages and
 * related-pages for any collections that have been defined.
 *
 * **Example:**
 *
 * ```js
 * assemble.collection(TODO: @doowb);
 * ```
 *
 * This is `assemble`'s internal collection method, also exposed as
 * a public method allowing this method to be replaced with a
 * custom `collection` method if necessary.
 *
 * @param  {Object} `options` Options used to setup collection definitions.
 * @return {Stream}  Plugin used in the pipeline.
 * @api public
 */

Assemble.prototype.collection = function (options) {
  var collections = this.get('collections') || [];
  return collection.call(this, collections, options);
};


/**
 * Cache a page with the given options.
 *
 * @param  {Object} `options`
 * @return {Object}
 * @api public
 */

// Assemble.prototype.page = function(options) {
//   return new Loader(options);
// };


/**
 * Expose the `pages` plugin on Assemble.
 *
 * @param  {Object} `config`
 * @param  {Object} `options`
 * @return {Object}
 * @api public
 */

// Assemble.prototype.pages = function(config, options) {
//   options = _.extend({}, this.options, options);
//   return pages(this)(config, options);
// };


/**
 * Add a page to `cache.pages`. pages can be defined either
 * as objects, or as glob patterns or file paths to the files to read
 * in and parse.
 *
 * page objects are expected to have the following properties:
 *
 *   - `name` {String} The name of the page
 *   - `data` {Object} Context for the page
 *   - `content` {String} The actual content of the page.
 *   - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.
 *
 * **Example:**
 *
 * ```js
 * assemble.page({
 *   name: 'a',
 *   layout: 'b',
 *   data: {title: 'page A'},
 *   content: 'Some content. '
 * });
 * ```
 *
 * @param {String} `patterns` File paths or glob patterns to pages.
 * @param {String} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.page = function (patterns, options) {
  debug('page:', chalk.magenta(patterns));
  return this.pages(patterns, options);
};


/**
 * Load pages onto the cache as normalized pages-objects.
 * Specify file paths or glob patterns for pages to use with
 * the current view engine.
 *
 * If a string or array of file paths or glob patterns is passed,
 * pages will be read from the file system, parsed into an
 * object, and stored on the `cache` using the full filepath
 * of each page as its unique identifier.
 *
 * **Example:**
 *
 * ```js
 * assemble.pages('templates/pages/*.hbs');
 * ```
 *
 * @param {String|Array|Object} `patterns` Object, array of objects, file paths or glob patterns.
 * @param {String} `options` Options to pass to the `pagesCache.load()` method.
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.pages = function (patterns, options) {
  debug('pages:', chalk.magenta(patterns));

  if (!arguments.length) {
    return this.cache.pages;
  }

  var opts = _.extend({}, this.options, options);
  opts.encoding = this.cache.encoding;

  var o = {};

  loader.init(opts);
  var pages = loader.load(patterns, opts);

  _.extend(o, pages.cache);

  _.forIn(o, function(file, key) {
    file = normalize(file, opts);
    this.cache.pages[key] = file;
  }.bind(this));
  return this;
};


/**
 * Add a partial to `cache.partials`. Partials can be defined either
 * as objects, or as glob patterns or file paths to the files to read
 * in and parse.
 *
 * Partial objects are expected to have the following properties:
 *
 *   - `name` {String} The name of the partial
 *   - `data` {Object} Context for the partial
 *   - `content` {String} The actual content of the partial.
 *   - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.
 *
 * **Example:**
 *
 * ```js
 * assemble.partial({
 *   name: 'a',
 *   layout: 'b',
 *   data: {title: 'Partial A'},
 *   content: 'Some content. '
 * });
 * ```
 *
 * @param {String} `patterns` File paths or glob patterns to partials.
 * @param {String} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.partial = function (patterns, options) {
  debug('partial:', chalk.magenta(patterns));
  return this.partials(patterns, options);
};


/**
 * Load partials onto the cache as normalized partials-objects.
 * Specify file paths or glob patterns for partials to use with
 * the current view engine.
 *
 * If a string or array of file paths or glob patterns is passed,
 * partials will be read from the file system, parsed into an
 * object, and stored on the `cache` using the full filepath
 * of each partial as its unique identifier.
 *
 * **Example:**
 *
 * ```js
 * assemble.partials('templates/partials/*.hbs');
 * ```
 *
 * @param {String|Array|Object} `patterns` Object, array of objects, file paths or glob patterns.
 * @param {String} `options` Options to pass to the `partialsCache.load()` method.
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.partials = function (patterns, options) {
  debug('partials:', chalk.magenta(patterns));

  if (!arguments.length) {
    return this.cache.partials;
  }

  var opts = _.extend({}, this.options, options);
  opts.encoding = this.cache.encoding;

  var o = {};

  loader.init(opts);
  var partials = loader.load(patterns, opts);

  _.extend(o, partials.cache);

  _.forIn(o, function(file, key) {
    file = normalize(file, opts);

    this.cache.partials[key] = file;
  }.bind(this));

  return this;
};


/**
 * Private method for adding layouts to the the
 * current template engine's cache.
 *
 * @api private
 */

Assemble.prototype._addLayout = function(ext, key, value, options) {
  this.lazyLayouts(ext, options);
  var encoding = this.cache.encoding;

  var file = {};
  file.name = key;
  file.data = value.data;
  file.content = value.content || value.contents.toString(encoding);

  this.layoutSettings[ext].setLayout(file);
};


/**
 * Add a layout to `cache.layouts`. Partials can be defined either
 * as objects, or as glob patterns or file paths to the files to read
 * in and parse.
 *
 * Partial objects are expected to have the following properties:
 *
 *   - `name` {String} The name of the layout
 *   - `data` {Object} Context for the layout
 *   - `content` {String} The actual content of the layout.
 *   - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.
 *
 * **Example:**
 *
 * ```js
 * assemble.layout({
 *   name: 'foo',
 *   data: {title: 'Partial Foo'},
 *   content: 'Some content. '
 * });
 * ```
 *
 * @param {String} `patterns` File paths or glob patterns to layouts.
 * @param {String} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.layout = function (patterns, options) {
  debug('layout:', chalk.magenta(patterns));
  return this.layouts(patterns, options);
};


/**
 * Returns an object with all the parsed layouts by name. Internally uses
 * the resolved layout filepaths from `options.layouts` to read in and cache
 * any layouts not already cached.
 *
 * {%= docs("api-layouts") %}
 *
 * Use layout options to combine the patterns to make glob patterns for looking
 * up layouts.
 *
 * @param  {Array}  `patterns` Glob patterns for looking up layouts
 * @param  {Object} `options`  Options containing layout options
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.layouts = function (patterns, options) {
  debug('layouts:', chalk.magenta(patterns));

  if (!arguments.length) {
    return this.cache.layouts;
  }

  var opts = _.extend({}, this.options, options);
  opts.encoding = this.cache.encoding;
  loader.init(opts);

  var o = {};

  var layouts = loader.load(patterns, opts);
  _.extend(o, layouts.cache);

  _.forIn(o, function(file, key) {
    file = normalize(file, opts);
    this.cache.layouts[key] = file;

    // Pass the layout to `Layouts` cache.
    this._addLayout(file.ext, key, file, opts);
  }.bind(this));
  return this;
};


/**
 * Returns an object with all loaded helpers;
 *
 * {%= docs("api-helpers") %}
 *
 * @return {Object} all the resolved and loaded helpers
 * @api public
 */

Assemble.prototype.helper = function (patterns) {
  debug('helper:', chalk.magenta(patterns));
  return this.helpers(patterns);
};


/**
 * Returns an object with all loaded helpers;
 *
 * {%= docs("api-helpers") %}
 *
 * @return {Object} all the resolved and loaded helpers
 * @api public
 */

Assemble.prototype.helpers = function (patterns, options) {
  debug('helpers:', chalk.magenta(patterns));
  var opts = _.extend({requireable: true}, options);

  helpers.init(opts);

  _.extend(this.cache.helpers, helpers.load(patterns).cache);
  return this.cache.helpers;
};


/**
 * Register a helper for the current template engine.
 *
 * **Example:**
 *
 * ```js
 * assemble.registerHelper('include', function(filepath) {
 *   return fs.readFileSync(filepath, 'utf8');
 * });
 * ```
 *
 * **Usage:**
 *
 * ```js
 * assemble.render('<%= include("foo.md") %>');
 * ```
 *
 * @param  {String} `key`
 * @param  {Object} `value`
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.registerHelper = function (key, value) {
  debug('registerHelper %s', chalk.magenta(key));
  this.cache.helpers[key] = value;
  return this;
};


/**
 * Add an array or glob of template helpers.
 *
 * **Example:**
 *
 * ```js
 * assemble.registerHelpers('a.js');
 * // or
 * assemble.registerHelpers(['a.js', 'b.js']);
 * // or
 * assemble.registerHelpers('*.js');
 * ```
 *
 * @param  {String} `key`
 * @param  {Object} `value`
 * @return {Assemble} to enable chaining.
 * @api public
 */

Assemble.prototype.registerHelpers = function (obj, options) {
  debug('registerHelpers:', chalk.magenta(obj));
  var opts = _.extend({requireable: true}, options);

  helpers.init(opts);

  _.extend(this.cache.helpers, helpers.load(obj).cache);
  return this;
};


/**
 * Register the given view engine callback `fn` as `ext`.
 *
 * {%= docs("api-engine") %}
 *
 * @param {String} `ext`
 * @param {Function|Object} `fn` or `options`
 * @param {Object} `options`
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.engine = function (ext, fn, options) {
  var engine = {};
  if (typeof fn === 'function') {
    engine.renderFile = fn;
    engine.render = fn.render;
  } else if (typeof fn === 'object') {
    engine = fn;
    engine.renderFile = fn.renderFile || fn.__express;
  }

  engine.options = fn.options || options || {};

  if (typeof engine.render !== 'function') {
    throw new gutil.PluginError('Assemble', 'Engines are expected to have a `render` method.');
  }

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }
  this.engines[ext] = engine;

  var lang = language.lang(ext.replace(/^\./, ''));

  // if the language has mapped delimiters, create a layout stack.
  if (/md/.test(ext) || (delimiterMap(lang) && delimiterMap(lang).length)) {
    // Get the layout delimiters to use for the current engine.
    var getEngineDelims = utils.engineDelims(ext);

    // Create a `Layout` instance for this engine
    var layoutOpts = _.defaults({}, options, {
      delims: getEngineDelims
    });
    this.lazyLayouts(ext, layoutOpts);
  }
  return this;
};


/**
 * This is Assemble's internal render method, but it's exposed as a public method
 * so it can be replaced with a custom `render` method.
 *
 * @param  {Object} `data` Data to pass to registered view engines.
 * @param  {Object} `options` Options to pass to registered view engines.
 * @return {String}
 * @api public
 */

Assemble.prototype.render = function (file, options, callback) {
  // support callback function as second arg
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var data = _.extend({}, this.cache.locals, this.cache.data);

  var opts = _.defaults({}, options, this.options, {
    encoding: this.cache.encoding,
    defaultEngine: this.get('view engine')
  });

  opts.data = _.extend({}, data, opts.data);

  var settings = {
    engines: this.engines,
    layoutSettings: this.layoutSettings,
    partials: this.get('partials'),
    helpers: this.get('helpers'),
    imports: this.get('imports')
  };

  var view = new View(file, opts, settings);

  try {
    view.render(callback);
  } catch (err) {
    callback(err);
  }
};


/**
 * Register a parser `fn` to be used on each `.src` file. This is used to parse
 * front matter, but can be used for any kind of parsing.
 *
 * By default, Assemble will parse front matter using [gray-matter][gray-matter].
 * For front-matter in particular it is probably not necessary to register additional
 * parsing functions, since gray-matter can support almost any format, but this is
 * cusomizable if necessary or if a non-supported format is required.
 *
 * **Example:**
 *
 * ```js
 * assemble.parser('textile', function (file, enc, options) {
 *   var str = textile(String(file.contents));
 *   file.contents = new Buffer(str);
 * });
 * ```
 *
 * [gray-matter]: https://github.com/assemble/gray-matter
 *
 * @param {String} `file` The file object
 * @param {Object} `options` Options to pass to parser.
 * @param {Function} `fn` The parsing function.
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.parser = function (ext, fn) {
  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }

  var parsers = this.cache.parsers[ext] || [];
  fn = arrayify(fn).map(function(parser) {
    if (typeof parser !== 'function') {
      throw new TypeError('assemble.parser() exception', ext);
    }
    return parser;
  }.bind(this));

  this.cache.parsers[ext] = _.union([], parsers, fn);
  return this;
};


/**
 * Traverse the `parser` stack, passing the `file` object to each
 * parser and returning the accumlated result.
 *
 * @param  {Object} `options`
 * @api private
 */

Assemble.prototype.parse = function (options) {
  return parsers.call(this, options);
};


/**
 * Set a router to be called.
 *
 * @param  {Object} `options`
 * @return {Object} `Assemble` to enable chaining.
 * @api private
 */

Assemble.prototype.route = function () {
  debug('#route', arguments);
  this._router.route.apply(this._router, arguments);
  return this;
};


/**
 * **Example:**
 *
 * ```js
 * var myRoutes = assemble.router();
 * myRoutes.route(':basename.hbs', function (file, params, next) {
 *   // do something with the file
 *   next();
 * });
 *
 * assemble.src('')
 *   .pipe(myRoutes())
 *   .pipe(assemble.dset())
 * ```
 *
 * @param  {Object} `options`
 * @return {Function}
 */

Assemble.prototype.router = function(options) {
  var self = this;

  options = _.extend({
    caseSensitive: true, // this.enabled('case sensitive routing'),
    strict: true //this.enabled('strict routing')
  }, this.options, options);

  var router = new Router(options);

  // make a new function that gets returned for later use
  var rte = function() {
    options.router = router;
    return routes.call(self, options);
  };

  // add new routes to the specific router
  rte.route = function(route, fn) {
    router.route(route, fn);
  };

  // return the new function
  return rte;
};


/**
 * This is Assemble's internal buffer method, but it's exposed as a public method
 * so it can be replaced with a custom `buffer` method.
 *
 * @param  {Object} `options` Options to pass to the buffer plugin.
 * @return {String}
 * @api public
 */

Assemble.prototype.buffer = function (options) {
  options = _.extend({}, this.options, options);
  return buffer.call(this, options);
};


/**
 * Register a function for syntax highlighting.
 *
 * By default, Assemble uses highlight.js for syntax highlighting.  It's not
 * necessary to register another function unless you want to override the default.
 *
 * **Examples:**
 *
 * ```js
 * assemble.highlight(function(code, lang) {
 *   if (lang) {
 *     return hljs.highlight(lang, code).value;
 *   }
 *   return hljs.highlightAuto(code).value;
 * });
 * ```
 *
 * @param {Function} `fn`
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.highlight = function (code, lang) {
  if (typeof code === 'function') {
    this.highlighter = code;
    return this;
  }

  if (this.highlighter) {
    return this.highlighter(code, lang);
  }
  return code;
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
 * **Params:**
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
 * Expose middleware.
 */

for (var key in middleware) {
  Object.defineProperty(Assemble, key, Object.getOwnPropertyDescriptor(middleware, key));
}


/**
 * Expose `Assemble`
 */

module.exports = Assemble;
