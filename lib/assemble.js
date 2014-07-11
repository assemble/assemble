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

var util = require('util');
var path = require('path');
var fs = require('vinyl-fs');
var file = require('fs-utils');
var debug = require('debug')('assemble:core');
var es = require('event-stream');
var expander = require('expander');
var getobject = require('getobject');
var Orchestrator = require('orchestrator');
var plasma = require('plasma');
var template = require('template');
var gutil = require('gulp-util');
var through = require('through2');
var arrayify = require('arrayify-compact');
var _ = require('lodash');

// Externalize
var highlight = require('highlight.js');
var matter = require('gray-matter');
var loadOptions = require('load-options');

// These are temporary here.
//var defaultEngine = require('assemble-handlebars');

var Config = require('./config');
var View = require('./view');
var middleware = require('./middleware');
var renderer = require('./plugins/renderer');
var collection = require('./plugins/collection');

// Parsers
var defaultParser = require('./parsers/front-matter');
var pathParser = require('./parsers/paths');

// Utils

var passthrough = require('./utils/passthrough');
var drafts = require('./plugins/drafts');
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

function Assemble(context, options) {
  Orchestrator.apply(this, arguments);
  Config.apply(this, arguments);

  this._options = _.extend({}, options);
  this.context = _.extend({}, context);

  this._middleware = [];
  this._plugins = {};
}

util.inherits(Assemble, Orchestrator);
_.defaults(Assemble.prototype, Config.prototype);


/**
 * Initialize Assemble.
 *
 *   - setup default configuration
 *   - setup default middleware
 *
 * @api private
 */

Assemble.prototype.init = function() {
  this.cache = {};
  this.locals = [];
  this.layouts = [];
  this._parsers = {};
  this._engines = {};
  this.highlighter = {};
  this.defaultConfig();
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
  this.options({cwd: process.cwd()});

  // default locals
  var env = process.env.NODE_ENV || 'development';
  this.set('env', env);

  this.set('encoding', 'utf8');
  this.set('ext', '.html');

  // Default delimiters
  this.set('delims', ['{%', '%}']);

  // register default engine
  // this.engine('html', require('./engines/engine'));
  // this.engine('hbs', defaultEngine);

  // register Markdown engine
  this.engine('md', require('./engines/remarked'), {
    gfm: true,
    pedantic: false,
    sanitize: false,
    highlight: function (code, lang) {
      return self.highlight(code, lang);
    }
  });

  // default configuration
  this.set('cwd', process.cwd());
  this.set('view', View);
  this.set('views', path.resolve('views'));
  this.set('layouts', path.resolve('layouts'));
  this.set('layout engine', 'hbs');

  // parse front matter
  this.parser('gray-matter', function (assemble) {
    return defaultParser({autodetect: true});
  });

  // Add additional path properties to the file object
  this.parser('path-parser', function (assemble) {
    return pathParser();
  });

  // syntax highlighter
  this.highlight(function (code, lang) {
    if (lang) {
      return highlight.highlight(lang, code).value;
    }
    return highlight.highlightAuto(code).value;
  });

  // Load core middleware
  // this.use(require('./middleware/init')(this, this._build));
};


/**
 * ## .task
 *
 * Define a assemble task.
 *
 * **Example**
 *
 * ```js
 * assemble.task('docs', function() {
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
 * ## .use
 *
 * TODO
 *
 * @param  {[type]} stage
 * @param  {[type]} plugins
 * @return {[type]}
 */

Assemble.prototype.use = function (stage, plugins) {
  if (arguments.length === 1) {
    return (this._plugins[stage] || [passthrough]).map(function (plugin) {
      return plugin(this);
    }.bind(this));
  }
  plugins = arrayify(plugins);
  this._plugins[stage] = (this._plugins[stage] || []).concat(plugins);
};


