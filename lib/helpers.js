/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';

var path = require('path');
var resolve = require('resolve-dep');
var grunt = require('grunt');

module.exports.register = function(patterns, currentEngine, engineInstance, options, params) {
  resolve(patterns).forEach(function(filepath) {
    var fn = null;
    try {
      fn = require(path.resolve(filepath));
      if(typeof fn !== 'undefined') {
        if (typeof fn === 'object' && Object.keys(fn).length >= 1) {
          if(typeof fn.register !== 'undefined') {
            fn.register(engineInstance, options, params);
          } else {
            currentEngine.registerFunctions(fn, options, params);
          }
        }
      }
    } catch (err) {
      grunt.log.writeln('Error loading helpers from file: ' + filepath);
      grunt.log.writeln(err);
    }
  });
};
