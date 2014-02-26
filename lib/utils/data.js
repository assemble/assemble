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
var traverse = require('traverse');
var _ = require('lodash');

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

// following regex is from grunt.config template processing
var tmplRegex = /^<%=\s*([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i;

// allow for calls to functions to add their value into the tree
var fnTmplRegex = /^<%(?:=?)\s*(([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*(\(\s*([^\)]*)\)))\s*%>$/i;

/**
 * Recursively process lodash templates if values
 * @param  {Object} obj - object with possible values that need processing
 * @return {Object}     - returns a new object with processed values
 */
data.process = function(obj) {
  return traverse(obj).map(function(o) {
    var matches = false;
    // if the value is a string, check for template patterns
    if(typeof o === 'string') {
      // if this is a normal template '<%= foo %>' or '<%= foo.baz %>'
      if(matches = o.match(tmplRegex)) {
        // get the value and update it in the tree
        this.update(data.get(obj, matches[1]));
      // otherwise, if this is a template calling a function '<%= foo() %>'
      } else if (matches = o.match(fnTmplRegex)) {
        // this code is inspired by the internal lodash template engine.
        // this creates a new function taking in parameters for the
        // context (our object) and lodash so we can execute normally.
        var fnBody = 'with(ctx) { return ' + matches[1] + '; }';
        var result = Function(['ctx', '_'], fnBody).apply(undefined, [obj, _]); // jshint ignore:line
        this.update(result);
      } else {
        // process any other strings like a normal lodash template
        this.update(_.template(o, obj));
      }
    }
  });
};

data.get = function(obj, path) {
  return traverse(obj).get(path.split('.'));
};

data.set = function(obj, path, value) {
  return traverse(obj).set(path.split('.'), value);
};