/**
 * ## .src
 *
 * Glob patterns or filepaths to source files.
 *
 * **Example**
 *
 * ```js
 * assemble.task('docs', function() {
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
  options = _.extend({}, options, {data: data || {}});

  if(this.enabled('minimal config')) {
    return fs.src(glob, options);
  }

  var peek = through.obj(function (file, enc, callback) {
    // console.log('src peek', file.path);
    this.push(file);
    callback();
  });

  peek.setMaxListeners(0);

  return es.pipe.apply(es, _.flatten([
    this.use('first'),
    fs.src(glob, options),
    this.use('parse:before'),
    this._parse(options),
    drafts(this)(options),
    this.use('parse:after'),
    peek
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
 * assemble.task('docs', function() {
 *   assemble.src('src/*.tmpl.md')
 *     .pipe(dest('docs'));
 * });
 * ```
 *
 * @method `dest`
 * @param {String} `filepath`
 * @api public
 */

Assemble.prototype.dest = function (dest, options, data) {
  this.set('assets', '_gh_pages/site/assets');
  _.extend(options, {assets: this.get('assets')});

  if (this.enabled('minimal config')) {
    return fs.dest(dest, options);
  }

  // Resolve template strings.
  var ctx = _.extend({}, options, this.context, data);
  dest = template(dest, ctx);

  var peek = through.obj(function (file, enc, callback) {
    this.push(file);
    callback();
  });

  return es.pipe.apply(es, _.flatten([
    this.collection(options),
    this.use('render:before'),
    this.render(options, data),
    this.use('render:after'),
    fs.dest(dest, options),
    this.use('last'),
    peek
  ]));
};


/**
 * ## .collection
 *
 * This is Assemble's internal collection method, but it's exposed as a public method
 * so it can be replaced with a custom `collection` method.
 *
 * The collection method returns a plugin used to create index
 * and related-pages for collections.
 *
 * @param  {Object} `options` Options used to setup collection definitions.
 * @return {Stream} plugin used in the pipeline.
 */

Assemble.prototype.collection = function (options) {
  options = _.extend({}, {collections: this.get('collections') || []}, options);
  return collection(this)(options);
};


/**
 * ## .partial
 *
 * When only a `key` is provided, returns a parsed partial `str`.
 * When a `key` and `str` are provided, parses the `str` into
 * a partial object and stores it with the `key`.
 *
 * **Example**
 *
 * ```js
 * // store a partial file called 'footer'
 * var str = fs.readFileSync('footer.hbs', 'utf8');
 * assemble.partial('footer', str);
 *
 * // get the 'footer' partial later
 * var footer = assemble.partial('footer');
 * ```
 *
 * @method `partial`
 * @param {String} `key`
 * @param {String} `str`
 * @return {Object} parsed partial
 * @api public
 */

Assemble.prototype.partial = function partial(key, str) {
  if (arguments.length === 1) {
    return this.get('partials.' + key);
  }
  return this.set('partials.' + key, matter(str));
};


/**
 * ## .partials
 *
 * Returns an object with all the parsed partials by their name.
 * Internally uses the resolved partial filepaths from `options.partials`
 * to read in and store any partials not already stored.
 *
 * **Example:**
 *
 * ```js
 * // get all the partials and pass them to Handlebars for use
 * var Handlebars = require('handlebars');
 * var _ = require('lodash');
 *
 * var partials = assemble.partials();
 * _(partials).forEach(function (partial, name) {
 *   Handlebars.registerPartial(name, partial.content);
 * });
 *
 * ```
 *
 * @method `partials`
 * @return {Object} all the parsed partials
 * @api public
 */

Assemble.prototype.partials = function (patterns, options) {
  var files = utils.glob.sync(utils.arrayify(patterns));
  var opts = {};
  var cache = this.cache;
  var engines = this.engines;
  var view;

  // do this next
  //this.get('options.partials');

  files.forEach(function (filepath) {
    filepath = utils.normalize(filepath);

    if (this.exists(filepath)) {
      return this.get(filepath);
    }

    // this.set(filepath, utils.parseFile(filepath));

    var ViewInst = this.get('view');
    new ViewInst(filepath, {
      defaultEngine: this.get('view engine'),
      cwd: this.get('cwd') || this.get('views'),
      engines: engines
    });

  }.bind(this));
  return this.get('partials');
};


