'use strict';

var path = require('path');
var loader = require('assemble-loader');
var extname = require('gulp-extname');
var matter = require('parser-front-matter');
var init = require('./lib/init');
var assemble = require('./');

/**
 * Create our assemble appplication
 */

var app = assemble()
  .use(loader());

/**
 * Define the engine to use for `hbs` files
 */

app.engine('hbs', require('engine-handlebars'));

/**
 * Define a middleware for parsing front-matter
 * on any files that match the given regex
 */

app.onLoad(/\.hbs$/, function (view, next) {
  matter.parse(view, next);
});

/**
 * Customize how templates are stored. This changes the
 * key of each template, so it's easier to lookup later
 */

app.option('renameKey', function (fp) {
  return path.basename(fp, path.extname(fp));
});

/**
 * Create a custom view collection
 */

app.use(init(app.options));
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
 * Task for re-loading templates when triggered by watch
 */

app.task('load', function (cb) {
  app.partials('docs/src/templates/partials/*.hbs');
  app.layouts('docs/src/templates/layouts/*.hbs');
  app.docs('docs/src/content/*.md');
  cb();
});

/**
 * Default task, for building the assemble docs
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
 * Watch files for changes
 */

app.task('watch', ['docs'], function () {
  app.watch('docs/**/*.*', ['default']);
});

/**
 * Run the default task
 */

app.build('default', function (err) {
  if (err) console.log(err);
});

/**
 * Expose the `app` instance to the assemble CLI
 */

module.exports = app;
