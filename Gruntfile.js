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

    // Included for running basic tests.
    assemble: {
      options: {

        flatten: true,
        assets: 'test/actual/assets'
      },
      compact: {
        options: {
          partials: 'test/files/partials/*.hbs',
          layout: 'test/files/layout.hbs'
        },
        src:  ['test/files/dates.hbs', 'test/files/page.hbs'],
        dest: 'test/actual/'
      },
      files_object: {
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
          layout: 'test/files/layout.hbs',
          data: ['test/data/*.json']
        },
        files: {
          'test/actual/multi/dest1/': ['test/files/**/*.hbs', '!test/files/layout*.*'],
          'test/actual/multi/dest2/': ['test/files/**/*.{md,markdown}'],
          'test/actual/multi/dest2/sub-dest/': ['test/files/**/*.hbs', '!test/files/layout*.*']
        }
      },
      assets: {
        options: {
          assets: 'test/actual',
          layout: 'test/files/layout3.hbs',
          data: ['test/data/*.json']
        },
        files: {
          'test/actual/': ['test/files/example.hbs'],
          'test/actual/example/': ['test/files/example.hbs']
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
  grunt.registerTask('default', ['jshint', 'assemble']);

  // Tests to be run.
  grunt.registerTask('test', ['jshint', 'mochaTest']);
};
