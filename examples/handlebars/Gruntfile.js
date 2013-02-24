/*
 * Assemble Example: Handlebars
 * http://github.com/assemble/assemble
 *
 * Copyright (c) 2013 Assemble
 * MIT License
 */


module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg:   grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

    // Templates, config HTML docs from .hbs files
    assemble: {
      options: {
        engine: 'handlebars',
        helpers: '<%= config.helpers %>',
        docs: true,
        production: false,
        flatten: true,
        assets: 'dest/assets',
        data:  [
          'src/data/**/*.json'
        ]
      },
      pages: {
        options: {
          layout: 'src/layouts/layout.hbs',
          partials: [
            'src/partials/**/*.hbs'
          ]
        },
        files: {
          // Compile each page in the project.
          'dest': [
            'src/pages/**/*.hbs'
          ]
        }
      }
    },

    clean: {
      dest: {
        src: [ 'dest/*.*' ]
      }
    },

    watch: {
      src: {
        files: [ 'src/**/*.*' ],
        tasks: [ 'clean', 'assemble' ]
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Load local tasks from project root.
  grunt.loadTasks('../../tasks');

  // Default task to be run.
  grunt.registerTask('default', [
    'clean',
    'assemble'
  ]);

};
