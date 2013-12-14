/**
 * Data Utils
 */

// Node.js
var path = require('path');
var fs = require('fs');

var traverse = require('traverse');
var _ = require('lodash');

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

// following regex is from grunt.config template processing
var tmpRegex = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i;
/**
 * Recursively process lodash templates if values
 * @param  {Object} obj - object with possible value that need processing
 * @param  {Object} ctx - optional context to use when processing templates
 * @return {Object}     - returns a new object with processed values
 */
data.process = function(obj, ctx) {
  // TODO: figure out how ctx will be used
  // will it be extended over obj first?
  return traverse(obj).map(function(o) {
    var matches = false;
    if(typeof o === 'string' && (matches = o.match(tmpRegex))) {
      this.update(data.get(obj, matches[1]));
    }
  });
};

data.get = function(obj, path) {
  return traverse(obj).get(path.split('.'));
};

data.set = function(obj, path, value) {
  return traverse(obj).set(path.split('.'), value);
};
