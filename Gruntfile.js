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

    // Metadata for tests
    pkg: grunt.file.readJSON('package.json'),

    // Metadata for banners
    meta: {
      license: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
      copyright: 'Copyright (c) <%= grunt.template.today("yyyy") %>',
      banner: [
        '/*!',
        ' * <%= pkg.name %> v<%= pkg.version %>',
        ' * http://assemble.io',
        ' *',
        ' * <%= meta.copyright %>, <%= pkg.author.name %>',
        ' * Licensed under the <%= meta.license %> License.',
        ' */ \n\n'
      ].join('\n')
    },

    /**
     * Lint all JavaScript
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'test/**/*.js'
      ]
    },

    /**
     * Run mocha tests.
     */
    mochaTest: {
      tests: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*_test.js']
      }
    },

    /**
     * Pull down a list of repos from Github, for the docs
     */
    repos: {
      plugins: {
        options: {
          username: 'assemble',
          include: ['contrib'],
          exclude: ['grunt', 'example', 'rss']
        },
        files: {
          'docs/plugins.json': ['repos?page=1&per_page=100']
        }
      }
    },

    /**
     * Before generating any new files,
     * remove files from the previous build
     */
    clean: {
      tests: ['test/actual/**/*']
    },

    /**
     * Watch source files and run tests when changes are made.
     */
    watch: {
      dev: {
        files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
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
  grunt.loadNpmTasks('grunt-repos');

  // Build docs and readme
  grunt.registerTask('docs', ['repos', 'verb']);

  // The default task to run with the `grunt` command
  grunt.registerTask('default', ['jshint', 'clean', 'mochaTest']);

  // Development
  grunt.registerTask('dev', ['jshint', 'mochaTest', 'watch']);
};
