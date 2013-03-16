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
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    // Run tests.
    mochaTest: {
      files: ['test/**/*.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'
      }
    },

    // Run simple tests.
    assemble: {
      // Internal task to build README, docs.
      readme: {
        options: {
          today: '<%= grunt.template.today() %>',
          partials: ['docs/*.md','docs/templates/sections/*.{md,hbs}'],
          changelog: grunt.file.readYAML('CHANGELOG'),
          roadmap: grunt.file.readYAML('ROADMAP'),
          data: [
            'docs/templates/data/docs.json',
            '../assemble-internal/docs/templates/data/url.json', 
            '../assemble-internal/docs/templates/data/repos.json'
          ],
          ext: '.md'
        },
        files: {
          '.': ['../assemble-internal/docs/templates/README.hbs']
        }
      },
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
          layout: 'test/files/layout.hbs'
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
    'default',
    'mochaTest'
  ]);
};
