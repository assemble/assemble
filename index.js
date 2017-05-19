'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Core = require('assemble-core');
var plugins = require('./lib/plugins');
var utils = require('./lib/utils');

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
  Core.call(this, options);
  this.is('assemble');
  this.initAssemble();
}

/**
 * Inherit `Core`
 */

Core.extend(Assemble);
Core.bubble(Assemble);

/**
 * Initialize assemble and emit pre and post init events
 */

Assemble.prototype.initAssemble = function() {
  Assemble.emit('assemble.preInit', this);
  Assemble.initAssemble(this);
  Assemble.emit('assemble.postInit', this);
};

/**
 * Initialize Assemble defaults, plugins and views
 */

Assemble.initAssemble = function(app) {
  Assemble.initDefaults(app);
  Assemble.initPlugins(app);
  Assemble.initViews(app);
};

/**
 * Initialize defaults
 */

Assemble.initDefaults = function(app) {
  var exts = app.options.exts || ['md', 'hbs', 'html'];

  /**
   * Default engine
   */

  app.engine(exts, require('engine-handlebars'));

  /**
   * Middleware for parsing front matter
   */

  app.onLoad(utils.extRegex(exts), function(view, next) {
    // check options inside the middleware to account for options defined after init
    if (view.options.frontMatter === false) {
      next();
      return;
    }
    if (app.options.frontMatter === false) {
      next();
      return;
    }

    utils.matter.parse(view, function(err) {
      if (err) {
        next(err);
        return;
      }
      utils.expand.middleware(app)(view, next);
    });
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

Assemble.initPlugins = function(app) {
  enable('logger', plugins.logger);
  enable('loader', plugins.loader);
  enable('config', plugins.config);
  enable('argv', plugins.argv);
  enable('cli', plugins.cli);

  function enable(name, fn) {
    if (app.option('plugins') === false) return;
    if (app.option('plugins.' + name) !== false) {
      app.use(fn());
    }
  }
};

/**
 * Built-in view collections
 *  | partials
 *  | layouts
 *  | pages
 */

Assemble.initViews = function(app) {
  if (app.isFalse('collections')) return;

  app.create('partials', {
    engine: app.options.engine || 'hbs',
    viewType: 'partial',
    renameKey: function(fp) {
      return path.basename(fp, path.extname(fp));
    }
  });

  app.create('layouts', {
    engine: app.options.engine || 'hbs',
    viewType: 'layout',
    renameKey: function(fp) {
      return path.basename(fp, path.extname(fp));
    }
  });

  app.create('pages', {
    engine: app.options.engine || 'hbs'
  });
};

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
