/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var util = require('util');
var plasma = require('plasma');
var namespaceData = require('namespace-data');
var _ = require('lodash');


/**
 * Local modules
 */

var Config = require('./config');


/**
 * Data
 *
 * Constructor for data storage. Manages data from files that
 * will later be merged into the context.
 *
 * @class  `Data`
 * @constructor
 * @param {Object} `data`
 * @api public
 */

function Data(data) {
	Config.call(this, data);
  this.cache.data = this.cache.data || {};
}

util.inherits(Data, Config);


/**
 * ## .data
 *
 * Extend the `data` object with data from a JSON file, YAML file,
 * or by passing an object directly. Glob patterns may be used for
 * file paths.
 *
 * @method `data`
 * @param {Object} `data`
 * @param {Object} `options` Options to pass to [plasma].
 * @return {Data} for chaining
 * @api public
 */

Data.prototype.data = function(data, options) {
  if (!arguments.length) {
    return this.get('data');
  }
  data = this.plasma(data, options);
  data = this.extendData(data);
  data = this.root(data);
  return this.process(this.cache);
};


/**
 * ## .root
 *
 * If a `data` property is on the given `data` object (e.g. `data.data`,
 * like when a `data.json` or `data.yml` file is used), the value of
 * `data.data`'s is collapsed to the root `data` object.
 *
 * @param {Object} `config`
 * @return {Object} Returns the collapsed object.
 * @api private
 */

Data.prototype.root = function root(data) {
  if (data && data.hasOwnProperty('data')) {
	  _.extend(data, data.data);
    delete data.data;
  }
  return data;
};


/**
 * ## .extendData
 *
 * Extend the `data` object with the given data. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .extendData({foo: 'bar'}, {baz: 'quux'});
 *   .extendData({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method `extendData`
 * @return {Data} for chaining
 * @api public
 */

Data.prototype.extendData = function extendData() {
  var args = [].slice.call(arguments);
  _.extend.apply(_, [this.cache.data].concat(args));
  return this.process(this.cache.data);
};


/**
 * ## .plasma
 *
 * Extend the `data` object with the value returned by [plasma].
 *
 * **Example:**
 *
 * ```js
 * assemble
 *   .plasma({foo: 'bar'}, {baz: 'quux'});
 *   .plasma({fez: 'bang'});
 * ```
 *
 * See the [plasma] documentation for all available options.
 *
 * [plasma]: https://github.com/jonschlinkert/plasma
 *
 * @method `plasma`
 * @param {Object|String|Array} `data` File path(s), glob pattern, or object of data.
 * @param {Object} `options` Options to pass to plasma.
 * @return {Assemle} for chaining
 * @chainable
 * @api public
 */

Data.prototype.plasma = function(data, options) {
  return plasma(data, options);
};


/**
 * ## .namespace
 *
 * Expects file path(s) or glob pattern(s) to any JSON or YAML files to
 * be merged onto the data object. Any data files read in by the
 * `.namespace()` method will extend the `data` object with an object
 * named after the basename of each file.
 *
 * **Example**
 *
 * ```js
 * data.namespace(['alert.json', 'nav*.json']);
 * ```
 * The data from each file is namespaced using the name of the file:
 *
 * ```js
 * {
 *   alert: {},
 *   navbar: {}
 * }
 * ```
 *
 * See the [plasma] documentation for all available options.
 *
 * @param {String|Array} `patterns` Filepaths or glob patterns.
 * @return {null}
 * @api public
 */

Data.prototype.namespace = function(namespace, data, options) {
  data = namespaceData(namespace, data, options);
  data = this.root(data);
  return this.extendData(data);
};



module.exports = Data;