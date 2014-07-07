/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var path = require('path');
var fs = require('vinyl-fs');
var file = require('fs-utils');
var debug = require('debug')('assemble');
var expander = require('expander');
var getobject = require('getobject');
var matter = require('gray-matter');
var Orchestrator = require('orchestrator');
var loadOptions = require('load-options');
var plasma = require('plasma');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var lazypipe = require('lazypipe');

var View = require('./view');
var middleware = require('./middleware');


// These are temporary here.
var defaultEngine = require('assemble-handlebars');
var defaultParser = require('assemble-gray-matter');


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

  this._options = _.extend({}, options);
  this.context = _.extend({}, context);

  // _.extend(this, new Context(context));
  // _.extend(this, new Options(options));

  this._engine = this._engine || this._options.engine || defaultEngine;
  this._parser = this._parser || this._options.parser || defaultParser;
  this._middleware = [];
  this._plugins = [];
}

util.inherits(Assemble, Orchestrator);


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
  this.locals = {};
  this.engines = {};
  this.parsers = [];
  this.layouts = [];
  this.partials = [];
  this.stack = [];
  this.settings = {};
  this.highlighter = {};
  this.engines = {};
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
  this.disabled('minimal config');

  // default locals
  this.locals.context = this.context;
  var env = process.env.NODE_ENV || 'development';
  this.set('env', env);

  // setup locals
  this.locals = Object.create(null);

  // default locals
  this.locals.settings = this.settings;

  // default configuration
  this.set('view', View);
  this.set('views', path.resolve('views'));
  this.set('layouts', path.resolve('layouts'));
  this.set('layout engine', 'hbs');

  // register default engine
  this.engine('hbs', defaultEngine);

  // register Markdown engine
  this.engine('md', require('remarked-engine'), {
    gfm: true,
    pedantic: false,
    sanitize: false,
    highlight: function (code, lang) {
      return self.highlight(code, lang);
    }
  });

  // parse front matter
  // this.parse(function (str) {
  //   return matter(str, {autodetect: true});
  // });

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
  if(this.enabled('minimal')) {
    return this._src = fs.src(glob, options);
  }

  var peek = through.obj(function (file, enc, callback) {
    console.log('src peek', file);
    this.push(file);
    callback();
  });

  options = options || {};
  return this._src = lazypipe()
    .pipe(fs.src, glob, options)
    .pipe(this.parser, options)
    .pipe(this.engine, data || {}, options)
    // .pipe(this.route, dest, options))
    .pipe(function () {
      return peek;
    })();
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

Assemble.prototype.dest = function (dest, options) {
  if (this.enabled('minimal')) {
    return fs.dest(dest, options);
  }

  var peek = through.obj(function (file, enc, callback) {
    console.log('dest peek', file);
    this.push(file);
    callback();
  });

//  peek = peek.pipe(fs.dest(dest, options));
//  peek.resume();
//  return peek;

  return lazypipe()
    .pipe(function () { return peek; })
    .pipe(fs.dest, dest, options)();

};


/**
 * ## .use
 *
 * If the option is true, use the given middleware, otherwise use noop.
 *
 * **Example**
 * ```js
 *  return fs.src(pattern, options)
 *    .pipe(this.use(options.parse, this.parse)(options))
 *    .pipe(this.use(options.render, this.parse)(options));
 * ```
 * @param {Mixed} `option` a value that can be truthy if the middleware should be used.
 * @param {Function} `middleware` The middleware to return when `option` is truthy
 * @returns {Function} the middleware or noop function to use.
 * @private
 */

Assemble.prototype.use = function (option, middleware) {
  return option ? middleware : function () {
    return gutil.noop;
  };
};


