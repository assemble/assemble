/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var Orchestrator = require('orchestrator');
var arrayify = require('arrayify-compact');
var delimiterMap = require('delimiter-map');
var template = require('template');
var hljs = require('highlight.js');
var language = require('lang-map');
var through = require('through2');
var es = require('event-stream');
var gutil = require('gulp-util');
var fs = require('vinyl-fs');
var path = require('path');
var util = require('util');
var defaults = _.defaults;
var extend = _.extend;


var Layouts = require('layouts');

/**
 * Local modules.
 */

var Cache = require('./cache');
var Data = require('./data');
var Layout = require('./view/layout');
var Page = require('./view/page');
var Router = require('./router');
var Template = require('./view/template');
var Files = require('./view/file');
var View = require('./view/view');


/**
 * Plugins and middleware
 */

var helpers = require('./engine/helpers');
var middleware = require('./middleware');
var defaultParser = require('./parsers/front-matter');
var noopParser = require('./parsers/noop');
var pathParser = require('./parsers/paths');
var collection = require('./plugins/collection');
var renderer = require('./plugins/renderer');
var parsers = require('./plugins/parser');
var buffer = require('./plugins/buffer');
var pages = require('./plugins/pages');
var utils = require('./utils.js');


/**
 * # Assemble
 *
 * The Assemble constructor is Assemble's parent storage class.
 * Optionally initialize a new `Assemble` with the given `context`.
 *
 * **Example:**
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
  Data.call(this, options);
}

util.inherits(Assemble, Orchestrator);
_.defaults(Assemble.prototype, Cache.prototype);
_.defaults(Assemble.prototype, Data.prototype);


/**
 * Initialize Assemble.
 *
 *   - setup default configuration
 *   - setup default middleware
 *
 * @api private
 */

Assemble.prototype.init = function(options) {
  options = extend({}, this.options, options);
  this.set('partialsCache', new Template({}, options));
  this.set('layoutsCache', new Template({}, options));

  this.option = new Cache(options);
  this.options = this.option.cache;
  this.orig = new Cache();

  this.middleware = [];
  this.plugins = {};
  this.locals = {};
  this.engines = {};
  this._layouts = {};

  this.files = new Files();
  this.defaultConfig(this.options);
  this.initLayout(this);
};


/**
 * Expose middleware.
 */

for (var key in middleware) {
  Object.defineProperty(Assemble, key, Object.getOwnPropertyDescriptor(middleware, key));
}


/**
 * Initialize default configuration.
 *
 * @api private
 */

Assemble.prototype.defaultConfig = function (options) {
  options = _.extend({}, this.options, options);
  var self = this;

  // Site-wide defaults
  this.disable('minimal config');

  // Set the environment
  var env = process.env.NODE_ENV || 'development';
  this.set('env', env);
  this.set('encoding', 'utf8');
  this.set('cwd', process.cwd());
  this.set('ext', '.html');

  // Default `src` plugins
  this.enable('init plugin');
  this.enable('routes-src plugin');
  this.enable('buffer plugin');
  this.enable('extend-src plugin');
  this.enable('parser plugin');
  this.enable('drafts plugin');
  this.enable('paginate plugin');

  // Default `dest` plugins
  this.enable('extend-dest plugin');
  this.enable('collections plugin');
  this.disable('dest plugin');
  this.disable('assets plugin');
  this.disable('routes-dest plugin');
  this.enable('render plugin');

  // View defaults
  this.set('view', View);
  this.set('view engine', 'noop');
  this.set('views', 'templates');
  this.set('delims', ['{{', '}}']);

  // Prime the cache
  this.set('data', {});
  this.set('parsers', {});

  // Register default parsers
  this.parser('*', noopParser());
  // Parse front matter from markdown files
  this.parser('md', defaultParser({autodetect: true}));
  // Parse front-matter from handlebars templates
  this.parser('hbs', defaultParser({autodetect: true}));
  // Add additional path properties to the file object
  this.parser('path', pathParser());

  // Register default view engines
  this.engine('*', require('./engine/noop'));
  this.engine('hbs', require('./engine/handlebars'));

  // Default markdown engine
  this.engine('md', require('./engine/remarked'), {
    gfm: true,
    pedantic: false,
    sanitize: false,
    highlight: function (code, lang) {
      return self.highlight(code, lang);
    }
  });

  // Default syntax highlighter
  this.highlight(function (code, lang) {
    if (lang) {
      return hljs.highlight(lang, code).value;
    }
    return hljs.highlightAuto(code).value;
  });
};


