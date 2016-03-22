'use strict';

var utils = require('../../utils');
var get = require('get-value');

function Collection(name, options) {
  if (!(this instanceof Collection)) {
    return new Collection(options);
  }

  if (typeof options === 'string') {
    options = { inflection: options };
  }
  this.options = utils.merge({}, this.options, options);
  this.name = name;
  Object.defineProperty(this, 'inflection', {
    configurable: true,
    enumerable: true,
    set: function(val) {
      this.options.inflection = val;
    },
    get: function() {
      return this.options.inflection;
    }
  });

  var cache = {};
  Object.defineProperty(this, 'cache', {
    configurable: true,
    enumerable: false,
    set: function(val) {
      cache = val;
    },
    get: function() {
      return cache
    }
  });

  Object.defineProperty(this, this.name, {
    configurable: true,
    enumerable: false,
    value: this.cache
  });

  Object.defineProperty(this, 'keys', {
    configurable: true,
    enumerable: false,
    get: function() {
      return Object.keys(this.cache);
    }
  });
}

Collection.prototype.addFile = function(file) {
  var data = get(file.data, this.name);
  if (typeof data === 'undefined' && this.inflection) {
    data = get(file.data, this.inflection);
  }

  if (typeof data !== 'undefined') {
    data = Array.isArray(data) ? data : [data];
    this.cache = data.reduce(function(acc, key) {
      acc[key] = acc[key] || {};
      if (!acc[key].hasOwnProperty(file.key)) {
        acc[key][file.key] = file;
      }
      return acc;
    }, this.cache);
  }
};

module.exports = Collection;
