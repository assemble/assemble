'use strict';

var path = require('path');
var loader = require('assemble-loader');
var extname = require('gulp-extname');
var assemble = require('./');
var app = assemble();
app.use(loader());

app.option('renameKey', function (fp) {
  return path.basename(fp, path.extname(fp));
});

/**
 * Custom view collection
 */

app.create('docs');

/**
 * Load helpers
 */

app.helpers('docs/src/helpers/*.js');

/**
 * Load some "global" data
 */

app.data({
  site: {
    title: 'Assemble Docs'
  },
  destBase: '_gh_pages/',
  assets: 'assets',
  links: [{
    dest: 'assemble',
    collection: 'docs',
    text: 'Assemble'
  }]
});

/**
 * Task for building docs
 */

app.task('default', ['load'], function () {
  return app.src('docs/src/templates/pages/index.hbs')
    .pipe(app.renderFile())
    .pipe(extname())
    .pipe(app.dest(function (file) {
      file.base = file.dirname;
      return '_gh_pages/';
    }));
});

/**
 * Re-load templates when triggered by watch
 */

app.task('load', function (cb) {
  app.docs.load('docs/src/content/*.md');
  app.partials.load('docs/src/templates/partials/*.hbs');
  app.layouts.load('docs/src/templates/layouts/*.hbs');
  cb();
});

/**
 * Watch files for changes
 */

app.task('watch', ['docs'], function () {
  app.watch('docs/**/*.*', ['default']);
});

/**
 * Run the default task
 */

app.run('default', function (err) {
  if (err) console.log(err);
});

module.exports = app;
