'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');


/**
 * ## Files
 *
 * Files constructor used to create a cache of Vinyl files
 *
 * @param {Object} `cache` optionally pass in a pre-popluated cache of Vinyl files.
 */

function Files (cache) {
  this.cache = cache || {};
}


/**
 * ## .set
 *
 * Set a Vinyl file on the cache.
 *
 * @param {String} `key`  key to identitify the file (usually the filepath)
 * @param {Object} `file` Vinyl file
 * @return {Object} this object for chaining
 */

Files.prototype.set = function (key, file) {
  this.cache[key] = file;
  return this;
};


/**
 * ## .get
 *
 * Get a Vinyl file from the cache
 *
 * @param {String} `key`  key to identitify the file (usually the filepath)
 * @return {Object} Vinyl file
 */

Files.prototype.get = function (key) {
  return this.cache[key];
};


/**
 * ## .forEach
 *
 * Iterate over each file on the cache and call the given function.
 *
 * @param {Function} `fn` Iterator function
 * @param {Object} `thisArg` Optional argument to use as `this` in the iterator function.
 * @return {Object} `Files` object for chaining
 */

Files.prototype.forEach = function (fn, thisArg) {
  _(this.cache).forEach(fn, thisArg);
  return this;
};


/**
 * ## .toArray
 *
 * Return an array of the files on the cache
 *
 * @return {Array} list of files
 */

Files.prototype.toArray = function () {
  return _.values(this.cache);
};


/**
 * ## .length
 *
 * Get the number of files in the cache
 *
 * @return {Number} number of files in the cache
 */

Object.defineProperty(Files.prototype, 'length', {
  get: function () {
    return _.keys(this.cache).length;
  }
});

module.exports = Files;