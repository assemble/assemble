/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var fs = require('fs');

// node_modules
var Hashtable = require('jshashtable');
var expand = require('expand');

// Local libs
var utils = require('./utils');
var DB = require('../db');
var log = require('./log')();

// The module to be exported.
var data = module.exports = {};

//
var dataStoreCache = new Hashtable();

data.loadDatastore = function(name) {
  var filename = utils.generateFilename(name);
  if (dataStoreCache.containsKey(name) === false) {
    dataStoreCache.put(name, new DB({filename: filename}));
  }
  return dataStoreCache.get(name);
};

data.destroyDatastore = function(name, done) {
  if(!done) {
    done = function() {};
  }

  var filename = utils.generateFilename(name);
  fs.exists(filename, function(exists) {
    if(exists) {
      fs.unlink(filename, function(err) {
        if (err) {
          log.error(err);
          return done();
        }
        dataStoreCache.remove(name);
        done();
      });
    } else {
      dataStoreCache.remove(name);
      done();
    }
  });
};





data.process = function(obj) {
  return expand.process(obj);
};

data.get = function(obj, path) {
  return expand.get(obj, path);
};

data.set = function(obj, path, value) {
  return expand.set(obj, path, value);
};
