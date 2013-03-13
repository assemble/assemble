module.exports = function(grunt) {

  var path = require('path'),
      fork = require('child_process').fork,
      testemPath = process.cwd() + '/node_modules/testem/testem.js';

  grunt.registerTask("test", "run test specs", function() {
    var done = this.async();
    var args = ["-f", path.resolve(process.cwd() + "/config/test.json")];

    var child = fork(testemPath, args);
    child.on("exit", function(code, signal) {
      if(code !== 0) {
        grunt.warn("Test execution failed with exit code " + code);
      }
      done();
    });
  });
};
