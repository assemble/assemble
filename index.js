'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Core = require('assemble-core');
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
  Core.apply(this, arguments);
  this.initAssemble();
}

/**
 * Inherit assemble-core
 */

Core.extend(Assemble);

/**
 * Initialize Assemble defaults
 */

Assemble.prototype.initAssemble = function() {
  this.isAssemble = true;
  this.use(utils.loader());

  var exts = this.options.exts || ['md', 'hbs', 'html'];
  var regex = utils.extRegex(exts);

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

  if (this.options.init !== false) {
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
  }
};


/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
