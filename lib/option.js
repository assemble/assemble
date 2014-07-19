'use strict';

/**
 * Module dependencies.
 */

var util = require('util');
var load = require('load-options');
var Cache = require('./cache');


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
  Cache.call(this, defaults);
}

util.inherits(Options, Cache);


/**
 * ## .load
 *
 * Private method for loading settings onto the cache. Options are loaded by
 * an object directly, or pass a file path or paths, or glob patterns to
 * JSON/YAML files to use.
 *
 * {%= docs("option-load") %}
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