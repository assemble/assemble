/*
 * Assemble
 * Created and maintained by Jon Schlinkert and Brian Woodward
 * http://assemble.io
 *
 * Assemble is a full-featured documentation generator,
 * static site generator and component builder. Created
 * from the ground up as a plugin for Grunt.js.
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT License (MIT).
 */

module.exports = function(grunt) {

  // Report elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // package.json
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('test/fixtures/data/config.json'),

    // Metadata
    meta: {
      license: '<%= _.pluck(pkg.licenses, "type").join(", ") %>',
      copyright: 'Copyright (c) <%= grunt.template.today("yyyy") %>',
      banner:
        '/* \n' +
        ' * <%= pkg.name %> v<%= pkg.version %> \n' +
        ' * http://assemble.io \n' +
        ' * \n' +
        ' * <%= meta.copyright %>, <%= pkg.author.name %> \n' +
        ' * Licensed under the <%= meta.license %> License. \n' +
        ' * \n' +
        ' */ \n\n'
    },

    jshint: {
      options: {jshintrc: '.jshintrc'},
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },

    assemble: {
      options: {
        flatten: true,
        layout: 'layout.hbs',
        layoutdir: 'test/fixtures/layouts',
        helpers: 'test/helpers/helper-*.js',
        assets: 'test/actual/assets'
      },
      paths: {
        options: {
          partials: 'test/fixtures/partials/*.hbs',
          layout: 'paths-example.hbs',
          data: ['test/fixtures/data/*.yml']
        },
        files: {
          'test/actual/paths/': ['test/fixtures/pages/*.hbs']
        }
      },
      // Build one page
      single_page: {
        options: {
          partials: 'test/fixtures/partials/*.hbs'
        },
        files: {
          'test/actual/page.html': ['test/fixtures/pages/page.hbs']
        }
      },
      // YAML front matter
      yfm: {
        options: {
          data: 'test/fixtures/data/*.{json,yml}'
        },
        files: {
          'test/actual/yfm/': ['test/fixtures/pages/yfm/*.hbs']
        }
      },
      markdown: {
        options: {
          layout: 'default.md.hbs',
          data: ['test/fixtures/data/*.json'],
          ext: '.md'
        },
        files: {
          'test/actual/multi/dest1/': ['test/fixtures/pages/*.hbs']
        }
      },
      assets_one: {
        options: {
          assets: 'test/actual/public',
          assets_one: true
        },
        files: {
          'test/actual/assets-public-folder.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_two: {
        options: {
          assets: 'test/actual',
          assets_two: true
        },
        files: {
          'test/actual/assets-same-folder.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_three: {
        options: {
          assets: '.',
          assets_three: true
        },
        files: {
          'test/actual/assets-root.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_four: {
        options: {
          assets: './',
          assets_four: true
        },
        files: {
          'test/actual/assets-root-with-slash.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_five: {
        options: {
          assets: 'test/actual/',
          assets_five: true
        },
        files: {
          'test/actual/assets-same-folder-with-slash.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      custom_helpers: {
        options: {
          helpers: ['test/helpers/**/*.js'],
          version: '<%= pkg.version %>'
        },
        files: {
          'test/actual/custom-helpers.html': ['test/fixtures/pages/helpers/custom-helpers.hbs']
        }
      },
      collections_example: {
        options: {
          data: ['test/fixtures/data/*.json'],
          collections: [
            {
              name: 'tags',
              inflection: 'tag',
              sortorder: 'DESC'
            }
          ]
        },
        files: {
          'test/actual/multi/dest1/': ['test/fixtures/pages/*.hbs'],
          'test/actual/multi/dest2/': ['test/fixtures/pages/*.md'],
          'test/actual/multi/dest2/sub-dest/': ['test/fixtures/pages/*.hbs']
        }
      },
      pages_array: {
        options: {
          engine: 'handlebars',
          layout: "post.hbs",
          site: {
            title: "A Blog",
            author: "Jon Schlinkert"
          },
          pages: '<%= config.pages.one %>'
        },
        files: {
          'test/actual/blog/': ['test/fixtures/pages/blog/index.hbs']
        }
      },
      pages_object: {
        options: {
          engine: 'handlebars',
          layout: 'post.hbs',
          site: {
            title: 'Another Blog',
            author: 'Brian Woodward'
          },
          pages: '<%= config.pages.two %>'
        },
        files: {
          'test/actual/object-blog/': ['test/fixtures/pages/blog/index.hbs']
        }
      },
      pages_metadata: {
        options: {
          engine: 'handlebars',
          layout: 'post.hbs',
          site: {
            title: 'Another Blog with Meta',
            author: 'Brian Woodward'
          },
          pages: '<%= config.pages.three %>'
        },
        files: {
          'test/actual/metadata-blog/': ['test/fixtures/pages/blog/index.hbs']
        }
      },
      nested_layouts: {
        options: {layout: 'one.hbs'},
        files: {
          'test/actual/nested-layouts/': ['test/fixtures/pages/*.hbs']
        }
      }
    },

    // Example config data for "pages_array" and "pages_object" targets
    component: {
      one: "alert"
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

    // Before assembling new files, removed previously
    // created files.
    clean: {
      tests: ['test/actual/**/*.{html,md}']
    }
  });

  // Load NPM plugins to provide the necessary tasks.
  grunt.loadNpmTasks('assemble-internal');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load this plugin.
  grunt.loadTasks('tasks');

  // Build
  grunt.registerTask('docs', ['assemble-internal']);

  // Debugging
  grunt.registerTask('debug', ['clean', 'assemble']);
 
  // Tests to be run.
  grunt.registerTask('test', ['assemble', 'mochaTest']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'test']);
 
};