/**
 * ## .layout
 *
 * When only a `key` is provided, returns a parsed layout `str`.
 * When a `key` and `str` are provided, parses the `str` into
 * a layout object and stores it with the `key`.
 *
 * **Example**
 *
 * ```js
 * // store a layout file called 'default'
 * var str = fs.readFileSync('default.hbs').toString();
 * assemble.layout('default', str);
 *
 * // get the 'default' layout later
 * var default = assemble.layout('default');
 * ```
 *
 * @method `layout`
 * @param {String} `key`
 * @param {String} `str`
 * @return {Object} parsed layout
 * @api public
 */

Assemble.prototype.layout = function layout(key, str) {
  if (arguments.length === 1) {
    return this.get('layouts.' + key);
  }
  return this.set('layouts.' + key, matter(str));
};


/**
 * ## .layouts
 *
 * Returns an object with all the parsed layouts by their name.
 * Internally uses the resolved layout filepaths from `options.layouts`
 * to read in and store any layouts not already stored.
 *
 * {%= docs("layouts") %}
 *
 * @method `layouts`
 * @return {Object} all the parsed layouts
 * @api public
 */

Assemble.prototype.layouts = function () {
  var filepaths = this.get('options.layouts');

  filepaths.forEach(function (filepath) {
    var basename = file.basename(filepath);
    if (!this.exists('layouts.' + basename)) {
      this.layout(basename, file.readFileSync(filepath));
    }
  }.bind(this));

  return this.get('layouts');
};



/**
 * ## .engine
 *
 * Register the given template engine callback `fn` as `ext`.
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

  this._engines[ext] = engine[ext];
  return this;
};


/**
 * ## .render
 *
 * This is Assemble's internal render method, but it's exposed as a public method
 * so it can be replaced with a custom `render` method.
 *
 * @param  {Object} `data` Data to pass to registered template engines.
 * @param  {Object} `options` Options to pass to registered template engines.
 * @return {String}
 */

Assemble.prototype.render = function (options) {
  options = _.extend({}, this._options, options);
  return renderer(this)(options);
};


/**
 * ## .renderFile
 *
 * This is Assemble's internal render method, but it's exposed as a public method
 * so it can be replaced with a custom `render` method.
 *
 * @param  {Object} `data` Data to pass to registered template engines.
 * @param  {Object} `options` Options to pass to registered template engines.
 * @return {String}
 */

Assemble.prototype.renderFile = function (filepath, options, callback) {
  var opts = {};
  var cache = this.cache;
  var engines = this.engines;
  var view;

  // support callback function as second arg
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // merge assemble.locals
  _.extend(opts, this.locals);

  // extend options._locals
  if (options._locals) {
    _.extend(opts, options._locals);
  }

  // extend options
  _.extend(opts, options);

  // set .cache unless explicitly provided
  opts.cache = null == opts.cache ? this.enabled('view cache') : opts.cache;

  // primed cache
  if (opts.cache) {
    view = cache[filepath];
  }

  // view
  if (!view) {
    var ViewInst = this.get('view');
    view = new ViewInst(filepath, {
      defaultEngine: this.get('view engine'),
      cwd: this.get('views'),
      engines: engines
    });

    if (!view.filepath) {
      var err = new Error('Failed to lookup view "' + filepath + '" in "' + view.cwd + '"');
      err.view = view;
      return callback(err);
    }

    // prime the cache
    if (opts.cache) {
      cache[filepath] = view;
    }
  }

  // render
  try {
    view.renderFile(opts, callback);
  } catch (err) {
    callback(err);
  }
};


/**
 * ## .parse
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
 * @param {String} `name` Optional name of the parser, for debugging.
 * @param {Object} `options` Options to pass to parser.
 * @param {Function} `fn` The parsing function.
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.parser = function (name, fn) {
  if (typeof fn !== 'function') {
    debug('assemble.parser() exception: ' + name);
  }
  this._parsers[name] = fn(this);
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
  var opts = _.extend({}, this._options, srcOptions);
  var parsers = this._parsers;

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble._parse()', 'Streaming not supported'));
      return callback();
    }

    _.forOwn(parsers, function (parser, name) {
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