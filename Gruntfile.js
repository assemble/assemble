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
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    // Release management
    release: {
      options: {
        bump: true,
        add: false,
        commit: false,
        tag: false,
        push: false,
        pushTags: false,
        npm: false
      }
    },

    // Update Version
    version: {
      check: {
        src: ['package.json']
      },
      release: {
        options: {
          release: 'patch'
        },
        src: ['<%= version.check.src %>']
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

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'lib/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },

    concat: {
      dist: {
        src: [
          '<banner:meta.banner>',
          '<file_strip_banner:lib/<%= pkg.name %>.js>'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    min: {
      dist: {
        src: [
          '<banner:meta.banner>',
          '<config:concat.dist.dest>'
        ],
        dest: '<%= pkg.name %>.min.js'
      }
    },

    uglify: {},


    // Run other gruntfiles in project
    subgrunt: {
      examples: ['examples/**/Gruntfile.js']
    },

    watch: {
      all: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'mochaTest'],
        options: {
          debounceDelay: 250
        }
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  // "grunt-version": "https://github.com/kswedberg/grunt-version/tarball/master"
  // issue with putting this in the package.json file is that it updates it's own line since it has version": in it.
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'mochaTest',
    'watch'
  ]);

  // Default task.
  grunt.registerTask('examples', [
    'subgrunt'
  ]);

  // Tests to be run.
  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);
};
