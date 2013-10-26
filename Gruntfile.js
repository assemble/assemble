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

  var prettify = require('pretty');

  // Report elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // package.json
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('test/fixtures/data/config.json'),
    translation: require('./test/fixtures/data/translations'),

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
        assets: 'test/actual/assets',
        helpers: ['test/helpers/*.js'],
        layoutdir: 'test/fixtures/layouts',
        layout: 'layout.hbs',
        flatten: true
      },
      // Define layout extension, so that layouts in YFM can be defined
      // without an extension.
      layout_ext: {
        options: {
          layout: 'none', // override default, layout is redefined in YFM
          layoutext: '.hbs'
        },
        files: {
          'test/actual/paths/': ['test/fixtures/pages/layoutext/layoutext.hbs']
        }
      },
      // Register custom helpers
      custom_helpers: {
        options: {
          helpers: ['test/helpers/*.js'],
          name: '<%= pkg.name %>',
          postprocess: prettify
        },
        files: {
          'test/actual/': ['test/fixtures/helpers/{foo,bar,opt}.hbs']
        }
      },
      plugin_untitled: {
        options: {
          plugins: ['./test/plugins/untitled.js']
        },
        files: {
          'test/actual/plugins/untitled.html': 'test/fixtures/plugins/untitled.hbs'
        }
      },
      plugin_before: {
        options: {
          plugins: ['./test/plugins/plugin_before.js']
        },
        files: {
          'test/actual/plugins/before.html': 'test/fixtures/plugins/before.hbs'
        }
      },
      plugin_after: {
        options: {
          plugins: ['./test/plugins/plugin_after.js']
        },
        files: {
          'test/actual/plugins/after.html': 'test/fixtures/plugins/after.hbs'
        }
      },
      // Path construction based on built-in variables
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
      // Post-process content
      postprocess: {
        options: {
          postprocess: function(src) {
            return require('frep').strWithArr(src, grunt.config.process('<%= translation.patterns %>'));
          }
        },
        files: {
          'test/actual/postprocess.html': ['test/fixtures/pages/postprocess.hbs']
        }
      },
      // Post-process content
      postprocess2: {
        options: {
          postprocess: prettify
        },
        files: {
          'test/actual/postprocess2.html': ['test/fixtures/pages/postprocess2.hbs']
        }
      },
      // Build a single page
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
          layout: 'layout2.hbs',
          data: 'test/fixtures/data/*.{json,yml}',
          postprocess: prettify
        },
        files: {
          'test/actual/yfm/': ['test/fixtures/pages/yfm/*.hbs']
        }
      },
      // No YAML front matter
      noyfm: {
        options: {
          data: 'test/fixtures/data/*.{json,yml}'
        },
        files: {
          'test/actual/yfm/': ['test/fixtures/pages/no-yfm.hbs']
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

      // Assets paths
      assets_one: {
        options: {assets: 'test/actual/public', assets_one: true},
        files: {
          'test/actual/assets-public-folder.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_two: {
        options: {assets: 'test/actual', assets_two: true},
        files: {
          'test/actual/assets-same-folder.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_three: {
        options: {assets: '', assets_three: true},
        files: {
          'test/actual/assets-root.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_four: {
        options: {assets: './', assets_four: true},
        files: {
          'test/actual/assets-root-with-slash.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      assets_five: {
        options: {assets: 'test/actual/', assets_five: true},
        files: {
          'test/actual/assets-same-folder-with-slash.html': ['test/fixtures/pages/assets.hbs']
        }
      },
      // Collections
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
      // Pages collections
      pages_array: {
        options: {
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
      // Nested layouts
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
      tests: ['test/actual/**/*.{html,md}'],
      permalinks: ['test/actual/2013/**']
    }
  });

  // Load NPM plugins to provide the necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-sync-pkg');

  // Load this plugin.
  grunt.loadTasks('tasks');

  // Build
  grunt.registerTask('docs', ['readme', 'sync']);

  // Debugging
  grunt.registerTask('debug', ['clean', 'assemble']);

  // Tests to be run.
  grunt.registerTask('test', ['assemble', 'mochaTest']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'test', 'docs']);
};
