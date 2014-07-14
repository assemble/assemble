'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var util = require('util');
var path = require('path');
var load = require('load-options');


/**
 * # Options
 *
 * Get and set globally avaiable options, or override Assemble defaults.
 *
 * @class Options
 * @param {Object} `defaults`
 * @constructor
 * @api public
 */

function Options(options) {
  this.options = load(options);
}


/**
 * ## .set
 *
 * Assign `value` to `key` or return the value of `key`.
 *
 * ```js
 * assemble.set(key, value, expand);
 * ```
 *
 * If `expand` is defined as true, the value will be set using
 * [node-expander](https://github.com/tkellen/expander).
 *
 * {%= docs("set") %}
 *
 * @method `set`
 * @param {String} `key`
 * @param {*} `value`
 * @return {Options} for chaining
 * @api public
 */

Options.prototype.set = function (option, value) {
  this.options[option] = value;
  return value;
};


/**
 * ## .get
 *
 * Get the specified `option`.
 *
 * ```js
 * assemble.set('foo', 'bar')
 * assemble.get('foo')
 * // => "bar"
 * ```
 *
 * @method `get`
 * @param {String} `option`
 * @return {*}
 * @api public
 */

Options.prototype.get = function (option) {
  return option ? this.options[option] : this.options;
};


Options.prototype.clear = function (key) {
  if (!key) {
    this.options = {};
  } else if (this.options[key]) {
    delete this.options[key];
  }
};


module.exports = Options;


/**
 * Expose `Options`
 */

exports.Options = Options;
