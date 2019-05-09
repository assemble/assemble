'use strict';

var path = require('path');
var merge = require('mixin-deep');
var extname = require('gulp-extname');
var permalinks = require('assemble-permalinks');
var getDest = require('../../docs/plugins/get-dest');
var viewEvents = require('../../docs/plugins/view-events');
var assemble = require('../..');
var app = assemble();

/**
 * Plugins
 */

app.use(viewEvents('permalink'));
app.use(permalinks());
app.use(getDest());

app.onPermalink(/./, function(file, next) {
  file.data = merge({}, app.cache.data, file.data);
  next();
});

app.data({
  site: {
    base: 'site'
  }
});

/**
 * Create views collection for our site pages and blog posts.
 * Posts will be written in markdown.
 */

app.create('pages');
app.create('posts', {
  pager: true,
  renameKey: function(key, view) {
    return view ? view.basename : path.basename(key);
  }
});

app.posts.use(permalinks(':site.base/blog/:filename.html'));
app.pages.use(permalinks(':site.base/:filename.html'));

/**
 * Register a handlebars helper for processing markdown.
 * This could also be done with a gulp plugin, or a
 * middleware, but helpers are really easy and provide
 * the most control.
 */

app.helper('markdown', require('helper-markdown'));
app.helpers('../../docs/helpers/*.js');
app.helper('log', function(val) {
  console.log(val);
});

/**
 * Tasks for loading and rendering our templates
 */

app.task('load', function(cb) {
  app.partials('src/templates/includes/*.hbs');
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
    .pipe(app.dest(function(file) {
      file.path = file.data.permalink;
      file.base = path.dirname(file.path);
      return file.base;
    }));
});

/**
 * Expose your instance of assemble to the CLI
 */

module.exports = app;
