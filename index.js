'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Core = require('assemble-core');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

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

  Core.apply(this, arguments);
  this.isAssemble = true;

  this.initDefaults(this);
  this.initPlugins(this);
  this.initCollections(this);
}

/**
 * Inherit assemble-core
 */

Core.extend(Assemble);

/**
 * Initialize Assemble defaults
 */

Assemble.prototype.initDefaults = function(app) {
  var opts = this.options;
  var exts = opts.exts || ['md', 'hbs', 'html'];
  var regex = utils.extRegex(exts);

  /**
   * Default engine
   */

  this.engine(exts, require('engine-handlebars'));

  /**
   * Middleware for parsing front matter
   */

  this.onLoad(regex, function(view, next) {
    // check options inside the middleware to
    // account for options defined after init
    if (view.options.frontMatter !== false) {
      return next();
    }
    if (app.options.frontMatter !== false) {
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
 * @api public
 */

Assemble.prototype.initPlugins = function(app) {
  enable('pipeline', utils.pipeline);
  enable('loader', utils.loader);
  enable('config', utils.config);
  enable('store', utils.store);
  enable('argv', utils.argv);
  enable('list', utils.list);
  enable('ask', utils.ask);
  enable('cli', cli);

  function enable(name, fn) {
    if (app.option('plugins') === false) return;
    if (app.option('plugins.' + name) !== false) {
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
  if (this.option('collections') === false) return;

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
    return this.options.name || 'base';
  }
});

/**
 * Set a `base` instance that can be used for storing
 * additional instances.
 */

Object.defineProperty(Assemble.prototype, 'base', {
  configurable: true,
  get: function() {
    return this.parent ? this.parent.base : this;
  }
});

/**
 * Expose `Assemble`
 */

module.exports = Assemble;
