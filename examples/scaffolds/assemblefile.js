'use strict';

var async = require('async');
var through = require('through2');
var extend = require('extend-shallow');
var Target = require('expand-target');
var extname = require('gulp-extname');
var Scaffold = require('scaffold');

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
      {src: '*.md', data: {title: 'documentation'}},
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
 * Tasks
 */

app.task('scaffold', function (done) {
  async.eachOf(scaffold, function (target, name, cb) {
    if (!target.hasOwnProperty('files')) {
      cb();
      return;
    }

    // log out a time-stamped message for each "files" definition
    utils.logTask(app.name, ':scaffold:' + name);

    async.each(target.files, function (files, next) {
      if (!files.src || !files.src.length) {
        next();
        return;
      }

      var opts = extend(target.options, files.options);
      var data = extend(target.data, files.data);

      app.src(files.src, opts)
        .pipe(app.renderFile(data))
        .on('error', next)
        .pipe(extname())
        .pipe(app.dest(files.dest))
        .on('error', next)
        .on('finish', next);
    }, cb);
  }, done);
});

app.task('default', ['scaffold']);

/**
 * Expose our instance of assemble
 */

module.exports = app;
