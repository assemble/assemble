'use strict';

var utils = require('../../utils');
var Collection = require('./collection');

function Collections(options) {
  if (!(this instanceof Collections)) {
    return new Collections(options);
  }
  this.options = utils.merge({}, this.options, options);
  Object.defineProperty(this, 'cache', {
    configurable: true,
    enumerable: false,
    value: {}
  });

  Object.defineProperty(this, 'keys', {
    configurable: true,
    enumerable: false,
    get: function() {
      return Object.keys(this.cache);
    }
  });

  this.initCollections();
}

Collections.prototype.initCollections = function() {
  var collections = this.options.collections || {};
  Object.keys(collections).forEach(function(key) {
    this.addCollection(key, new Collection(key, collections[key]));
  }, this);
  return this;
};

Collections.prototype.addFile = function(file) {
  this.keys.forEach(function(key) {
    this.getCollection(key).addFile(file);
  }, this);
};

Collections.prototype.addCollection = function(name, collection) {
  this.cache[name] = collection;
};

Collections.prototype.getCollection = function(name) {
  var collection = this.cache[name];
  if (collection) {
    return collection;
  }
  var opts = this.options.collection[name];
  if (typeof opts === 'string') {
    opts = { inflection: opts };
  }
  return this.cache[opts.inflection];
};

module.exports = Collections;
