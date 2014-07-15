'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var util = require('util');
var load = require('load-options');
var Config = require('./config');


/**
 * # Options
 *
 * Get, set and extend assemble options.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .option('layouts', 'src/layouts')
 *   .option('partials', 'src/partials/*.hbs');
 * ```
 *
 * @class Options
 * @param {Object} `defaults`
 * @constructor
 * @api public
 */

function Options(defaults) {
  Config.call(this, defaults);
  this.cache = _.extend({}, this.cache, defaults);
}

util.inherits(Options, Config);


/**
 * ## .load
 *
 * Private method for loading settings onto the config. Options are loaded by
 * an object directly, or pass a file path or paths, or glob patterns to
 * JSON/YAML files to use.
 *
 * **Examples:**
 *
 * Pass config settings directly:
 *
 * ```js
 * assemble.load({
 *   layoutdir: 'templates/layouts',
 *   layout: 'blog'
 * });
 * ```
 *
 * Load settings from a yaml file:
 *
 * ```js
 * assemble.load('.assemble.yml');
 * ```
 *
 * Use glob patterns to specify the files to use:
 *
 * ```js
 * assemble.load('settings/*.{json,yml}');
 * ```
 *
 * Visit [load-options] to see all available options or to report issues
 * related to this method.
 *
 * @method `load`
 * @param {Object} `options`
 * @api private
 */

Options.prototype.load = function (options) {
  return load(options);
};


/**
 * Expose `Options`
 */

module.exports = Options;