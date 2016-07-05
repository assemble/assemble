'use strict';

var path = require('path');
var isObject = require('isobject');
var drafts = require('gulp-drafts');
var format = require('gulp-format-md');
var arrayify = require('arrayify-compact');
var collections = require('assemble-collections');
var middleware = require('common-middleware');
var inflection = require('inflection');
var app = module.exports = require('verb')();

/**
 * Custom template collections
 */

app.create('recipes');
app.create('partials', {viewType: 'partial'});
app.create('layouts', {viewType: 'layout'});

/**
 * Engine
 */

app.engine('*', require('engine-handlebars'));

/**
 * Plugins
 */

app.use(collections());
app.use(middleware());

/**
 * Middleware
 */

app.preRender(/\.md$/, function(view, next) {
  view.layout = inflection.singularize(path.basename(view.dirname));
  next();
});

/**
 * Helpers
 */

app.asyncHelper('related', function(related, options, cb) {
  if (typeof related === 'string') {
    related = [related];
  }
  if (Array.isArray(related)) {
    related = { docs: related };
  }
  if (isObject(related) && related.docs) {
    related.docs = arrayify(related.docs);
    related.docs = related.docs.map(function(name) {
      var view = app.find(name);
      // console.log(view);
      return name;
    });
  }
  if (isObject(related) && related.urls) {
    related.urls = arrayify(related.urls);
  }

  cb(null, options.fn({}));
});

app.helper('is', function(a, b, options) {
  return (a === b) ? options.fn(this) : options.inverse(this);
});

app.helper('isnt', function(a, b, options) {
  return a !== b ? options.fn(this) : '';
});

app.helper('is-current', function(view, options) {
  var current = this.view;
  var res = current.key === view.key;
  if (typeof options.fn === 'function') {
    res = res ? options.fn(this) : options.inverse(this);
  }
  return res;
});

/**
 * Build recipes
 */


app.task('recipes', function() {
  app.partials('src/templates/partials/*.hbs');
  app.layouts('src/templates/layouts/*.hbs');
  app.recipes('src/content/recipes/*.md');

  return app.toStream('recipes')
    .pipe(drafts())
    .pipe(app.renderFile('*'))
    .pipe(format())
    .pipe(app.dest('recipes'));
});

app.task('default', ['recipes']);
