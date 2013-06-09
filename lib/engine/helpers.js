
var fs = require('fs');
var path = require('path');
var grunt = require('grunt');

module.exports.register = register = function(glob, engine, options) {

  var files = grunt.file.expand(options, glob);

  files.forEach(function(file) {
    var helper = null;
    try {
      helper = require(path.normalize(path.join(options.cwd || process.cwd() || '', file)));
      if(typeof helper !== 'undefined') {
        engine.registerFunctions(helper, options);
      }
    } catch (ex) {
      grunt.log.writeln('Error loading helpers from file: ' + file);
      grunt.log.writeln(ex);
    }
  });
};