/**
 * ## .cwd
 *
 * Set the current working directory for all paths.
 *
 * @param  {String} `paths`
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
 * ## .options
 *
 * Pass options to assemble.
 *
 * **Examples:**
 *
 * ```js
 * assemble.options({layoutdir: 'templates/layouts'});
 * ```
 *
 * @method `options`
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

// Assemble.prototype.options = function (value) {
//   this.load(value);
// };


/**
 * ## .plugin
 *
 * Run assemble middleware
 *
 * @param  {String} stage
 * @param  {Array} plugins
 * @return {String}
 */

Assemble.prototype.plugin = function (stage, plugins) {
  if (typeof stage === 'function') {
    var current = this.plugins[stage] || gutil.noop();
    return current.map(function (fn) {
      return fn(this);
    }.bind(this));
  }
  this.plugins[stage] = (this.plugins[stage] || [])
    .concat(arrayify(plugins));
};


/**
 * ## .task
 *
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
 * @method `task`
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Assemble.prototype.task = Assemble.prototype.add;
Assemble.prototype.run = function () {
  var tasks = arguments.length ? arguments : ['default'];
  this.start.apply(this, tasks);
};


/**
 * ## .src
 *
 * Glob patterns or filepaths to source files.
 *
 * **Example**
 *
 * ```js
 * assemble.task('site', function() {
 *   assemble.src('src/*.tmpl.md')
 *     // do stuff
 * });
 * ```
 *
 * @method `src`
 * @param {String} `filepath`
 * @api public
 */

Assemble.prototype.src = function (glob, options) {
  options = _.extend({}, this.options, options);
  if(this.enabled('minimal config')) {
    return fs.src(glob, options);
  }
  return es.pipe.apply(es, utils.arrayify([
    fs.src(glob, options),
    utils.src.call(this, glob, options)
  ]));
};


/**
 * ## .dest
 *
 * Define the destination filepath for a task.
 *
 * **Example**
 *
 * ```js
 * assemble.task('site', function() {
 *   assemble.src('src/*.tmpl.md')
 *     .pipe(dest('_gh_pages'));
 * });
 * ```
 *
 * @method `dest`
 * @param {String} `filepath`
 * @api public
 */

Assemble.prototype.dest = function (dest, options) {
  options = _.extend({}, this.options, options);
  if (this.enabled('minimal config')) {
    return fs.dest(dest, options);
  }
  return es.pipe.apply(es, utils.arrayify([
    utils.dest.call(this, dest, options),
    fs.dest(dest, options)
  ]));
};


/**
 * ## .collection
 *
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
 * ## .page
 *
 * Cache a page with the given options.
 *
 * @param  {Object} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.page = function(options) {
  return new Page(options);
};


/**
 * ## .pages
 *
 * Expose the `pages` plugin on Assemble.
 *
 * @param  {Object} `config`
 * @param  {Object} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.pages = function(config, options) {
  options = _.extend({}, this.options, options);
  // this.options.pages = _.flatten(_.union([], this.options.pages, config));
  return pages(this)(config, options);
};


/**
 * ## .partials
 *
 * Specify file paths or glob patterns for partials to use
 * with the current view engine.
 *
 * Partials are read from the file system, parsed into an
 * object, and stored on the `cache` using the full filepath
 * of each partial as its unique identifier.
 *
 * **Example:**
 *
 * ```js
 * var partials = assemble.partials;
 * ```
 *
 * @method `partials`
 * @param {String} `patterns` File paths or glob patterns to partials.
 * @param {String} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.partials = function (patterns, options) {
  var partialsInst = this.get('partialsCache');

  var p = this.get('partials');
  if (Array.isArray(p) || typeof p === 'string') {
    partialsInst.cache(p);
  }

  partialsInst.cache(this.options.partials, options);
  partialsInst.cache(patterns, options);

  this.set('partials', partialsInst.get());
  return this.cache.partials;
};


/**
 * Initialize a new instance of `Layout`.
 *
 * @return {Object} `Layout`
 * @api private
 */

Assemble.prototype.initLayout = function (options) {
  return new Layout(options);
};


/**
 * ## .layouts
 *
 * Returns an object with all the parsed layouts by name. Internally uses
 * the resolved layout filepaths from `options.layouts` to read in and cache
 * any layouts not already cached.
 *
 * {%= docs("api-layouts") %}
 *
 * @method `layouts`
 * @return {Object} all the parsed layouts
 *
 * Use layout options to combine the patterns to make glob patterns for looking
 * up layouts.
 *
 * @param  {Array}  `patterns` Glob patterns for looking up layouts
 * @param  {Object} `options`  Options containing layout options
 * @return {Array}  Combined patterns with given layout options
 * @api public
 */

