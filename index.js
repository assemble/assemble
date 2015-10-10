'use strict';

/**
 * module dependencies
 */

var only = require('emitter-only');
var render = require('assemble-render-file');
var reloadViews = require('assemble-reload-views');
var Templates = require('templates');

/**
 * Local dependencies
 */

var composer = require('./lib/composer');
var init = require('./lib/init');

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
  this.options = options || {};
  this.init(this);
}

/**
 * `Assemble` prototype methods
 */

Templates.extend(Assemble, {
  constructor: Assemble,

  /**
   * Initialize Assemble defaults
   */

  init: function() {
    this.isAssemble = true;

    /**
     * Load core plugins
     */

    this.use(require('assemble-fs'));
    this.use(require('assemble-streams'));
    this.use(composer());
    this.use(render());
    this.use(init());

    this.use(reloadViews());

    /**
     * Allow events to be registered only once, so
     * that we can reinitialize the application and
     * avoid re-registering the same emitters.
     */

    this.mixin('only', only.bind(this));
  }
});

/**
 * Expose the `Assemble` constructor
 */

module.exports = Assemble;
