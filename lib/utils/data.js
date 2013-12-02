/**
 * Data Utils
 */

// Node.js
var path = require('path');
var fs = require('fs');

var Data = require('../data');

var generateFilename = function(name) {
  return path.join(process.cwd(), '.assemble', 'data', name);
};

// The module to be exported.
var data = module.exports = {};

data.loadDatastore = function(name) {
  var filename = generateFilename(name);
  return new Data({filename: filename});
};

data.destroyDatastore = function(name, done) {
  if(!done) {
    done = function() {};
  }
  
  var filename = generateFilename(name);
  fs.exists(filename, function(exists) {
    if(exists) {
      fs.unlink(filename, function(err) {
        done();
      });
    } else {
      done();
    }
  });
};