/**
 * ## .tag
 *
 * Register a tag to be used in templates.
 *
 * **Example**
 *
 * ```js
 * // custom tag to include content from other files
 * assemble.tag('partial', function (filepath) {
 *   return require('fs').readFileSync(filepath, 'utf8');
 * });
 * ```
 * Usage:
 *
 * ```js
 * {%%= partial("foo.md") %}
 * ```
 * @method `tag`
 * @param {String} `key`
 * @param {*} `value`
 * @param {Boolean} `expand`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.tag = function (name, fn, opts) {
  var tag = {};
  if (arguments.length === 2) {
    if (typeof name === 'string' && typeof fn === 'function') {
      tag[name] = fn;
      name = tag;
    } else {
      opts = fn;
    }
  }
  this.plasma(name, opts);
  return this;
};


Assemble.prototype.page = function page() {};


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
 * **Example**
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

Assemble.prototype.partials = function () {
  var filepaths = this.get('options.partials');
  filepaths.forEach(function (filepath) {
    var basename = file.basename(filepath);
    if (!this.exists('partials.' + basename)) {
      this.partial(basename, file.readFileSync(filepath));
    }
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
 * **Example**
 *
 * ```js
 * // get all the layouts and pass them to assemble-layouts for use
 * var assembleLayouts = new require('assemble-layouts').Layouts();
 * var _ = require('lodash');
 *
 * var layouts = assemble.layouts();
 * _(layouts).forEach(function (layout, name) {
 *   assembleLayouts.set(name, layout);
 * });
 *
 * ```
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
 * ## .set
 *
 * Assign `value` to `key`.
 *
 * **Example**
 *
 * ```js
 * assemble.set('a', {b: 'c'});
 *
 * // expand template strings with expander
 * assemble.set('a', {b: 'c'}, true);
 * ```
 *
 * Visit [expander's docs](https://github.com/tkellen/expander) for more info.
 *
 * @method `set`
 * @param {String} `key`
 * @param {*} `value`
 * @param {Boolean} `expand`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.set = function set(key, value, expand) {
  if (expand) {
    expander.set(this.context, key, value);
  } else {
    getobject.set(this.context, key, value);
  }
  return this;
};


/**
 * ## .get
 *
 * Return the stored value of `key`.
 *
 * ```js
 * assemble.set('foo', 'bar')
 * assemble.get('foo')
 * // => "bar"
 * ```
 *
 * @method get
 * @param {*} `key`
 * @param {Boolean} `create`
 * @return {*}
 * @api public
 */

Assemble.prototype.get = function get(key, create) {
  return getobject.get(this.context, key, create);
};


/**
 * ## .constant
 *
 * Set a constant on the config.
 *
 * **Example**
 *
 * ```js
 * assemble.constant('site.title', 'Foo');
 * ```
 *
 * @method `constant`
 * @param {String} `key`
 * @param {*} `value`
 * @chainable
 * @api public
 */

Assemble.prototype.constant = function constant(key, value){
  var getter;
  if (typeof value !== 'function'){
    getter = function() {
      return value;
    };
  } else {
    getter = value;
  }
  this.context.__defineGetter__(key, getter);
  return this;
};


/**
 * ## .enabled (key)
 *
 * Check if `key` is enabled (truthy). (express inspired)
 *
 * ```js
 * assemble.enabled('foo')
 * // => false
 *
 * assemble.enable('foo')
 * assemble.enabled('foo')
 * // => true
 * ```
 *
 * @method enabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Assemble.prototype.enabled = function enabled(key){
  return !!this.get(key);
};


/**
 * ## .disabled (key)
 *
 * Check if `key` is disabled. (express inspired)
 *
 * ```js
 * assemble.disabled('foo')
 * // => true
 *
 * assemble.enable('foo')
 * assemble.disabled('foo')
 * // => false
 * ```
 *
 * @method disabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Assemble.prototype.disabled = function disabled(key){
  return !this.get(key);
};


/**
 * ## .enable (key)
 *
 * Enable `key`.  (express inspired)
 *
 * **Example**
 *
 * ```js
 * assemble.enable('foo');
 * ```
 *
 * @method enable
 * @param {String} `key`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.enable = function enable(key){
  return this.set(key, true);
};


/**
 * ## .disable (key)
 *
 * Disable `key`. (express inspired)
 *
 * **Example**
 *
 * ```js
 * assemble.disable('foo');
 * ```
 *
 * @method disable
 * @param {String} `key`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.disable = function disable(key){
  return this.set(key, false);
};


/*
 * ## .exists
 *
 * Return `true` if the element exists. Dot notation may be used for nested properties.
 *
 * **Example**
 *
 * ```js
 * assemble.exists('author.name');
 * //=> true
 * ```
 *
 * @method  `exists`
 * @param   {String}  `key`
 * @return  {Boolean}
 * @api public
 */

