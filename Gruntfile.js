/*
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

module.exports = function (grunt) {

  // Report elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Lint all JavaScript
    jshint: {
      options: {jshintrc: '.jshintrc'},
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/*.js']
    },

    // Run mocha tests
    mochaTest: {
      tests: {src: ['test/*.js']}
    },

    // Before generating any new files, remove files from the previous build
    clean: {
      tests: ['test/actual/**']
    },

    // Watch source files and run tests when changes are made.
    watch: {
      dev: {
        files: ['Gruntfile.js', 'lib/**/*.js', 'test/*.js'],
        tasks: ['default']
      }
    }

  });

  // Load NPM plugins to provide the necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-verb');

  // Build docs and readme
  grunt.registerTask('docs', ['verb']);

  // The default task to run with the `grunt` command
  grunt.registerTask('default', ['jshint', 'clean', 'mochaTest']);

  // Development
  grunt.registerTask('dev', ['jshint', 'mochaTest', 'watch']);
};
