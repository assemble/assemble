'use strict';

/**
 * module dependencies
 */

var path = require('path');
var cli = require('./lib/cli');
var utils = require('./lib/utils');
var Core = require('assemble-core');
var debug = Core.debug;

/**
 * Create an `assemble` app. This is the main function exported
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

  this.options = utils.merge({}, this.options, options);
  Core.call(this, options);
  this.is(Assemble);
  debug(this);

  this.initDefaults(this);
  this.initPlugins(this);
  this.initCollections(this);
  Assemble.emit('init', this);
}

/**
 * Inherit `Core`
 */

Core.extend(Assemble);
Core.bubble(Assemble);

/**
 * Initialize Assemble defaults
 */

Assemble.prototype.initDefaults = function(app) {
  var exts = this.options.exts || ['md', 'hbs', 'html'];

  /**
   * Emit `preInit` on the static emitter
   */

  Assemble.emit('preInit', this);

  /**
   * Default engine
   */

  this.engine(exts, require('engine-handlebars'));

  /**
   * Middleware for parsing front matter
   */

  this.onLoad(utils.extRegex(exts), function(view, next) {
    // check options inside the middleware to
    // account for options defined after init
    if (view.options.frontMatter === false) {
      return next();
    }
    if (app.options.frontMatter === false) {
      return next();
    }
    utils.matter.parse(view, next);
  });
};

/**
 * Load default plugins. Built-in plugins can be disabled
 * on the `assemble` options.
 *
 * ```js
 * var app = assemble({
 *   plugins: {
 *     loader: false,
 *     store: false
 *   }
 * });
 * ```
 */

Assemble.prototype.initPlugins = function(app) {
  enable('loader', utils.loader);
  enable('config', utils.config);
  enable('argv', utils.argv);
  enable('cli', cli);

  function enable(name, fn) {
    if (app.isFalse('plugins')) return;
    if (!app.isFalse('plugins.' + name)) {
      app.use(fn(app.options));
    }
  }
};

/**
 * Built-in view collections
 *  | partials
 *  | layouts
 *  | pages
 */

Assemble.prototype.initCollections = function(app) {
  if (this.isFalse('collections')) return;

  var engine = this.options.defaultEngine || 'hbs';
  this.create('partials', {
    engine: engine,
    viewType: 'partial',
    renameKey: function(fp) {
      return path.basename(fp, path.extname(fp));
    }
  });

  this.create('layouts', {
    engine: engine,
    viewType: 'layout',
    renameKey: function(fp) {
      return path.basename(fp, path.extname(fp));
    }
  });

  this.create('pages', {
    engine: engine,
    renameKey: function(fp) {
      return fp;
    }
  });
};

/**
 * Ensure `name` is set on the instance for lookups.
 */

Object.defineProperty(Assemble.prototype, 'name', {
  configurable: true,
  set: function(name) {
    this.options.name = name;
  },
  get: function() {
    return this.options.name || this._name || 'base';
  }
});

/**
 * Expose static `is*` methods from Templates
 */

Core._.plugin.is(Assemble);

/**
 * Expose `Assemble`
 */

module.exports = Assemble;
