/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var utils = require('../utils');
var Base = require('./base');
var Metadata = module.exports = utils.model.inherit(Base);

Metadata.prototype.initialize = function(options) {
  this.datastore = utils.data.loadDatastore((this.name || 'default') + '-metadata');
};

Metadata.prototype.getFile = function(key, done) {
  this.datastore.findOne({filename: key}, done);
};

Metadata.prototype.setFile = function(key, hash, done) {
  var self = this;
  self.datastore.findOne({filename: key}, function(err, results) {
    if (results) {
      self.datastore.update({filename: key}, {filename: key, hash: hash}, {}, done);
    } else {
      self.datastore.insert({filename: key, hash: hash}, done);
    }
  });
};