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

var Orchestrator = require('orchestrator');
var arrayify = require('arrayify-compact');
var delimsMap = require('delimiter-map');
var template = require('template');
var hljs = require('highlight.js');
var through = require('through2');
var es = require('event-stream');
var gutil = require('gulp-util');
var file = require('fs-utils');
var fs = require('vinyl-fs');
var util = require('util');
var _ = require('lodash');


/**
 * Local modules.
 */

var ViewCache = require('./view/view-cache');
var Layout = require('./view/layout');
var Options = require('./option');
var Config = require('./config');
var Data = require('./data');
var View = require('./view');

// Plugins and middleware
var defaultParser = require('./parsers/front-matter');
var collection = require('./plugins/collection');
var renderer = require('./plugins/renderer');
var pathParser = require('./parsers/paths');
var middleware = require('./middleware');
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


	/**
	 * ## .option
	 *
	 * Get, set and extend assemble options, `assemble.option` has all
	 * of the same methods as `assemble`, but dedicated to options handling.
	 *
	 * **Example**
	 *
	 * ```js
	 * assemble
	 *   .option('layouts', 'src/layouts')
	 *   .option('partials', 'src/partials/*.hbs');
	 * ```
	 *
	 * @class Options
	 * @param {*} `options`
	 * @api public
	 */

  this.option = new Options(options);
  this.options = this.option.cache;
  this.orig = new Config();

  this.partial = new ViewCache(options);
  this.layout = new ViewCache(options);

  // make sure a new instance of Layout is created
  new Layout(this);
}

util.inherits(Assemble, Orchestrator);


/**
 * Extend `Assemble`
 */

_.defaults(Assemble.prototype, Config.prototype);
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
  this.middleware = [];
  this.plugins = {};
  this.locals = {};
  this.engines = {};
  this.defaultConfig(options);
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

Assemble.prototype.defaultConfig = function () {
  var self = this;

  // Disable minimal config option by default.
  this.disabled('minimal config');

  // Set the environment
  var env = process.env.NODE_ENV || 'development';
  this.set('env', env);

  this.set('encoding', 'utf8');
  this.set('cwd', process.cwd());
  this.set('ext', '.html');

  this.set('view', View);
  this.set('view engine', 'html');
  this.set('views', 'templates');

  // Prime the `data` cache
  this.set('data', {});
  this.set('front matter', {autodetect: true});

  // parse front matter
  this.parser('gray-matter', function (/*assemble*/) {
    var opts = self.get('front matter');
    return defaultParser(opts);
  });

  // Add additional path properties to the file object
  this.parser('path-parser', function (/*assemble*/) {
    return pathParser();
  });

  // Default view engine
  this.engine('html', require('./engine/html'));

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
 * ## .use
 *
 * Run assemble middleware
 *
 * @param  {[type]} stage
 * @param  {[type]} plugins
 * @return {[type]}
 */

Assemble.prototype.use = function (stage, plugins) {
	if (typeof stage === 'function') {
  	var current = this.plugins[stage] || gutil.noop();
    return current.map(function (plugin) {
      return plugin(this);
    }.bind(this));
  }

  this.plugins[stage] = (this.plugins[stage] || []).concat(arrayify(plugins));
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

Assemble.prototype.src = function (glob, options, data) {
  options = _.extend({}, this.options, options);
  if(this.enabled('minimal config')) {
    return fs.src(glob, options, data);
  }
  return es.pipe.apply(es, utils.arrayify([
    fs.src(glob, options, data),
    utils.src.call(this, glob, options, data)
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

  // Resolve template strings.
  var ctx = _.extend({}, options, this.cache);
  dest = template(dest, ctx);

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
  _.extend(options, {collections: collections});
  return collection(this)(options);
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
 * assemble.partials('templates/partials/*.hbs');
 * ```
 *
 * This method may be used as an alternative to, or in conjunction with,
 * `options.partials`, (e.g. `assemble.options({partials: '*.hbs'})`).
 * If both are defined, the results are combined.
 *
 * @method `partials`
 * @param {String} `patterns` File paths or glob patterns to partials.
 * @param {String} `options`
 * @return {Object}
 * @api public
 */

Assemble.prototype.partials = function (patterns, options) {
  patterns = _.union([], patterns, this.options['partials']);
  this.partial.cache(patterns, options);
  return this.partial.get();
};


/**
 * ## .layouts
 *
 * Returns an object with all the parsed layouts by their name.
 * Internally uses the resolved layout filepaths from `options.layouts`
 * to read in and store any layouts not already stored.
 *
 * {%= docs("api-layouts") %}
 *
 * @method `layouts`
 * @return {Object} all the parsed layouts
 * @api public
 */

Assemble.prototype.layouts = function (patterns, options) {
  patterns = _.union([], patterns, this.options['layouts']);
  this.layout.cache(patterns, options);
  return this.layout.get();
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
  patterns = _.union([], patterns, this.options['helpers']);
  var helpers = utils.helper({helpers: patterns});
  return helpers;
};


/**
 * ## .engine
 *
 * Register the given view engine callback `fn` as `ext`.
 *
 * {%= docs("engine") %}
 *
 * @param {String} `ext`
 * @param {Function} `fn`
 * @param {Object} `options`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.engine = function(ext, options, fn) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  var engine = {};
  engine[ext] = {};

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  if (typeof fn === 'function') {
    engine[ext].renderFile = fn;
    engine[ext].render = engine[ext].renderFile.render;
  } else if (typeof fn === 'object') {
    engine[ext].renderFile = fn.renderFile || fn.__express;
    engine[ext].render = fn.render;
    engine[ext].options = _.extend({}, options);
  }

  if ('function' !== typeof engine[ext].renderFile) {
    throw new gutil.PluginError('Assemble', 'Engines are expected to have a `renderFile` method.');
  }

  this.engines[ext] = engine[ext];

  // Create a `Layout` instance for this engine (`ext`)
  var layout = new Layout(this);
  options = _.extend({delims: delimsMap(utils.trim(ext, '.'))}, options);

  // Pass options to the current engine.
  layout.set(ext, options);
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
 */

Assemble.prototype.render = function (options, data) {
  options = _.extend({}, this.options, options);
  return renderer(this)(options, data);
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
 * assemble.parser('uppercase', function (assemble) {
 *   return function (file, options, encoding) {
 *     file.contents = new Buffer(file.contents.toString().toUpperCase());
 *     return file;
 *   };
 * });
 * ```
 *
 * [gray-matter]: https://github.com/assemble/gray-matter
 *
 * @method `parser`
 * @param {String} `name` Optional name of the parser, for debugging.
 * @param {Object} `options` Options to pass to parser.
 * @param {Function} `fn` The parsing function.
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.parser = function (name, fn) {
  if (typeof fn !== 'function') {
  	throw new gutil.PluginError('assemble.parser() exception', name);
  }
  this.set('parsers.' + name, fn(this));
  return this;
};


/**
 * ## ._parse
 *
 * Traverse the parser stack, passing the `file` object to each parser
 * returning the accumlated result.
 *
 * @param  {Object} `options`
 * @api private
 */

Assemble.prototype._parse = function (srcOptions) {
  var opts = _.extend({}, this.options, srcOptions);
  var parsers = this.cache.parsers;

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble._parse()', 'Streaming not supported'));
      return callback();
    }

    _.forOwn(parsers, function (parser) {
      try {
        file = parser(file, encoding, opts);
      } catch (err) {
        this.emit('error', new gutil.PluginError('assemble._parse() parsing error.', err));
      }
    });

    this.push(file);
    callback();
  });
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
 * Expose `Assemble`
 */

module.exports = Assemble;