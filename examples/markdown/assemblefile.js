'use strict';

var path = require('path');
var extname = require('gulp-extname');
var assemble = require('../..');
var app = assemble();

/**
 * Create views collection for our site pages and blog posts.
 * Posts will be written in markdown.
 */

app.create('pages');
app.create('posts', {
  renameKey: function(key, view) {
    return view ? view.basename : path.basename(key);
  }
});

/**
 * Register a handlebars helper for processing markdown.
 * This could also be done with a gulp plugin, or a
 * middleware, but helpers are really easy and provide
 * the most control.
 */

app.helper('markdown', require('helper-markdown'));

/**
 * Tasks for loading and rendering our templates
 */

app.task('load', function(cb) {
  app.layouts('src/templates/layouts/*.hbs');
  app.pages('src/templates/pages/*.hbs');
  app.posts('src/content/*.md');
  cb();
});

/**
 * Default task
 */

app.task('default', ['load'], function() {
  return app.toStream('pages')
    .pipe(app.toStream('posts'))
    .on('error', console.log)
    .pipe(app.renderFile('md'))
    .on('error', console.log)
    .pipe(extname())
    .pipe(app.dest('site'));
});

/**
 * Expose your instance of assemble to the CLI
 */

module.exports = app;
