'use strict';

var path = require('path');
var del = require('delete');
var browserSync = require('browser-sync').create();
var prettify = require('gulp-prettify');
var extname = require('gulp-extname');
var ignore = require('gulp-ignore');
var merge = require('mixin-deep');
var markdown = require('helper-markdown');
var permalinks = require('assemble-permalinks');
var through = require('through2');

var getDest = require('./plugins/get-dest');
var viewEvents = require('./plugins/view-events');


var watch = require('base-watch');
var redirects = require('./plugins/redirects');
var manifest = require('./plugins/manifest');
var utils = require('./support/utils');
var pkg = require('../package');
var assemble = require('../');

/**
 * Create our assemble appplication
 */

var app = assemble();
app.use(viewEvents('permalink'));
app.use(permalinks());
app.use(getDest());
app.use(watch());

app.onPermalink(/./, function(file, next) {
  file.data = merge({}, app.cache.data, file.data);
  next();
});

/**
 * Customize how templates are stored. This changes the
 * key of each template, so it's easier to lookup later
 */

app.option('renameKey', function(fp) {
  return path.basename(fp, path.extname(fp));
});

/**
 * Create a custom view collection
 */

app.create('docs', {layout: 'body'});
app.create('redirects', {
  renameKey: function(key, view) {
    return view ? view.path : key;
  }
});

/**
 * Load helpers
 */

app.helper('markdown', markdown);
app.helpers('helpers/*.js');

/**
 * Load some "global" data
 */

app.data({
  site: {
    title: 'Assemble Docs',
    base: ':destBase/en/v' + pkg.version
  },
  destBase: '_gh_pages',
  assets: ':site.base/assets',
  links: [{
    dest: 'assemble',
    collection: 'docs',
    text: 'Assemble'
  }]
});

app.docs.use(permalinks(':site.base/:filename/index.html'));

/**
 * Middleware
 */

// app.preLayout(/\/api\/.*\.md$/, function(view, next) {
//   view.layout = 'body';
//   next();
// });

/**
 * Clean out the current version's built files
 */

app.task('clean', function(cb) {
  var pattern = '../_gh_pages/en/v' + pkg.version;
  del(pattern, {force: true}, cb);
});

/**
 * Build manifest for a specific version.
 * This is in case an old version didn't have a manifest.
 * Run with `assemble manifest --version 0.6.0`
 */

app.task('manifest', function(cb) {
  // get the version from argv.orig (because of the dots in versions)
  var version = app.argv.orig.version;
  if (typeof version === 'undefined' || typeof version === 'boolean') {
    app.emit('error', new Error('--version needs to be specified when running `assemble manifest`'));
    return cb();
  }

  var dir = '../_gh_pages/en/v' + version;
  if (!utils.exists(dir)) {
    app.emit('error', new Error('invalid version [' + version + ']. ' + dir + ' does not exist'));
    return cb();
  }

  return app.src([dir + '/**/*.html'])
    .on('err', console.log)
    .pipe(manifest(app, {
      renamePath: function(fp) {
        return 'en/v' + version + '/' + fp;
      }
    }))
    .pipe(ignore.include('manifest.json'))
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return dir;
    }));
});

/**
 * Build up a redirects.json file
 */

app.task('redirects', function() {
  return app.src(['../_gh_pages/en/*/manifest.json'])
    .pipe(redirects(app))
    .pipe(ignore.include('redirects.json'))
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return 'data';
    }));
});

/**
 * Re-load templates when triggered by watch
 */

app.task('load', function(cb) {
  app.partials('templates/partials/**/*.hbs');
  app.layouts('templates/layouts/**/*.hbs');
  app.docs('src/api/*.md');
  cb();
});

/**
 * Static server
 */

app.task('serve', function() {
  browserSync.init({
    port: 8080,
    startPath: 'index.html',
    server: {
      baseDir: '../_gh_pages'
    }
  });
});

/**
 * Create redirect views from paths > "data/redirects.json"
 */

app.task('generate-redirects', function() {
  app.data('data/redirects.json', {namespace: 'redirects'});
  var redirects = app.data('redirects');

  for(var from in redirects) {
    var to = redirects[from];
    var redirect = {seconds: 3, url: to};
    app.redirect(from, {
      path: from,
      data: {
        title: from,
        layout: 'redirect',
        redirect: redirect
      },
      content: ''
    });
  }

  return app.toStream('redirects')
    .on('error', console.error)
    .pipe(app.renderFile('hbs'))
    .on('error', console.error)
    .pipe(prettify())
    .pipe(extname())
    .pipe(app.dest('../_gh_pages'));
});

/**
 * Build the assemble docs
 */

app.task('build', ['load'], function() {
  return app.toStream('docs')
    .on('error', console.log)
    .pipe(app.renderFile())
    .on('error', console.log)
    .pipe(prettify())
    .pipe(extname())
    .pipe(through.obj(function(file, enc, next) {
      file.path = file.data.permalink || file.path;
      file.base = '_gh_pages';
      next(null, file);
    }))
    .pipe(manifest(app, {
      base: 'en/v' + pkg.version,
      renamePath: function(fp) {
        var idx = fp.indexOf('en/v' + pkg.version);
        if (idx === -1) return fp;
        return fp.substr(idx);
      }
    }))
    .pipe(app.dest(function(file) {
      // console.log(file);
      return '../_gh_pages';
    }))
    .pipe(browserSync.stream());
});

app.task('assets', function() {
  return app.copy(['src/assets/**/*'], '../_gh_pages/en/v' + pkg.version + '/assets');
});

/**
 * Watch files for changes
 */

app.task('watch', function() {
  app.watch('**/*.{md,hbs}', ['build']);
  console.log('watching docs templates');
});

/**
 * Dev: alias for building, serving, and watching docs.
 */

app.task('dev', ['default'], app.parallel(['serve', 'watch']));

/**
 * Production: alias for cleaning and building docs.
 */

app.task('default', [
  'clean',
  'build',
  'assets',
  'redirects',
  'generate-redirects'
]);

/**
 * Expose the `app` instance
 */

module.exports = app;
