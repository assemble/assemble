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
    blog: grunt.file.readJSON('test/data/blog.json'),

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

    // Example data for "pages_array" and "pages_object" targets
    component: {
      one: "alert"
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
      // Build one page
      single_page: {
        options: {
          partials: 'test/templates/partials/*.hbs'
        },
        files: {
          'test/actual/page.html': ['test/templates/pages/page.hbs']
        }
      },
      // YAML front matter
      yfm: {
        options: {
          data: 'test/data/*.{json,yml}'
        },
        files: {
          'test/actual/yfm/': ['test/templates/pages/yfm/*.hbs']
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
      collections_example: {
        options: {
          data: ['test/data/*.json'],
          collections: [
            {
              name: 'tags',
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
      pages_array: {
        options: {
          engine: 'handlebars',
          layout: 'post.hbs',
          site: {
            title: 'A Blog',
            author: 'Jon Schlinkert'
          },
          pages: [
            {
              filename: "post1",
              data: {
                title: "Blog Post #1",
                gists: ["5898072"]
              },
              content: "This \"content\" property is optional and would get passed into the `body` tag. But if you only need to pass the page's metadata to the layout then the content property is unnecessary."
            },
            {
              filename: "post2",
              data: {
                title: "Blog Post #2",
                subtitle: "",
                gists: ["5898077", "5898078"]
              },
              content: "<h1>{{title}} | {{site.title}}</h1>\n {{> <%= component.one %> }} The current version of Assemble is v<%= pkg.version %>."
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
      },
      pages_object: {
        options: {
          engine: 'handlebars',
          layout: 'post.hbs',
          site: {
            title: 'Another Blog',
            author: 'Brian Woodward'
          },
          pages: {
            'sweet-blog-post-1': {
              data: {
                title: 'Sweet Blog Post #1',
                gists: ['5898072']
              },
              content: 'This "content" property is optional and would get passed into the "body" tag. But if you only need to pass the page\'s metadata to the layout then the content property is unnecessary.'
            },
            'awesome-blog-post-2': {
              data: {
                title: 'Awesome Blog Post #2',
                subtitle: '',
                gists: ['5898077', '5898078']
              },
              content: "<h1>{{title}} | {{site.title}}</h1>\n {{> <%= component.one %> }} The current version of Assemble is v<%= pkg.version %>."
            },
            'super-sweet-and-awesome-blog-post-3': {
              data: {
                title: "Super Sweet and Awesome Blog Post #3",
                gists: ['5898072']
              }
            }
          }
        },
        files: {
          'test/actual/object-blog/': ['test/templates/pages/blog/index.hbs']
        }
      },
      nested_layouts: {
        options: {
          layoutdir: 'test/templates/layouts',
          layout: 'one.hbs'
        },
        files: {
          'test/actual/nested-layouts/': ['test/templates/pages/*.hbs']
        }
      }
    },

    mochaTest: {
      files: ['test/**/*.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'nyan'
      }
    },

    // Before generating new files,
    // remove files from previous build.
    clean: {
      tests: ['test/actual/**/*.{html,md}']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble-internal');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load the 'assemble' plugin.
  grunt.loadTasks('tasks');

  // Test nested layouts seperately.
  grunt.registerTask('nested', ['assemble:nested_layouts']);

  // Tests to be run.
  grunt.registerTask('test', ['jshint', 'default', 'mochaTest']);

  // Generate readme.
  grunt.registerTask('docs', ['assemble-internal']);

  // Default task.
  grunt.registerTask('default', ['clean', 'assemble']);
};
