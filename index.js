'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Core = require('assemble-core');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

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
  Core.apply(this, arguments);
  this.isAssemble = true;
  this.initAssemble();
}

/**
 * Inherit assemble-core
 */

Core.extend(Assemble);

/**
 * Initialize Assemble defaults
 */

Assemble.prototype.initAssemble = function(opts) {
  var exts = this.options.exts || ['md', 'hbs', 'html'];
  var regex = utils.extRegex(exts);

  /**
   * Register built-in plugins
   */

  this.use(utils.pipeline(opts))
    .use(utils.pipeline())
    .use(utils.loader())
    .use(utils.config())
    .use(utils.store())
    .use(utils.list())
    .use(utils.cli())
    .use(utils.ask())
    .use(cli())

  /**
   * Default engine
   */

  this.engine(exts, require('engine-handlebars'));

  /**
   * Middleware for parsing front matter
   */

  this.onLoad(regex, function(view, next) {
    utils.matter.parse(view, next);
  });

  /**
   * Define default view collections
   *  | partials
   *  | layouts
   *  | pages
   *  | files
   */

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
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
