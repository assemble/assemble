/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var Datastore = require('nedb');


// Export the `data` module
var Data = module.exports = function(options) {
  this.db = new Datastore(options);
  if(!options.autoload || options.autoload === false) {
    this.db.loadDatabase();
  }
};

// insert
Data.prototype.insert = function(obj, callback) {
  this.db.insert(obj, callback);
};

// find
Data.prototype.find = function(search, callback) {
  this.db.find(search, callback);
};

// findOne
Data.prototype.findOne = function(search, callback) {
  this.db.findOne(search, callback);
};

// update
Data.prototype.update = function(search, set, options, callback) {
  this.db.update(search, set, options, callback);
};

// remove
Data.prototype.remove = function(search, options, callback) {
  this.db.remove(search, options, callback);
};
