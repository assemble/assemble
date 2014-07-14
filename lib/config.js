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

var getobject = require('getobject');
var expander = require('expander');
var _ = require('lodash');


/**
 * Local modules.
 */

var Options = require('./option');


/**
 * # Config
 *
 * Initialize a new `Config` with the given `obj`.
 *
 * **Example:**
 *
 * ```js
 * var config = new Config();
 * ```
 *
 * @class Config
 * @param {Object} `obj`
 * @constructor
 * @api public
 */

function Config(obj) {
  this.cache = obj || {};
  this.cache.options = this.cache.options || {};

  /**
   * ## .option
   *
   * Extend the options.
   *
   * **Example**
   *
   * ```js
   * option
   *   .option('layouts', 'src/layouts')
   *   .option('partials', 'src/partials/*.hbs');
   * ```
   *
   * @method `option`
   * @param {String} `option`
   * @param {*} `value`
   * @return {Options} for chaining
   * @chainable
   * @api public
   */

  this.option = new Options(this.cache.options);
}


/**
 * ## .hasOwn
 *
 * Does `this.cache` haveOwnProperty `key`?
 *
 * @method `hasOwn`
 * @param  {String} `key`
 * @return {Boolean}
 * @api private
 */

Config.prototype.hasOwn = function hasOwn(key) {
  return {}.hasOwnProperty.call(this.cache, key);
};


/**
 * ## .each
 *
 * Call `fn` on each property in `this.cache`.
 *
 * @param  {Function} `fn`
 * @api private
 */

Config.prototype.each = function each(fn) {
  for (var key in this.cache) {
    if (this.hasOwn(key)) {
      fn(key, this.cache[key]);
    }
  }
};


/**
 * ## .visit
 *
 * Traverse each _own property_ of `this.cache` and recursively
 * call `fn` on child objects.
 *
 * @param  {Function} `fn`
 * @return {Object} Return the resulting object.
 * @api private
 */

Config.prototype.visit = function visit(fn) {
  var cloned = {};
  for (var key in this.cache) {
    if (this.hasOwn(key)) {
      var child = this.cache[key];
      fn.apply(this, [key, child]);

      if (child != null && typeof child === 'object' && !Array.isArray(child)) {
        child = this.visit(child, fn);
      }
      cloned[key] = child;
    }
  }
  return cloned;
};


/**
 * ## .set
 *
 * Assign `value` to `key` or return the value of `key`.
 *
 * ```js
 * assemble.set(key, value, expand);
 * ```
 *
 * {%= docs("set") %}
 *
 * @method `set`
 * @param {String} `key`
 * @param {*} `value`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.set = function set(key, value) {
  expander.set(this.cache, key, value);
  return this;
};


/**
 * ## .get
 *
 * Return the stored value of `key`.
 *
 * ```js
 * assemble.set('foo', 'bar');
 * assemble.get('foo');
 * // => "bar"
 * ```
 *
 * @method get
 * @param {*} `key`
 * @param {Boolean} `create` If the value doesn't exist on the cache, pass `true` to
 *                           [getobject] to initialize the value as an empty object.
 * @return {*}
 * @api public
 */

Config.prototype.get = function get(key, create) {
  if (!key) {
    return this.cache;
  }
  return getobject.get(this.cache, key, create);
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
  this.cache.__defineGetter__(key, getter);
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
  return getobject.exists(this.cache, key);
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
  _.extend.apply(_, [this.cache].concat(args));
  return this;
};

Config.prototype.config = Config.prototype.extend;


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
  _.merge.apply(_, [this.cache].concat(args));
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

Config.prototype.process = function process(lookup, opts) {
  if (typeof lookup === 'object') {
    this.extend(lookup);
  }

  opts = opts || {};
  opts.imports = {};
  for (var key in this.cache) {
    if (this.hasOwn(key)) {
      if (typeof key === 'function') {
        opts.imports[key] = this.cache[key];
      }
    }
  }

  this.extend(expander.process(this.cache, lookup, opts));
  return this;
};


/**
 * ## .omit
 *
 * Omit properties and their from the cache.
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
 * @method `omit`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.omit = function omit() {
  var args = [].slice.call(arguments);
  var keys = [this.cache].concat(args);
  _.omit.apply(_, keys);
  return this;
};


/**
 * ## .clear
 *
 * Remove `key` from the cache, or if no value is specified the entire cache is reset.
 *
 * **Example**
 *
 * ```js
 * assemble.clear();
 * ```
 *
 * @chainable
 * @method `clear`
 * @return {Config} for chaining
 * @api public
 */

Config.prototype.clear = function clear(key) {
  if (!key) {
    this.cache = {};
  } else if (this.cache[key]) {
    delete this.cache[key];
  }
  return this;
};


module.exports = Config;