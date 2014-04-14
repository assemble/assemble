
/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var inflection = require('inflection');
var traverse = require('traverse');
var _ = require('lodash');

var Collection = module.exports = function (options) {
  this.options = options || {};
  this.name = this.options.name || 'default';
  this.inflection = this.options.inflection || inflection.singularize(this.name);
  this.sortorder = this.options.sortorder || 'ASC';
  this.sortby = this.options.sortby || '';
  this.items = [];
};


Collection.normalize = function(collection) {

  // if the collection is a string
  // create a new Collection object
  // using collection as the name
  if (typeof collection === 'string') {
    return new Collection({
      name: collection
    });
  }

  // if the collection is an instance of
  // a Collection, return the collection
  if (collection instanceof Collection) {
    return collection;
  }

  // if the collection is a plain object
  // create a new Collection object
  // using collection as the options
  if (typeof collection === 'object') {
    return new Collection(collection);
  }

  // otherwise, return null
  return null;
};

Collection.prototype.add = function (item) {
  this.items.push(item);
};

Collection.prototype.get = function (search, by) {
  if(_.isFunction(search)) {
    by = search;
  }

  if(_.isFunction(by)) {
    var results = _.filter(this.items, by);
    return results.length === 1 ? results[0] : results;
  }

  if (typeof search === 'string') {
    if (by && typeof by === 'string') {
      return this.get(function(page) {
        return traverse(page.metadata).get(by.split('.')) === search;
      });
    }
    return this.get(function(page) {
      return page.name === search || page.src === search;
    });
  }

};

Collection.prototype.sort = function () {

};