Assemble.prototype.exists = function exists(key) {
  return getobject.exists(this.context, key);
};


/**
 * ## .merge
 *
 * Extend the config with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .merge({foo: 'bar'}, {baz: 'quux'});
 *   .merge({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method merge
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.merge = function merge() {
  var args = [].slice.call(arguments);
  _.merge.apply(_, [this.context].concat(args));
  return this;
};


/**
 * ## .config
 *
 * Extend the config with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .extend({foo: 'bar'}, {baz: 'quux'});
 *   .extend({fez: 'bang'});
 * ```
 *
 * @method `config`
 * @alias `extend`
 * @param {Object} `arguments`
 * @return {Assemble} for chaining
 * @chainable
 * @api public
 */

Assemble.prototype.config =
Assemble.prototype.extend = function extend() {
  var args = [].slice.call(arguments);
  _.extend.apply(_, [this.context].concat(args));
  return this;
};


/**
 * ## .options
 *
 * Extend the options with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .options({templates: 'src/templates'});
 * ```
 *
 * @method `options`
 * @param {Object} `options`
 * @return {Assemble} for chaining
 * @chainable
 * @api public
 */

Assemble.prototype.options = function (options) {
  return this.extend({}, this._options, loadOptions(options));
  // console.log(this._options)
  // return this;
};


/**
 * ## .plasma
 *
 * Extend the context with the given object using [plasma](https://github.com/jonschlinkert/plasma).
 * This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .plasma({foo: 'bar'}, {baz: 'quux'});
 *   .plasma({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method plasma
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.plasma = function (data, opts) {
  this.extend(plasma(data, opts));
  return this;
};


/**
 * ## .data
 *
 * Proxy for `config.plasma()`.
 *
 * @chainable
 * @method `data`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.data = function (data, opts) {
  if (!arguments.length) {
    return this;
  }
  this.plasma(data, opts);
  return this;
};


/**
 * ## .engine
 *
 * Register the given template engine callback `fn` as `ext`.
 *
 * Template engines in Assemble are used to render:
 *
 *   - views:   Such as pages and partials. Views are used when generating
 *              web pages. The path of the layout file will be passed to the
 *              engine's `renderFile()` function.
 *
 *   - layouts: Views used when generating web pages.  The path of the layout
 *              file will be passed to the engine's `renderFile()` function.
 *
 *   - content: Text written in lightweight markup, which optionally has front
 *              matter.  Front matter will be removed from the content prior to
 *              rendering. `data` from front matter is merged into the context
 *              and passed to the engine's `render()` function.
 *
 * By default Assemble will `require()` the engine based on the file extension.
 * For example if you try to render a "foo.hbs" file Assemble will invoke the
 * following internally:
 *
 * ```js
 * var engine = require('engines')
 * assemble.engine('hbs', engine.handlebars);
 * ```
 *
 * The module is expected to export a `.renderFile` function, or, for
 * compatibility with Express, an `__express` function.
 *
 * For engines that do not provide `.renderFile` out of the box, or if you wish
 * to "map" a different extension to the template engine you may use this
 * method. For example mapping the EJS template engine to ".html" files:
 *
 * ```js
 * assemble.engine('html', require('ejs').renderFile);
 * ```
 *
 * Additionally, template engines are used to render lightweight markup found in
 * content files.  For example using Textile:
 *
 * ```js
 * assemble.engine('textile', require('textile-engine'));
 * ```
 *
 * In this case, it is expected that the module export a `render` function which
 * will be passed content data (after removing any front matter).
 *
 * @param {String} `ext`
 * @param {Function} `fn`
 * @param {Object} `options`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.engine = function (ext, fn, options) {
  var engine = {};

  if (typeof fn === 'object') {
    engine.renderFile = fn.renderFile || fn.__express;
    engine.render = fn.render;
    engine.options = options;
  } else if (typeof fn === 'function') {
    engine.renderFile = fn;
  }

  if (typeof engine.renderFile !== 'function') {
    throw new Error('`engine` is expected to have a `renderFile` method.');
  }

  if (ext[0] !== '.') {
    ext = '.' + ext;
  }

  this.engines[ext] = engine;
  return this;
};


/**
 * ## .engine
 *
 * @method `engine`
 * @param {Object} `data`
 * @param {Object} `options`
 * @api public
 */

