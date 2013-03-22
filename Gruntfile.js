/*
 * Assemble
 * http://github.com/assemble/assemble
 *
 * Copyright (c) 2013 Assemble
 * MIT License
 */


module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // package.json
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    jshint: {
      options: {
        jshintrc: 'tasks/.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },

    // Run mocha tests.
    mochaTest: {
      files: ['test/**/*.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'
      }
    },

    assemble: {
      // Run basic tests on templates and data.
      tests: {
        options: {
          layout: 'test/files/layout-includes.hbs'
        },
        files: {
          'test/actual': ['test/files/extend.hbs']
        }
      },
      yaml: {
        options: {
          layout: 'test/files/layout.hbs',
          data: 'test/yaml/data/**/*.*'
        },
        files: {
          'test/actual/yaml': ['test/yaml/*.hbs']
        }
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', [
    'assemble',
    'jshint'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);
};
