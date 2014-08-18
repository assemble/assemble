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
var glob = require('globby');
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
  this.defaultTemplates(opts);
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
  this.set('engines', {});
  this.set('helpers', {});

  // parsers
  this.set('parsers', {});

  // data
  this.set('imports', {});
  this.set('locals', {});
  this.set('data', {});

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

  this.overrides(opts);
  this.defaultContexts();
  this.defaultPlugins();
};


/**
 * Set defaults.
 *
 * @api private
 */

Assemble.prototype.defaults = function(key, value) {
  return this.cache[obj][key] = value;
};


/**
 * Override default options with user-defined `opts`
 * during initialization.
 *
 * @api private
 */

Assemble.prototype.overrides = function(opts) {
  _.forIn(opts, function (value, key) {
    this.option(key, value);
  }.bind(this));
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
  this.enable('dest-routes plugin');
  this.enable('render plugin');
};


/**
 * Private method to register default templates.
 *
 * {%= docs("api-default-templates") %}
 *
 * @api private
 */

Assemble.prototype.defaultTemplates = function() {
  this.template('page', 'pages');
  this.template('partial', 'partials');
  this.template('layout', 'layouts', {isLayout: true});
};


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

Assemble.prototype.defaultEngines = function () {
  this.engine('*', require('./engine/noop'));
  this.engine('hbs', require('./engine/handlebars'), {
    layoutDelims: ['{%', '%}'],
    destExt: '.html'
  });
  this.engine('md', require('./engine/handlebars'), {
    layoutDelims: ['{%', '%}'],
    destExt: '.html'
  });
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
 * Intialize default contexts and context levels.
 *
 * @api private
 */

Assemble.prototype.defaultContexts = function() {
  this.context = new Context();

  // Add `this.cache` and `this.data` to the context
  this.context.add('cache', 10);
  this.context.add('data', 20);

  // Create a namespaced context for each template
  this.context.add('layouts', 30);
  this.context.add('pages', 40);
  this.context.add('partials', 50);

  // Add a context for each template type
  this.context.add('layout', 60);
  this.context.add('page', 80);
  this.context.add('partial', 90);

  // Add a context for locals and front-matter
  this.context.add('locals', 100);
  this.context.add('matter', 110);
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
 * Normalizes a file object to be an assemble
 * vinyl file with the necessary properties
 * to provide plugins in the pipeline with a
 * consistent experience.
 *
 * This method will be externalized to [assemble-utils].
 *
 * @param  {Object} `file` The file object to normalize. The following properties are expect on the source file.
 *     @property {Object} `data`: Typically metadata from locals or parsed front matter.
 *     @property {String} `content`: The actual content of the file.
 * @param  {Object} `options` Options to pass to `normalize`
 * @return {Object} `file` A normalize file object.
 */

Assemble.prototype.normalize = function (file, options) {
  return normalize(file, options);
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
 * The collection method returns a plugin used to create
 * `index` pages and related-pages for any collections that
 * have been defined.
 *
 * **Example:**
 *
 * ```js
 * assemble.collection({
 * });
 * ```
 *
 * This is `assemble`'s internal collection method, also exposed
 * as a public method so it can be replaced with a custom `collection`
 * method if necessary.
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
 * Private method for adding layouts settings to the the current
 * template engine's cache.
 *
 * @param {String} `ext` The extension to associate with the layout settings.
 * @param {String} `namne`
 * @param {Object} `value`
 * @param {Object} `options`
 * @api private
 */

Assemble.prototype._addLayout = function(ext, name, value, options) {
  this.lazyLayouts(ext, options);
  var encoding = this.cache.encoding;

  var layouts = {};
  layouts[name] = {
    name: name,
    data: value.data,
    content: value.content || value.contents.toString(encoding)
  };

  this.layoutSettings[ext].setLayout(layouts);
};


/**
 * Add a new template `type` to Assemble by passing the singular
 * and plural names to be used for `type`.
 *
 * **Example:**
 *
 * ```js
 * assemble.template('include', 'includes');
 * ```
 *
 * Each new template `type` add two new methods to Assemble:
 *
 *  - a method for loading one `type` template at a time
 *  - a method for loading multiple `type` templates at a time.
 *
 * **Example:**
 *
 * Continuing our example above:
 *
 * ```js
 * // load one include at a time
 * assemble.include();
 * // load multiple includes
 * assemble.includes();
 * ```
 *
 * {%= docs("api-default-templates") %}
 *
 * @param {String} `type` Name of the new type to add
 * @param {Object} `options`
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.template = function(type, plural, options) {
  var opts = _.extend({}, options);

  if (typeof plural !== 'string') {
    throw new Error('A plural form must be defined for: "' + type + '".');
  }

  var isLayout = opts.isLayout || false;

  this.cache[plural] = {};
  if (!this.context.getLevel(plural)) {
    this.context.add(plural, 55);
  }

  Assemble.prototype[type] = function (patterns, options) {
    debug(type + ':', chalk.magenta(patterns));
    return this[plural](patterns, options);
  };

  Assemble.prototype[plural] = function (patterns, options) {
    debug(plural + ':', chalk.magenta(patterns));
    this.lazyRouter();

    if (!arguments.length) {
      return this.cache[plural];
    }

    var opts = _.extend({}, this.options, options);
    opts.encoding = this.cache.encoding;
    loader.init(opts);

    var o = {};

    var templates = loader.load(patterns, opts);
    _.extend(o, templates.cache);

    var parsers = this.cache.parsers;
    var routes = this.route;

    var cache = {};

    _.forIn(o, function(file, key) {
      file = this.normalize(file, opts);

      // set the `type` on the file to make it
      // easier for parsers and routes to filter
      file.type = type;

      // Dispatch routes
      this._router.dispatch(file, function (err) {
        if (err) {
          throw new Error(err);
        }
      });

      this.cache[plural][key] = file;
      cache[key] = file.data || {};

      // Apply layouts, when defined
      if (isLayout) {
        var ext = file.ext || file.src.ext || file.data.ext;
        // Pass the layout to `Layouts` cache.
        this._addLayout(ext, key, file, opts);
      }
    }.bind(this));
    this.context.extend(plural, cache);
    return this;
  };

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
  var opts = _.extend({}, options);

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
 * Register an array or glob of template helpers.
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
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.registerHelpers = function (obj, options) {
  debug('registerHelpers:', chalk.magenta(obj));
  var opts = _.extend({}, options);

  helpers.init(opts);

  _.extend(this.cache.helpers, helpers.load(obj).cache);
  return this;
};


/**
 * Register a parser `fn` or array of `fns` to be used on
 * each `.src` file. This is used to parse front matter, but
 * can be used for any kind of parsing.
 *
 * By default, Assemble will parse front matter using
 * [gray-matter][gray-matter]. For front-matter in particular
 * it is probably not necessary to register additional parsing
 * functions, since gray-matter can support almost any format,
 * but this is cusomizable if necessary or if a non-supported
 * format is required.
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
 * @param {Function|Array} `fn` The parsing function or array of functions.
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.parser = function (ext, fn) {
  debug('parser: %s', chalk.magenta(ext));

  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }

  var parsers = this.cache.parsers[ext] || [];
  var self = this;

  fn = arrayify(fn).map(function(parser) {
    if (typeof parser !== 'function') {
      throw new TypeError('assemble.parser() exception', ext);
    }
    return _.bind(parser, self);
  }.bind(this));

  this.cache.parsers[ext] = _.union([], parsers, fn);
  return this;
};


/**
 * Register an array or glob of parsers for the given `ext`.
 *
 * **Example:**
 *
 * ```js
 * assemble.parsers('hbs', 'a.js');
 * // or
 * assemble.parsers('md' ['a.js', 'b.js']);
 * // or
 * assemble.parsers('md', '*.js');
 * ```
 *
 * @param  {String} `ext` The extension to associate with the parsers.
 * @param  {String|Array} `patterns` File paths or glob patterns.
 * @return {Object} `Assemble` to enable chaining.
 * @api public
 */

Assemble.prototype.parsers = function (ext, patterns, options) {
  debug('parsers: %s', chalk.magenta(patterns));

  var opts = _.extend({}, options);
  helpers.init(opts);

  var arr = [];
  glob.sync(arrayify(patterns), opts).forEach(function (filepath) {
    try {
      arr.push(require(path.resolve(filepath)));
    } catch (err) {
      throw new Error('#parsers:', err);
    }
  });

  this.parser(ext, arr);
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
 * Run a file through a parser stack.
 *
 * @param  {Object} `file`
 * @param  {Object} `opts`
 * @return {Object}
 */

Assemble.prototype.runParsers = function (stack, file, opts) {
  if (!stack ||!file._parseable) {
    return file;
  }

  var ext = file.ext || path.extname(file.path) || this.get('ext');
  if (ext[0] === '.') {
    ext = ext.replace(/^\./, '');
  }

  file = this.normalize(file, opts);
  var parsers = stack[ext];

  if (parsers && parsers.length) {
    parsers.forEach(function (parser) {
      try {
        file = parser.call(this, file, opts.encoding, opts);
      } catch (err) {
        throw new Error('#template:parser', err);
      }
    }.bind(this));
  }
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
    var layoutOpts = _.defaults({}, options, {
      layoutDelims: utils.engineDelims(ext)
    });

    // Create an instance of `Layout` for this engine
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

  var opts = {}, settings = {}, data = {};

  _.extend(opts, this.options, options);
  _.extend(opts, {
    engines: this.engines,
    layoutSettings: this.layoutSettings,
    defaultEngine: this.get('view engine'),
    encoding: this.cache.encoding
  });

  _.extend(settings, {
    partials: this.cache.partials,
    helpers: this.cache.helpers,
    imports: this.cache.imports
  });

  _.extend(data, this.cache.locals);
  _.extend(data, this.cache.data);
  _.extend(data, this.context.get('partials'));

  opts.data = _.extend({}, opts.data, data);

  var view = new View(file, opts, settings);
  try {
    view.render(callback);
  } catch (err) {
    callback(err);
  }
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
  this.lazyRouter();
  this._router.route.apply(this._router, arguments);
  return this;
};


/**
 * **Example:**
 *
 * ```js
 * var routes = assemble.router();
 * routes.route(':basename.hbs', function (file, params, next) {
 *   // do something with the file
 *   next();
 * });
 *
 * assemble.src('')
 *   .pipe(routes())
 *   .pipe(assemble.dest())
 * ```
 *
 * @param  {Object} `options`
 * @return {Function}
 */

Assemble.prototype.router = function(options) {
  var self = this;

  var opts = _.defaults({}, options, this.options, {
    caseSensitive: this.enabled('case sensitive routing'),
    strict: this.enabled('strict routing')
  });

  var router = new Router(opts);

  // make a new function that gets returned for later use
  var rte = function() {
    opts.router = router;
    return routes.call(self, opts);
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
  var opts = _.extend({}, this.options, options);
  return buffer.call(this, opts);
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
