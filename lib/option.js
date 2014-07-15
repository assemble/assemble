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
 * Load
 *
 * ```js
 * assemble.load('.assemblerc.yml');
 * ```
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