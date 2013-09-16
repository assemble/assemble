/**
 * Helpers
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var resolve = require('resolve-dep');
var grunt = require('grunt');
var path  = require('path');
var _ = require('lodash');
var fs = require('fs');

module.exports.register = function(glob, plugin, engine, options) {

  var resolvedFiles = resolve.loadDev(glob) || [];
  var localFiles = grunt.file.expand(options, glob) || [];

  var files = _.union([], resolvedFiles, localFiles);

  files.forEach(function(file) {
    var helper = null;
    try {
      helper = require(path.normalize(path.join(options.cwd || process.cwd() || '', file)));
      if(typeof helper !== 'undefined') {
        if(typeof helper.register !== 'undefined') {
          helper.register(engine, options);
        } else {
          plugin.registerFunctions(helper, options);
        }
      }
    } catch (ex) {
      grunt.log.writeln('Error loading helpers from file: ' + file);
      grunt.log.writeln(ex);
    }
  });
};


