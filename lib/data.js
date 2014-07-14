/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var plasma = require('plasma');
var _ = require('lodash');
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
  this.extend(data);
}

util.inherits(Data, Config);


/**
 * ## .plasma
 *
 * Expose plasma
 *
 * **Example**
 *
 * ```js
 * data.plasma({foo: 'bar'});
 * ```
 *
 * See the plasma documentation for all available options.
 *
 * @param {Object} `config`
 * @return {this} for chaining
 * @api public
 */

Data.prototype.plasma = function(config) {
  this.extend(plasma(config));
  return this;
};


/**
 * ## .namespace
 *
 * Extend the `data` object with data from JSON and YAML files. For
 * each data file, an object is created using the basename of the file.
 *
 * **Example**
 *
 * ```js
 * data.namespace('alert.json');
 * //=> {alert: { ... }}
 *
 * data.namespace(['alert.json', 'nav*.json']);
 * //=> {alert: { ... }, navbar: { ... }}
 * ```
 *
 * See the plasma documentation for all available options.
 *
 * @param {String|Array} `patterns` Filepaths or glob patterns.
 * @return {null}
 * @api public
 */

Data.prototype.namespace = function(src) {
  var data = plasma({namespace: ':basename', patterns: src});
  Data.__super__.extend.call(this, data);
};


/**
 * ## .mergeRoot
 *
 * If a `data` property is on the `data` object (e.g. `data.data`),
 * move `data.data`'s contents to the root.
 *
 * @param {Object} `config`
 * @return {Object}
 * @api private
 */

Data.prototype.mergeRoot = function(data) {
  data = data || {};
  if (data.hasOwnProperty('data')) {
    _.extend(data, data.data);
    delete data.data;
  }
  return data;
};


/**
 * ## .read
 *
 * @param {Object} `config`
 * @api public
 */

Data.prototype.read = function(config) {
  var data = plasma(config);
  return _.extend({}, this.mergeRoot(data), data);
};


/**
 * ## .merge
 *
 * Merge data onto the `data` object.
 *
 * **Params:**
 *
 * @param  {Object} `config`
 * @return {Object}
 * @api public
 */

Data.prototype.merge = function(config) {
  Data.__super__.merge.call(this, this.read(config));
};


module.exports = Data;