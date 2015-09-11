'use strict';

/**
 * module dependencies
 */

var path = require('path');
var util = require('util');
var async = require('async');
var runtimes = require('composer-runtimes');
var Boilerplate = require('boilerplate');
var Templates = require('templates');
var Scaffold = require('scaffold');
var Composer = require('composer');
var proto = Composer.prototype;
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
  Composer.apply(this, arguments);
  this.set('Boilerplate', this.options.Boilerplate || Boilerplate);
  this.set('Scaffold', this.options.Scaffold || Scaffold);
  this.boilerplates = {};
  this.scaffolds = {};
  this.init();
}

Templates.inherit(Assemble, Composer);

/**
 * `Assemble` prototype methods
 */

Templates.extend(Assemble, {
  constructor: Assemble,

  /**
   * Initialize Assemble defaults
   */

  init: function() {
    this.defaultEngine();
    this.defaultMiddleware();
    this.defaultViewTypes();
    this.loaded = true;
  },

  /**
   * Default template engine and related extensions.
   */

  defaultEngine: function () {
    this.engine(['hbs', 'html', 'md'], require('engine-handlebars'));
  },

  /**
   * Default middleware
   *  | Ensure user-defined layout is recognized
   *  | Parse front-matter
   */

  defaultMiddleware: function () {
    this.preLayout(/\.(hbs|md|html)$/, function (view, next) {
      if (!view.layout) view.layout = view.locals.layout || view.data.layout;
      next();
    });
    this.onLoad(/\.(hbs|md|html)$/, function (view, next) {
      utils.matter.parse(view, next);
    });
  },

  /**
   * Default `viewTypes`
   *  | partials
   *  | layouts
   *  | pages
   *  | files
   */

  defaultViewTypes: function () {
    this.create('partials', {
      viewType: 'partial',
      renameKey: function (fp) {
        return path.basename(fp, path.extname(fp));
      }
    });

    this.create('layouts', {
      viewType: 'layout',
      renameKey: function (fp) {
        return path.basename(fp, path.extname(fp));
      }
    });

    this.create('pages', {
      renameKey: function (fp) {
        return fp;
      }
    });

    this.create('files', {
      renameKey: function (fp) {
        return fp;
      }
    });
  },

  /**
   * Copy a file from `src` to `dest` and process any templates in
   * `file.contents`.
   *
   * @name .process
   * @param {Object} `file` [Vinyl][] file object.
   * @param {Object} `options`
   * @return {Stream} Returns a stream to continue processing if needed.
   * @api public
   */

  process: function (file, options) {
    options = options || {};
    var pre = options.preprocess || options.pipeline || utils.identity;
    var post = options.postprocess || utils.identity;
    var stream = this.src(file.src);

    stream = pre(stream, this).pipe(this.renderFile(file.data || {}));
    return post(stream, this).pipe(this.dest(file.dest));
  },

  /**
   * Generate all of the `src`/`dest` definitions in the given
   * `config` object. Used for generating [boilerplates][] and
   * [scaffolds][].
   *
   * @name .generate
   * @param {Object} `config` The configuration object to use.
   * @param {Function} `cb` Callback function, exposes `err` on the callback.
   * @return {Object} Returns the `Assemble` instance for chaining.
   * @api public
   */

  generate: function (config, cb) {
    var opts = {};
    opts.preprocess = config.preprocess;
    opts.postprocess = config.postprocess;
    async.each(config.files, function (file, next) {
      utils.parallel(this.process(file, opts), next);
    }.bind(this), cb);
    return this;
  },

  /**
   * Register and/or generate a boilerplate from the given `config`.
   *
   * @name .boilerplate
   * @param {String} `name` The name of the boilerplate to register
   * @param {Object} `config` The configuration object to use.
   * @return {Object} Returns the `Boilerplate` instance for chaining.
   * @api public
   */

  boilerplate: function (name, config) {
    var Boilerplate = this.get('Boilerplate');
    var boilerplate = !(config instanceof Boilerplate)
      ? new Boilerplate(config)
      : config;

    var app = this;
    boilerplate.generate = function (options, cb) {
      var targets = Object.keys(boilerplate.targets);
      async.each(targets, function (target, next) {
        app.generate(target, options, next);
      }, cb);
    };

    this.boilerplates[name] = boilerplate;
    return boilerplate;
  },

  /**
   * Generate a scaffold from the given `config`.
   *
   * @name .scaffold
   * @param {String} `name`
   * @param {Object} `config`
   * @return {Object} Returns the `Assemble` instance for chaining
   * @api public
   */

  scaffold: function (name, config) {
    var Scaffold = this.get('Scaffold');
    var scaffold = !(config instanceof Scaffold)
      ? new Scaffold(config)
      : config;

    var app = this;
    scaffold.generate = function (cb) {
      var args = [].slice.call(arguments);
      args.unshift(this);
      return app.generate.apply(app, args);
    };

    this.scaffolds[name] = scaffold;
    return this;
  },

  /**
   * Glob patterns or filepaths to source files.
   *
   * ```js
   * app.src('src/*.hbs', {layout: 'default'});
   * ```
   * @name .src
   * @param {String|Array} `glob` Glob patterns or file paths to source files.
   * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
   * @api public
   */

  src: function () {
    if (!this.loaded) this.init();
    return utils.vfs.src.apply(utils.vfs, arguments);
  },

  symlink: function () {
    if (!this.loaded) this.init();
    return utils.vfs.symlink.apply(utils.vfs, arguments);
  },

  /**
   * Specify a destination for processed files.
   *
   * ```js
   * app.dest('dist/');
   * ```
   * @name .dest
   * @param {String|Function} `dest` File path or rename function.
   * @param {Object} `options` Options and locals to pass to `dest` plugins
   * @api public
   */

  dest: function () {
    return utils.vfs.dest.apply(utils.vfs, arguments)
      .on('data', function () {}); // TODO: fix this
  },

  /**
   * Copy files with the given glob `patterns` to the specified `destDir`.
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
      .pipe(utils.vfs.dest(dest, options));
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

  toStream: function (collection, fn) {
    var views = this.getViews(collection) || {};
    return utils.through.obj(function (file, enc, cb) {
      this.push(file);
      return cb();
    }, function (cb) {
      Object.keys(views).forEach(function (key) {
        var view = views[key];
        var file = utils.toVinyl(view);
        this.push(file);
      }.bind(this));
      cb();
    });
  },

  /**
   * Render a vinyl file.
   *
   * ```js
   * app.src('*.hbs')
   *   .pipe(app.renderFile());
   * ```
   *
   * @name .renderFile
   * @param  {Object} `locals` Optionally locals to pass to the template engine for rendering.
   * @return {Object}
   * @api public
   */

  renderFile: function (locals) {
    var app = this;
    var collection = this.collection();
    return utils.through.obj(function (file, enc, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }
      var view = collection.view(file);
      app.handleView('onLoad', view)
      app.render(view, locals, function (err, res) {
        if (err) return cb(err);
        res.contents = new Buffer(res.content);
        file = new utils.Vinyl(res);
        cb(null, file);
      });
    });
  },

  /**
   * Define an Assemble task.
   *
   * ```js
   * app.task('default', function() {
   *   app.src('templates/*.hbs')
   *     .pipe(app.dest('dist/'));
   * });
   * ```
   *
   * @name .task
   * @param {String} `name` Task name
   * @param {Function} `fn` function that is called when the task is run.
   * @api public
   */

  task: function (name) {
    runtimes(this);
    if (!this.loaded) this.init();
    return proto.task.apply(this, arguments);
  },

  /**
   * Run one or more tasks.
   *
   * ```js
   * app.run(['foo', 'bar'], function(err) {
   *   if (err) console.error('ERROR:', err);
   * });
   * ```
   * @name .run
   * @param {Array|String} `tasks` Task name or array of task names.
   * @param {Function} `cb` callback function that exposes `err`
   * @api public
   */

  run: function (tasks, cb) {
    return proto.run.apply(this, arguments);
  },

  /**
   * Re-run the specified task(s) when a file changes.
   *
   * ```js
   * app.task('watch', function() {
   *   app.watch('docs/*.md', ['docs']);
   * });
   * ```
   *
   * @param  {String|Array} `glob` Filepaths or glob patterns.
   * @param  {Array} `tasks` Task(s) to watch.
   * @api public
   */

  watch: function (glob, tasks) {
    return proto.watch.apply(this, arguments);
  }
});

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
