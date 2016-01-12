'use strict';
var assemble = require('../..')
var extname = require('gulp-extname');
var app = assemble();

/**
 * Create views collection for our site pages and blog posts.
 * Posts will be written in markdown.
 */

app.create('pages');
app.create('posts');

/**
 * Register a handlebars helper for processing markdown.
 * This could also be done with a gulp plugin, or a
 * middleware, but helpers are really easy and provide
 * the most control.
 */

app.helper('markdown', require('helper-markdown'));

/**
 * Pre-render middleware, for customizing how
 * data (context) will be passed to templates
 */

// app.preRender(/\.(md|hbs|html)$/, function(view, next) {
//   file.data = merge({}, app.cache.data)
//   next();
// });

/**
 * Tasks for loading and rendering our templates
 */

app.task('load', function(cb) {
  app.layouts('src/templates/layouts/*.hbs');
  app.pages('src/templates/pages/*.hbs');
  app.posts('src/content/*.md');
  cb();
});

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
