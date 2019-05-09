'use strict';

var async = require('async');
var extend = require('extend-shallow');
var extname = require('gulp-extname');
var Scaffold = require('scaffold');
var through = require('through2');

var utils = require('../../lib/utils');
var assemble = require('../..');
var app = assemble();

/**
 * Define a scaffold (`site` and `blog` are "targets")
 */

var scaffold = new Scaffold({
  site: {
    data: {title: 'My Site'},
    options: {
      cwd: 'src',
      destBase: 'dist'
    },
    files: [
      {src: 'posts/*.md', dest: 'blog/', data: {title: 'My Blog'}},
      {src: 'pages/*.hbs'}
    ]
  },
  docs: {
    cwd: 'src/docs',
    destBase: 'dist/docs',
    files: [
      {src: '*.hbs', data: {title: 'whatever'}},
      {src: '*.md', data: {title: 'documentation'}}
    ]
  }
});

/**
 * Register engines for rendering templates
 * (we'll let assemble automatically select the engine by file extension)
 */

app.engine('hbs', require('engine-handlebars'));
app.engine('md', require('engine-base'));

/**
 * Register a pipeline plugin to be used on the files processed
 * by the `scaffold` method
 */

app.plugin('render', app.renderFile);

app.plugin('aaa', function() {
  return through.obj(function(file, enc, next) {
    file.contents = new Buffer(file.contents.toString() + '\naaa');
    next(null, file);
  });
});

app.plugin('bbb', function() {
  return through.obj(function(file, enc, next) {
    file.contents = new Buffer(file.contents.toString() + '\nbbb');
    next(null, file);
  });
});

/**
 * Tasks
 */

app.task('default', function(cb) {
  app.scaffold(scaffold, {pipeline: ['render']}, function(err) {
    if (err) throw err;
    utils.timestamp('finished scaffold');
    cb();
  });
});

/**
 * Expose our instance of assemble
 */

module.exports = app;