defineGetter('layouts', function () {
  var patterns = arrayify(this.options.layouts || []);
  var ext = this.options.layoutext || this.get('view engine');

  if (this.options.layoutdir) {
    var glob = path.join(this.options.layoutdir, '*') + (ext ? ext : '.*');
    patterns.push(glob);
  }

  var layouts = this.get('layouts');
  layouts.cache(patterns, this.options);
  return layouts.get();
});


/**
 * ## .helpers
 *
 * Returns an object with all loaded helpers;
 *
 * {%= docs("api-helpers") %}
 *
 * @method `helpers`
 * @return {Object} all the resolved and loaded helpers
 * @api public
 */

Assemble.prototype.helper = function (patterns) {
  return this.helpers(patterns);
};


/**
 * ## .helpers
 *
 * Returns an object with all loaded helpers;
 *
 * {%= docs("api-helpers") %}
 *
 * @method `helpers`
 * @return {Object} all the resolved and loaded helpers
 * @api public
 */

Assemble.prototype.helpers = function (patterns) {
  // var optsHelpers = helpers(this.options.helpers) || {};
  // var localHelpers = helpers(patterns) || {};

  // this.cache.helpers = _.extend({}, this.cache.helpers, optsHelpers, localHelpers);
  // console.log(foo)
  // return this.cache.helpers;

  this.extend({helpers: helpers(this.options.helpers)});
  this.extend({helpers: helpers(patterns)});
  return this.get('helpers');
};


/**
 * ## .engine
 *
 * Register the given view engine callback `fn` as `ext`.
 *
 * {%= docs("api-engine") %}
 *
 * @param {String} `ext`
 * @param {Function|Object} `fn` or `options`
 * @param {Object} `options`
 * @return {Assemble} for chaining
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

  if ('.' !== ext[0]) {
    ext = '.' + ext;
  }
  this.engines[ext] = engine;

  var lang = language.lang(ext.replace(/^\./, ''));

  // if the language has mapped delimiters, create a layout stack.
  if (delimiterMap(lang) && delimiterMap(lang).length) {

    // Get the layout delimiters to use for the current engine.
    var getEngineDelims = utils.engineDelims(ext);

    // Create a `Layout` instance for this engine
    var layoutOpts = extend({}, {delims: getEngineDelims}, options);
    this._layouts[ext] = new Layouts(layoutOpts);
  }
  return this;
};


/**
 * ## .render
 *
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

  /**
   * helpers (pass helpers to the engine)
   * partials (pass partials to the engine)
   * engines (pass the default engine and engine cache)
   * layouts (build the layout stack, wrap the string)
   */
  var opts = _.extend({}, this.options, options);
  var helpers = _.extend({}, this.cache.helpers, opts.helpers);
  var partials = _.extend({}, this.cache.partials, opts.partials);

  var engines = this.engines;
  var layouts = this._layouts;

  // reminder!!!
  // _.extend(options, this.locals);

  var settings = {
    defaultEngine: this.get('view engine'),
    engines: engines,
    partials: partials,
    helpers: helpers,
    layouts: layouts
  };

  var view = new View(file, settings);

  try {
    var renderOpts = _.extend({}, settings, opts);
    view.render(renderOpts, callback);
  } catch (err) {
    callback(err);
  }
};


/**
 * ## .parser
 *
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
 * assemble.parser('txt', function (assemble) {
 *   return function (file, options, encoding) {
 *     file.contents = new Buffer(file.contents.toString().toUpperCase());
 *     return file;
 *   };
 * });
 * ```
 *
 * [gray-matter]: https://github.com/assemble/gray-matter
 *
 * @param {String} `name` Optional name of the parser, for debugging.
 * @param {Object} `options` Options to pass to parser.
 * @param {Function} `fn` The parsing function.
 * @return {Assemble} for chaining
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
 * Traverse the middleware stack, passing the `file` object to each
 * middleware and returning the accumlated result.
 *
 * @param  {Object} `options`
 * @api private
 */

Assemble.prototype.route = function (options) {
  var opts = _.extend({}, this.options, options);
  var router = options.router || new Router(options);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble.parse()', 'Streaming not supported'));
      return callback();
    }

    // run middleware
    router.handle(file);
    this.push(file);
    callback();
  });
};


Assemble.prototype.router = function(options) {
  var self = this;
  var router = new Router(options);

  var rte = function() {
    options.router = router;
    return self.router(options);
  };

  rte.route = function(route, fn) {
    router.route(route, fn);
  };
  return rte;
};


/**
 * ## .buffer
 *
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
 * ## .highlight
 *
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
 * ## .watch
 *
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
 * Helper function for defining a getter/setter.
 *
 * @param {String} `name`
 * @param {Function} `getter`
 * @api private
 */

function defineGetter(name, getter) {
  Object.defineProperty(Assemble.prototype, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
}


/**
 * Expose `Assemble`
 */

module.exports = Assemble;
