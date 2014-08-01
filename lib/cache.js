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

var _ = require('lodash');
var getobject = require('getobject');
var expander = require('expander');
var expand = expander.process;
var util = require('util');


/**
 * Local modules.
 */

var Events = require('./events');
var utils = require('./utils');
var typeOf = utils.typeOf;


/**
 * # Cache
 *
 * Initialize a new `Cache` with the given `obj`.
 *
 * **Example:**
 *
 * ```js
 * var cache = new Cache();
 * ```
 *
 * @class Cache
 * @param {Object} `obj`
 * @constructor
 * @api public
 */

function Cache(cache) {
  Events.call(this);

  // Initialize
  this.cache = cache || {};
}

util.inherits(Cache, Events);


/**
 * ## .hasOwn
 *
 * Is `key` an own, enumerable property of `this.cache`?
 *
 * @method `hasOwn`
 * @param  {String} `key`
 * @return {Boolean}
 * @api private
 */

Cache.prototype.hasOwn = function hasOwn(key, obj) {
  return {}.hasOwnProperty.call(obj || this.cache, key);
};


/**
 * ## .each
 *
 * Call `fn` on each property in `this.cache`.
 *
 * @param  {Function} `fn`
 * @api private
 */

Cache.prototype.each = function each(fn) {
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

Cache.prototype.visit = function visit(fn) {
  var cloned = {};
  for (var key in this.cache) {
    if (this.hasOwn(key)) {
      var child = this.cache[key];
      fn.apply(this, [key, child]);

      if (child != null
          && typeOf(child) === 'object'
          && !Array.isArray(child)) {
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
 * assemble.set(key, value);
 * ```
 *
 * {%= docs("set") %}
 *
 * @method `set`
 * @param {String} `key`
 * @param {*} `value`
 * @param {Boolean} `resolve` Resolve template strings with [expander]
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.set = function set(key, value, resolve) {
  if (arguments.length === 1 && typeOf(key) === 'object') {
    this.extend(key);
    this.emit('set', key, value);
    return this;
  }

  value = expand(this.cache, value);
  if (resolve) {
    expander.set(this.cache, key, value);
  } else {
    getobject.set(this.cache, key, value);
  }

  this.emit('set', key, value);
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
 * @param {Boolean} `create` If the value doesn't exist on the orig, pass `true` to
 *                           [getobject] to initialize the value as an empty object.
 * @return {*}
 * @api public
 */

Cache.prototype.get = function get(key, create) {
  if (!key) {
    return this.cache;
  }
  return getobject.get(this.cache, key, create);
};


/**
 * ## .constant
 *
 * Set a constant on the cache.
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

Cache.prototype.constant = function constant(key, value, namespace) {
  var getter;
  if (typeof value !== 'function'){
    getter = function() {
      return value;
    };
  } else {
    getter = value;
  }

  namespace = namespace || 'cache';
  if (!this[namespace]) {
    this[namespace] = {};
  }

  this[namespace].__defineGetter__(key, getter);
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

Cache.prototype.enabled = function enabled(key){
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

Cache.prototype.disabled = function disabled(key){
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
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.enable = function enable(key){
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
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.disable = function disable(key){
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

Cache.prototype.exists = function exists(key) {
  return getobject.exists(this.cache, key);
};


/**
 * ## .union
 *
 * Add values to an array on the `cache`. This method is chainable.
 *
 * **Example**
 *
 * ```js
 * // assemble.cache.pages => ['a.hbs', 'b.hbs']
 * assemble
 *   .union('pages', ['b.hbs', 'c.hbs'], ['d.hbs']);
 *   .union('pages', ['e.hbs', 'f.hbs']);
 *
 * // assemble.cache.pages => ['a.hbs', 'b.hbs', 'c.hbs', 'd.hbs', 'e.hbs', 'f.hbs']
 * ```
 *
 * @chainable
 * @method `union`
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.union = function union(key) {
  var args = [].slice.call(arguments, 1);
  var arr = this.get(key) || [];

  if (!Array.isArray(arr)) {
    throw new Error('Assemble#union expected an array but got', arr);
  }

  this.set(key, _.union.apply(_, [arr].concat(args)));
  return this;
};


/**
 * ## .extend
 *
 * Extend the cache with the given object. This method is chainable.
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
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.extend = function extend() {
  var args = [].slice.call(arguments);
  _.extend.apply(_, [this.cache].concat(args));
  this.emit('extend');
  return this;
};


/**
 * ## .merge
 *
 * Extend the cache with the given object. This method is chainable.
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
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.merge = function merge() {
  var args = [].slice.call(arguments);
  _.merge.apply(_, [this.cache].concat(args));
  this.emit('merge');
  return this;
};


/**
 * ## .process
 *
 * Use [expander] to recursively expand template strings into
 * their resolved values.
 *
 * **Example**
 *
 * ```js
 * assemble.process({a: '<%= b %>', b: 'c'});
 * //=> {a: 'c', b: 'c'}
 * ```
 *
 * @param {*} `lookup` Any value to process, usually strings with a
 *                     cache template, like `<%= foo %>` or `${foo}`.
 * @param {*} `opts` Options to pass to Lo-Dash `_.template`.
 * @api public
 */

Cache.prototype.process = function process(lookup, context) {
  context = context || this.cache;
  if (typeOf(lookup) === 'object') {
    context = _.extend({}, context, lookup);
  }

  return expand(context, lookup, {
    imports: _.pick(context, _.methods(context))
  });
};


/**
 * ## Clearing the orig
 *
 * > Methods for clearing the orig, or for removing or reseting specific values on the orig.
 *
 */


/**
 * ## .omit
 *
 * Omit properties and their from the orig.
 *
 * **Example:**
 *
 * ```js
 * assemble
 *   .omit('foo');
 *   .omit('foo', 'bar');
 *   .omit(['foo']);
 *   .omit(['foo', 'bar']);
 * ```
 *
 * @chainable
 * @method `omit`
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.omit = function omit() {
  var args = [].slice.call(arguments);
  this.cache = _.omit.apply(_, [this.cache].concat(args));
  this.emit('omit');
  return this;
};


/**
 * ## .clear
 *
 * Remove `key` from the orig, or if no value is specified the entire
 * orig is reset.
 *
 * **Example:**
 *
 * ```js
 * assemble.clear();
 * ```
 *
 * @chainable
 * @method `clear`
 * @return {Cache} for chaining
 * @api public
 */

Cache.prototype.clear = function clear(key) {
  if (!key) {
    this.cache = {};
    this.emit('clear');
  } else if (this.cache[key]) {
    delete this.cache[key];
    this.emit('clear', key);
  }
  return this;
};


module.exports = Cache;