'use strict';

var path = require('path');
var util = require('util');
var defaults = require('object.defaults');
var delegate = require('delegate-properties');
var extend = require('extend-shallow');
var pascal = require('pascalcase');
var lazy = require('lazy-cache')(require);

/**
 * Lazily required module dependencies
 */

lazy('through2', 'through');
lazy('template-config', 'config');
lazy('parser-front-matter', 'matter');
lazy('vinyl-fs', 'vfs');
lazy('vinyl', 'Vinyl');
lazy('to-vinyl');
lazy('dest');
lazy('inflection');

/**
 * Extend `Assemble`
 */

// var Boilerplate = lazy('boilerplate');
// var Generate = lazy('generate');
// var Scaffold = lazy('scaffold');
var Composer = require('composer');
var Template = require('template');
// var Snippet = lazy('snippet');

/**
 * Create an instance of `Assemble` with the given `options`.
 *
 * ```js
 * var Assemble = require('assemble');
 * var app = new Assemble();
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

function Assemble(options) {
  if (!(this instanceof Assemble)) {
    return new Assemble(options);
  }
  Template.apply(this, arguments);
  Composer.call(this, 'assemble');
}

Template.extend(Assemble);
extend(Assemble.prototype, Composer.prototype);

/**
 * Default configuration
 */

delegate(Assemble.prototype, {
  constructor: Assemble,

  defaultConfig: function() {
    this.mixin('config', lazy.config(this));

    var exts = ['hbs', 'html', 'md'];
    this.engine(exts, require('engine-handlebars'));


    this.onLoad(/\.(hbs|md|html)$/, function (view, next) {
      lazy.matter.parse(view, next);
    });

    this.preLayout(/./, function (view, next) {
      if (/\.(hbs|md|html)$/.test(view.path)) {
        if (!view.layout) view.layout = view.locals.layout;
        if (!view.layout) view.layout = view.data.layout;
      } else {
        view.layout = null;
      }
      next();
    });

    this.preRender(/\.(hbs|md|html)$/, function (view, next) {
      extend(view.data, view.parsePath())
    });

    this.create('partials', {
      viewType: ['partial'],
      renameKey: function (fp) {
        return path.basename(fp, path.extname(fp));
      }
    });

    this.create('layouts', {
      viewType: ['layout'],
      renameKey: function (fp) {
        return path.basename(fp, path.extname(fp));
      }
    });

    this.create('pages', {
      renameKey: function (fp) {
        return fp;
      }
    });

    this.loaded = true;
  },

  // boilerplate: function (name, config) {
  //   this.boilerplates[name] = new Boilerplate(config);
  //   return this;
  // },

  // scaffold: function (name, config) {
  //   this.scaffolds[name] = new Scaffold(config);
  //   return this;
  // },

  // snippet: function (name, config) {
  //   this.snippets[name] = new Snippet(config);
  //   return this;
  // },

  /**
   * Glob patterns or filepaths to source files.
   *
   * ```js
   * app.src('src/*.hbs', {layout: 'default'});
   * ```
   *
   * @param {String|Array} `glob` Glob patterns or file paths to source files.
   * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
   * @api public
   */

  src: function (glob, options) {
    if (!this.loaded) this.defaultConfig();
    var name = this.taskName();
    // TODO: should template use camelcase?
    this[name](glob, options);
    var stream = this.toStream(name);
    process.nextTick(function () {
      stream.end();
    });
    return stream;
  },

  /**
   * Specify a destination for processed files.
   *
   * ```js
   * app.dest('dist/');
   * ```
   *
   * @param {String|Function} `dest` File path or rename function.
   * @param {Object} `options` Options and locals to pass to `dest` plugins
   * @api public
   */

  dest: function (/*dest, options*/) {
    return lazy.dest.apply(lazy.dest, arguments);
  },

  task: function (name) {
    var task = Composer.prototype.task;
    if (!this.loaded) this.defaultConfig();
    var key = 'task_' + name;
    this.create(key, {
      renameKey: function (fp) {
        return fp;
      }
    });
    return task.apply(this, arguments);
  },

  /**
   * Copy files with the given glob `patterns` to the specified `destDir`.
   *
   * ```js
   * app.task('assets', function() {
   *   app.copy('assets/**', 'dist/');
   * });
   * ```
   *
   * @param {String|Array} `patterns` Glob patterns of files to copy.
   * @param  {String|Function} `destDir` Desination directory.
   * @return {Stream} Stream, to continue processing if necessary.
   * @api public
   */

  copy: function(patterns, destDir, opts) {
    return lazy.vfs.src(patterns, opts)
      .pipe(lazy.vfs.dest(destDir, opts));
  },

  /**
   * Push a view collection into a vinyl stream.
   *
   * @param {String} `plural`
   * @param {Object} `locals`
   * @return {Stream}
   * @api public
   */

  toStream: function (plural, locals) {
    if (!this.views.hasOwnProperty(plural)) {
      plural = this.inflections[plural];
    }
    var views = this.views[plural] || {};
    return lazy.through.obj(function (file, enc, cb) {
      this.push(file);
      return cb();
    }, function (cb) {
      Object.keys(views).forEach(function (key) {
        var view = views[key];
        var file = lazy.toVinyl(view);
        this.push(file);
      }.bind(this));
      cb();
    });
  },

  taskName: function () {
    var task = this.session.get('task');
    return (task ? 'task_' + task.name : 'file');
  },

  /**
   * Render a vinyl file.
   *
   * @param  {Object} file
   * @param  {Function} cb Callback
   * @return {Object}
   * @api public
   */

  renderFile: function (locals) {
    var name = this.taskName();
    var collection = this.views[name];
    var self = this;

    return lazy.through.obj(function (file, enc, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }

      collection.set(file.path, file);
      self.render(collection.get(file.path), locals, function (err, res) {
        if (err) return cb(err);
        res.contents = new Buffer(res.content);
        file = new lazy.Vinyl(res);
        cb(null, file);
      });
    });
  }
});

/**
 * Static method for allowing other classes to inherit
 * both prototype and static methods from `Assemble`.
 *
 * ```js
 * function MyApp(options) {...}
 * Assemble.extend(MyApp);
 * ```
 *
 * @param  {Object} `Ctor` Constructor function to extend with `Assemble`
 * @return {undefined}
 * @api public
 */

Assemble.extend = function(Ctor) {
  util.inherits(Ctor, Assemble);
  delegate(Ctor, Assemble);
};

/**
 * Expose an instance of `Assemble`
 */

module.exports = new Assemble();

/**
 * Allow users to instantiate `Assemble`.
 */

module.exports.Assemble = Assemble;
