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

  this.initAssemble(this);
}

/**
 * Inherit assemble-core
 */

Core.extend(Assemble);

/**
 * Initialize Assemble defaults
 */

Assemble.prototype.initAssemble = function(app) {
  var opts = this.options;
  var exts = opts.exts || ['md', 'hbs', 'html'];
  var regex = utils.extRegex(exts);

  // ensure `name` is set for composer-runtimes
  if (!this.name) {
    this.name = opts.name || 'base';
  }

  /**
   * Register plugins
   */

  this.use(utils.pipeline(opts))
    .use(utils.pipeline())
    .use(utils.loader())
    .use(utils.config())
    .use(utils.store())
    .use(utils.argv())
    .use(utils.list())
    .use(utils.cli())
    .use(utils.ask())
    .use(cli());

  /**
   * Default engine
   */

  this.engine(exts, require('engine-handlebars'));

  /**
   * Middleware for parsing front matter
   */

  this.onLoad(regex, function(view, next) {
    // needs to be inside the middleware, to
    // account for options defined after init
    if (view.options.frontMatter !== false && app.options.frontMatter !== false) {
      utils.matter.parse(view, next);
    } else {
      next();
    }
  });

  /**
   * Built-in view collections
   *  | partials
   *  | layouts
   *  | pages
   */

  var engine = opts.defaultEngine || 'hbs';

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
