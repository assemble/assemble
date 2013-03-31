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
      options: {
        // Common data.
        flatten: true,
        assets: 'test/actual',
        data: ['test/common/data/common1.json', 'test/common/data/common2.yml']
      },
      // Run basic tests on templates and data.
      tests: {
        options: {
          layout: 'test/files/layout-includes.hbs'
        },
        files: {
          'test/actual/': ['test/files/extend.hbs']
        }
      },
      yaml: {
        options: {
          layout: 'test/files/layout.hbs',
          data: 'test/yaml/data/**/*.*'
        },
        files: {
          'test/actual/yaml/': ['test/yaml/*.hbs']
        }
      },
      multi: {
        options: {
          layout: 'test/files/layout.hbs'
        },
        files: {
          'test/actual/multi/dest1/': ['test/files/**/*.hbs', '!test/files/layout*.*'],
          'test/actual/multi/dest2/': ['test/files/**/*.md'],
          'test/actual/multi/dest2/sub-dest/': ['test/files/**/*.hbs', '!test/files/layout*.*']
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
