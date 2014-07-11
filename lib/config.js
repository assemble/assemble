/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies.
 */

var expander = require('expander');
var getobject = require('getobject');
var loadOptions = require('load-options');
var plasma = require('plasma');
var _ = require('lodash');



function Config(context) {
  this.context = context || {};
}


/**
 * ## .set
 *
 * Assign `value` to `key`.
 *
 * ```js
 * set(key, value, expand);
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
 * @param {Boolean} `expand`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.set = function set(key, value, expand) {
  if (typeof value == null) {
    return this.get(key);
  }
  if (expand) {
    expander.set(this.context, key, value);
  } else {
    getobject.set(this.context, key, value);
  }
  return this.get(key);
};


/**
 * ## .get
 *
 * Return the stored value of `key`.
 *
 * ```js
 * assemble.set('foo', 'bar')
 * assemble.get('foo')
 * // => "bar"
 * ```
 *
 * @method get
 * @param {*} `key`
 * @param {Boolean} `create`
 * @return {*}
 * @api public
 */

Config.prototype.get = function get(key, create) {
  return getobject.get(this.context, key, create);
};


/**
 * ## .constant
 *
 * Set a constant on the config.
 *
 * **Example**
 *
 * ```js
 * assemble.constant('site.title', 'Foo');
 * ```
 *
 * @method `constant`
 * @param {String} `key`
 * @param {*} `value`
 * @chainable
 * @api public
 */

Config.prototype.constant = function constant(key, value){
  var getter;
  if (typeof value !== 'function'){
    getter = function() {
      return value;
    };
  } else {
    getter = value;
  }
  this.context.__defineGetter__(key, getter);
  return this;
};


/**
 * ## .enabled (key)
 *
 * Check if `key` is enabled (truthy).
 *
 * ```js
 * assemble.enabled('foo')
 * // => false
 *
 * assemble.enable('foo')
 * assemble.enabled('foo')
 * // => true
 * ```
 *
 * @method enabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Config.prototype.enabled = function enabled(key){
  return !!this.get(key);
};


/**
 * ## .disabled (key)
 *
 * Check if `key` is disabled.
 *
 * ```js
 * assemble.disabled('foo')
 * // => true
 *
 * assemble.enable('foo')
 * assemble.disabled('foo')
 * // => false
 * ```
 *
 * @method disabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Config.prototype.disabled = function disabled(key){
  return !this.get(key);
};


/**
 * ## .enable (key)
 *
 * Enable `key`.
 *
 * **Example**
 *
 * ```js
 * assemble.enable('foo');
 * ```
 *
 * @method enable
 * @param {String} `key`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.enable = function enable(key){
  return this.set(key, true);
};


/**
 * ## .disable (key)
 *
 * Disable `key`.
 *
 * **Example**
 *
 * ```js
 * assemble.disable('foo');
 * ```
 *
 * @method disable
 * @param {String} `key`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.disable = function disable(key){
  return this.set(key, false);
};


/*
 * ## .exists
 *
 * Return `true` if the element exists. Dot notation may be used for nested properties.
 *
 * **Example**
 *
 * ```js
 * assemble.exists('author.name');
 * //=> true
 * ```
 *
 * @method  `exists`
 * @param   {String}  `key`
 * @return  {Boolean}
 * @api public
 */

Config.prototype.exists = function exists(key) {
  return getobject.exists(this.context, key);
};


/**
 * ## .extend
 *
 * Extend the config with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .extend({foo: 'bar'}, {baz: 'quux'});
 *   .extend({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method extend
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.extend = function extend() {
  var args = [].slice.call(arguments);
  _.extend.apply(_, [this.context].concat(args));
  return this;
};


/**
 * ## .merge
 *
 * Extend the config with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .merge({foo: 'bar'}, {baz: 'quux'});
 *   .merge({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method merge
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.merge = function merge() {
  var args = [].slice.call(arguments);
  _.merge.apply(_, [this.context].concat(args));
  return this;
};


/**
 * ## .config
 *
 * Extend the config with the given object. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .extend({foo: 'bar'}, {baz: 'quux'});
 *   .extend({fez: 'bang'});
 * ```
 *
 * @method `config`
 * @alias `extend`
 * @param {Object} `arguments`
 * @return {Config} for chaining
 * @chainable
 * @api public
 */

Config.prototype.config = function config() {
  var args = [].slice.call(arguments);
  _.extend.apply(_, [this.context].concat(args));
  return this;
};


/**
 * ## .options
 *
 * Extend the options.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .options({layouts: 'src/layouts'})
 *   .options({partials: 'src/partials/*.hbs'});
 * ```
 *
 * @method `options`
 * @param {Object} `options`
 * @return {Config} for chaining
 * @chainable
 * @api public
 */

Config.prototype.options = function (options) {
  this.extend({}, this._options, loadOptions(options));
  return options;
};


/**
 * ## .plasma
 *
 * Extend the context with the given object using [plasma](https://github.com/jonschlinkert/plasma).
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .plasma({foo: 'bar'}, {baz: 'quux'});
 *   .plasma({fez: 'bang'});
 * ```
 *
 * @chainable
 * @method plasma
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.plasma = function (data, opts) {
  this.extend({}, plasma(data, opts));
  return this;
};


/**
 * ## .data
 *
 * Proxy for `assemble.plasma()`.
 *
 * @chainable
 * @method `data`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.data = function (data, opts) {
  if (!arguments.length) {
    return this;
  }
  this.extend({}, this.plasma(data, opts));
  return this;
};


/**
 * ## .process
 *
 * Recursively expand template strings into their resolved values.
 *
 * **Example**
 *
 * ```js
 * assemble.process({a: '<%= b %>', b: 'c'});
 * //=> {a: 'c', b: 'c'}
 * ```
 *
 * @param {String} `key`
 * @param {Any} `value`
 */

Config.prototype.process = function process(locals, options) {
  return expander(locals, this.merge(locals), options || {});
};


/**
 * ## .remove(key)
 *
 * Remove an element by `key`.
 *
 * **Example**
 *
 * ```js
 * assemble.remove('foo');
 * ```
 *
 * @method remove
 * @param {*} `key`
 * @api public
 */

Config.prototype.remove = function remove(key) {
  delete this.context[key];
};


/**
 * ## .omit
 *
 * Omit properties from the config.
 *
 * **Example**
 *
 * ```js
 * assemble
 *   .omit('foo');
 *   .omit('foo', 'bar');
 *   .omit(['foo']);
 *   .omit(['foo', 'bar']);
 * ```
 *
 * **Params:**
 *
 * @chainable
 * @method omit
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.omit = function omit() {
  var args = [].slice.call(arguments);
  var keys = [this.context].concat(args);
  _.omit.apply(_, keys);
  return this;
};


module.exports = Config;