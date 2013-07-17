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
        layout: 'layout.hbs',
        layoutdir: 'test/templates/layouts',
        helpers: 'test/helpers/helper-*.js',
        assets: 'test/actual/assets'
      },
      paths: {
        options: {
          partials: 'test/templates/partials/*.hbs',
          layout: 'paths-example.hbs',
          data: ['test/data/*.yml']
        },
        files: {
          'test/actual/paths/': ['test/templates/pages/*.hbs']
        }
      },
      single_page: {
        options: {
          partials: 'test/templates/partials/*.hbs',
          layout: 'layout.hbs'
        },
        files: {
          'test/actual/page.html': ['test/templates/pages/page.hbs']
        }
      },
      yaml_front_matter: {
        options: {
          layout: 'layout.hbs',
          data: 'test/yaml/data/*.{json,yml}'
        },
        files: {
          'test/actual/yfm/': ['test/templates/pages/yfm/*.hbs']
        }
      },
      multi: {
        options: {
          layout: 'layout.hbs',
          data: ['test/data/*.json'],
          collections: [
            {
              title: 'tags',
              inflection: 'tag',
              sortorder: 'DESC'
            }
          ]
        },
        files: {
          'test/actual/multi/dest1/': ['test/templates/pages/*.hbs'],
          'test/actual/multi/dest2/': ['test/templates/pages/*.md'],
          'test/actual/multi/dest2/sub-dest/': ['test/templates/pages/*.hbs']
        }
      },
      markdown: {
        options: {
          layout: 'default.md.hbs',
          data: ['test/data/*.json'],
          ext: '.md'
        },
        files: {
          'test/actual/multi/dest1/': ['test/templates/pages/*.hbs']
        }
      },
      assets_one: {
        options: {
          assets: 'test/actual/public',
          assets_one: true
        },
        files: {
          'test/actual/assets-public-folder.html': ['test/templates/pages/assets.hbs']
        }
      },
      assets_two: {
        options: {
          assets: 'test/actual',
          assets_two: true
        },
        files: {
          'test/actual/assets-same-folder.html': ['test/templates/pages/assets.hbs']
        }
      },
      assets_three: {
        options: {
          assets: '.',
          assets_three: true
        },
        files: {
          'test/actual/assets-root.html': ['test/templates/pages/assets.hbs']
        }
      },
      custom_helpers: {
        options: {
          helpers: ['test/helpers/**/*.js'],
          version: '<%= pkg.version %>'
        },
        files: {
          'test/actual/custom-helpers.html': ['test/templates/pages/helpers/custom-helpers.hbs']
        }
      },
      inline_pages: {
        options: {
          engine: 'handlebars',
          layout: "post.hbs",
          site: {
            title: "A Blog",
            author: "Jon Schlinkert"
          },
          pages: [
            {
              filename: "post1",
              data: {
                title: "Blog Post #1",
                gists: ["5898072"]
              },
              content: "This would get passed into the `body` tag, but it's not necessary if you only need to add a post from a gist."
            },
            {
              filename: "post2",
              data: {
                title: "Blog Post #2",
                gists: ["5898077", "5898078"]
              }
            },
            {
              filename: "post3",
              data: {
                title: "Blog Post #3",
                gists: ["5909393"]
              }
            }
          ]
        },
        files: {
          'test/actual/blog/': ['test/templates/pages/blog/index.hbs']
        }
      }
    },

    // Before assembling new files, removed previously
    // created files.
    clean: {
      tests: ['test/actual/**/*.{html,md}']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'assemble']);

  // this is just for when doing debugging and jshint blows up
  grunt.registerTask('dev', ['clean', 'assemble']);

  // Tests to be run.
  grunt.registerTask('test', ['default', 'mochaTest']);
};
