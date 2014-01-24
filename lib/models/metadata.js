/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Local libs
var utils = require('../utils');
var Base = require('./base');

var Metadata = module.exports = utils.model.inherit(Base);

Metadata.prototype.initialize = function(options) {
  options = options || {};
  this.datastore = utils.data.loadDatastore((this.name || options.name || 'default') + '-metadata');
};

Metadata.prototype.getFile = function(key, done) {
  this.datastore.findOne({filename: key}, done);
};

Metadata.prototype.setFile = function(key, file, done) {
  var self = this;
  self.datastore.findOne({filename: key}, function(err, results) {
    if (results) {
      self.datastore.update({filename: key}, {filename: key, file: file}, {}, done);
    } else {
      self.datastore.insert({filename: key, file: file}, done);
    }
  });
};