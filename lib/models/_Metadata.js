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

var Metadata = module.exports = utils.model.inherit(Object);

Metadata.prototype.init = function(options) {
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key];
    }
  }

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