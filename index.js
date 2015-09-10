'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Boilerplate = require('boilerplate');
var Scaffold = require('scaffold');
var Composer = require('composer');
var Templates = require('templates');
var utils = require('./lib/utils');

/**
 * Create a Assemble application. The `assemble()` function
 * is the main function exported by the assemble module.
 *
 * ```js
 * var assemble = require('assemble');
 * var app = assemble();
 * ```
 *
 * @param {Object} `options` Optionally pass default options to use.
 * @api public
 */

function Assemble(options) {
  if (!(this instanceof Assemble)) {
    return new Assemble(options);
  }
  Templates.apply(this, arguments);
  Composer.apply(this, arguments);
  this.init();
}

Templates.extend(Assemble, {
  constructor: Assemble,

  init: function() {
    this.engine(['hbs', 'html', 'md'], require('engine-handlebars'));

    this.preLayout(/\.(hbs|md|html)$/, function (view, next) {
      if (!view.layout) view.layout = view.locals.layout || view.data.layout;
      next();
    });

    this.onLoad(/\.(hbs|md|html)$/, function (view, next) {
      utils.matter.parse(view, next);
    });

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

    this.loaded = true;
  },

  generate: function (config, cb) {
    // generate(config, cb);
    return this;
  },

  boilerplate: function (name, config) {
    this.boilerplates[name] = new Boilerplate(config);
    return this;
  },

  scaffold: function (name, config) {
    this.scaffolds[name] = new Scaffold(config);
    return this;
  },

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
    if (!this.loaded) this.init();
    return utils.vfs.src.apply(utils.vfs, arguments);
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
    return utils.dest.apply(utils.dest, arguments);
  },

  task: function (name) {
    var task = Composer.prototype.task;
    if (!this.loaded) this.init();
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
    return utils.vfs.src(patterns, opts)
      .pipe(utils.vfs.dest(destDir, opts));
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
    var views = this.getViews(plural) || {};
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
    // TODO: update template to use pascalcase
    var File = this[this.taskName()];
    var self = this;

    return utils.through.obj(function (file, enc, cb) {
      if (typeof locals === 'function') {
        cb = locals;
        locals = {};
      }

      self.render(new File(file), locals, function (err, res) {
        if (err) return cb(err);
        res.contents = new Buffer(res.content);
        file = new utils.Vinyl(res);
        cb(null, file);
      });
    });
  }
});

utils.extend(Assemble.prototype, Composer.prototype);

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
