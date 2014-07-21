'use strict';

/**
 * Module dependencies.
 */

// var Vinyl = require('vinyl');
var _ = require('lodash');


// function File(file, options) {
//   Vinyl.call(this, file);
//   this.parse(file, options);
// }


// File.prototype.parse = function(file, options) {
//   //
// };

function Files (cache) {
  this.cache = cache || {};
}

Files.prototype.set = function (key, file) {
  this.cache[key] = file;
  return this;
};

Files.prototype.get = function (key) {
  return this.cache[key];
};

Files.prototype.forEach = function (fn, thisArg) {
  _(this.cache).forEach(fn, thisArg);
  return this;
};

Object.defineProperty(Files.prototype, 'length', {
  get: function () {
    return _.keys(this.cache).length;
  }
});

module.exports = {
  // File: File,
  Files: Files
};