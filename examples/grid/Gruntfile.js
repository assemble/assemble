/*
 * Gruntfile.js for projects.
 *
 */


module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    build: grunt.file.readJSON('build.json'),

    // Templates, build HTML docs from .mustache files
    assemble: {
      options: {
        engine: 'handlebars',
        helpers: [
          '../../lib/engines/handlebars/helpers/defaultHelpers'
        ],
        preprocessors: [
          '../../lib/engines/handlebars/preprocessors/handlebarsPreprocessors'
        ],
        flatten: true,
        production: false,
        docs: true,
        assets: 'dest/assets',
        data:  [
          'src/data/**/*.json'
        ]
      },
      pages: {
        options: {
          layout: 'src/layouts/layout.mustache',
          partials: [
            'src/partials/**/*.mustache'
          ]
        },
        files: {
          // Compile each page in the project.
          'dest': [
            'src/pages/**/*.mustache'
          ]
        }
      }
    },

    clean: {
      dest: {
        src: [
          'dest/*.*'
        ]
      }
    },

    watch: {
      src: {
        files: [
          'src/**/*.*'
        ],
        tasks: ['clean', 'assemble']
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadTasks('../../tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', [
    'clean',
    'assemble',
    'watch'
  ]);

};
