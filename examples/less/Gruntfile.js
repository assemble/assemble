/*
 * Assemble Example: LESS
 * http://github.com/assemble/assemble
 *
 * Copyright (c) 2013 Assemble
 * MIT License
 */


module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({

    pkg:    grunt.file.readJSON('package.json'),
    build:  grunt.file.readJSON('config.json'),
    theme:  grunt.file.readJSON('src/themes/themes.json'),

    // Build static files from templates
    assemble: {
      options: {
        data:  [
          'src/themes/*.json'
        ],
        ext: '.less'
      },
      less: {
        layout: 'src/themes/layouts/default.hbs',
        files: {
          'src/themes/<%= theme.name %>/<%= theme.name %>.less': [
            'src/themes/themes.hbs'
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
        tasks: [ 'default' ]
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Load local tasks from project root.
  grunt.loadTasks('../../tasks');

  // Default task to be run.
  grunt.registerTask('default', [
    //'clean',
    'assemble'
  ]);

};
