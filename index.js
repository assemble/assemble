'use strict';

/**
 * module dependencies
 */

var path = require('path');
var async = require('async');
var runtimes = require('composer-runtimes');
var Templates = require('templates');
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
  this.isAssemble = true;
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
    this.defaultTemplates();
    var app = this;

    this.on('option', function (key) {
      for (var k in app.views) {
        if (app.views.hasOwnProperty(k)) {
          reloadViews(k, key, app.views[k], app.options);
        }
      }
    });

    function reloadViews(name, key, views, options) {
      if (typeof app[name][key] !== 'function') {
        app.create(name, utils.merge({}, views.options, options));
        delete views.options;
        app[name].addViews(views);
      }
    }

    this.option('view', function (view) {
      if (view.src) view.path = view.src;
    });
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

  defaultTemplates: function () {
    // this.visit('scaffold', require('./templates/scaffolds'));
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
    if (file == null || typeof file !== 'object') {
      throw new TypeError('process expects file to be an object.');
    }

    file.src = Array.isArray(file.src) ? file.src[0] : file.src;
    file.path = file.path || file.src;
    var view = this.view(file.path, file);

    var opts = utils.extend({}, this.options, options, view.options);
    view.dest = view.dest || opts.dest;
    if (!view.dest) {
      throw new Error('process expects file to have a dest defined.');
    }

    // get cwd and base to use
    opts.cwd = opts.cwd || view.cwd;
    opts.base = opts.base || view.base;

    // these are necessary since `view` adds a `cwd` if not defined
    if (this.options.cwd && view.cwd === process.cwd()) {
      opts.cwd = this.options.cwd || opts.cwd;
    }
    if (this.options.base && view.base === process.cwd()) {
      opts.base = this.options.base || opts.base;
    }

    var pre = opts.preprocess || opts.pipeline || utils.identity;
    var post = opts.postprocess || utils.identity;

    var stream = this.src(view.path, opts);
    stream = utils.combine(pre(stream, this), this.renderFile());
    stream = utils.combine(post(stream, this), this.dest(view.dest, opts));
    return stream;
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
    return utils.vfs.src.apply(utils.vfs, arguments);
  },

  /**
   * Glob patterns or paths for symlinks.
   *
   * ```js
   * app.symlink('src/**');
   * ```
   * @name .symlink
   * @param {String|Array} `glob`
   * @api public
   */

  symlink: function () {
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
    var stream = utils.through.obj();
    setImmediate(function () {
      Object.keys(views).forEach(function (key) {
        var view = views[key];
        var file = utils.toVinyl(view);
        stream.write(file);
      });
      stream.end();
    });
    return utils.srcStream(stream);
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
      app.handleView('onLoad', view);
      var ctx = utils.merge({}, app.cache.data, locals, view.data);
      app.render(view, ctx, function (err, res) {
        if (err) return cb(err);
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

  run: function (/*tasks, cb*/) {
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

  watch: function (/*glob, tasks*/) {
    return proto.watch.apply(this, arguments);
  }
});

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