// Assemble.prototype.engine = function (name, fn, options) {
//   return this._engine(this)(options);
// };


/**
 * ## .parser
 *
 * @method `parser`
 * @param {String} `str` Un-parsed file content.
 * @param {Object} `options` Options to pass to the parser.
 * @api public
 */

Assemble.prototype.parser = function (str, options) {
  return this._parser(this)(str, options);
};


/**
 * ## .parse
 *
 * Register `fn` used to parse front matter.
 *
 * By default, Assemble will parse front matter using [gray-matter][gray-matter].
 * It is probably not necessary to register additional parsing functions, since
 * gray-matter can support almost any format, but this is cusomizable if
 * necessary or if a non-supported format is required.
 *
 * **Example:**
 *
 * ```js
 * assemble.parse(function(data) {
 *   return JSON.parse(data);
 * });
 * ```
 *
 * [gray-matter]: https://github.com/assemble/gray-matter
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.parse = function (name, fn) {
  if (typeof name === 'function') {
    fn = name;
    name = 'default';
  }
  if (typeof fn === 'function') {
    this.parsers.push(fn);
    return this;
  }

  // Traverse the stack of parsers and attempt to parse front matter
  var parsers = this.parsers;
  var data = fn;

  for (var i = 0, len = parsers.length; i < len; i++) {
    var parse = parsers[i];
    try {
      var obj = parse(data);
      if (obj && typeof obj === 'object') {
        return obj;
      }
    } catch (err) {
      debug('parse exception: ' + err);
    }
  }
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
 * ## .process
 *
 * Recursively expand template strings into their resolved values.
 *
 * **Example**
 *
 * ```js
 * assemble.process({a: '<%= b %>', b: 'c'});
 * //=> {a: 'c', b: 'c'}
 * ```
 *
 * @param {String} `key`
 * @param {Any} `value`
 */

Assemble.prototype.process = function process(locals, options) {
  return expander(locals, this.merge(locals), options || {});
};


/**
 * ## .remove(key)
 *
 * Remove an element by `key`.
 *
 * **Example**
 *
 * ```js
 * assemble.remove('foo');
 * ```
 *
 * @method remove
 * @param {*} `key`
 * @api public
 */

Assemble.prototype.remove = function remove(key) {
  delete this.context[key];
};


/**
 * ## .omit
 *
 * Omit properties from the config.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .omit('foo');
 *   .omit('foo', 'bar');
 *   .omit(['foo']);
 *   .omit(['foo', 'bar']);
 * ```
 *
 * **Params:**
 *
 * @chainable
 * @method omit
 * @return {Assemble} for chaining
 * @api public
 */

Assemble.prototype.omit = function omit() {
  var args = [].slice.call(arguments);
  var keys = [this.context].concat(args);
  _.omit.apply(_, keys);
  return this;
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