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
        pkgBump: true,
        compBump: true,
        add: false,
        commit: false,
        tag: false,
        push: false,
        pushTags: false,
        npm: false
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
      examples: [
        'examples/handlebars/Gruntfile.js',
        'examples/grid/Gruntfile.js'
      ]
    },

    watch: {
      all: {
        options: { debounceDelay: 250 },
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'mochaTest']
      }
    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', [
    'jshint',
    'mochaTest'
  ]);

  // Build examples.
  grunt.registerTask('examples', [
    'subgrunt:examples'
  ]);

  // Default task.
  grunt.registerTask('bump', [
    'test',
    'release'
  ]);
};
