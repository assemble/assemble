'use strict';

var path = require('path');
var del = require('delete');
var prettify = require('gulp-prettify');
var extname = require('gulp-extname');
var ignore = require('gulp-ignore');

var assemble = require('../');
var pkg = require('../package');
var utils = require('../lib/utils');
var manifest = require('./plugins/manifest');
var redirects = require('./plugins/redirects');


/**
 * Create our assemble appplication
 */

var app = assemble();

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

app.create('docs');

/**
 * Load helpers
 */

app.helpers('helpers/*.js');

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
 * Middleware
 */

app.preLayout(/\/api\/.*\.md$/, function(view, next) {
  view.layout = 'body';
  next();
});

/**
 * Clean out the current version's built files
 */

app.task('clean', function(cb) {
  var pattern = '../_gh_pages/en/v' + pkg.version;
  del(pattern, {force: true}, cb);
});

/**
 * Build manifest for a specific version.
 * This is in case an old version didn't have a manifest or something.
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
      return '.';
    }));
});

/**
 * Re-load templates when triggered by watch
 */

app.task('load', function(cb) {
  app.partials('templates/partials/*.hbs');
  app.layouts('templates/layouts/*.hbs');
  app.docs('src/api/*.md');
  cb();
});

/**
 * Building the assemble docs
 */

app.task('default', ['clean', 'load'], function() {
  return app.toStream('docs')
    .on('err', console.log)
    .pipe(app.renderFile())
    .on('err', console.log)
    .pipe(prettify())
    .pipe(extname())
    .pipe(manifest(app, {
      renamePath: function(fp) {
        return 'en/v' + pkg.version + '/' + fp;
      }
    }))
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return '../_gh_pages/en/v' + pkg.version;
    }))
});

/**
 * Watch files for changes
 */

app.task('watch', ['default'], function() {
  app.watch('**/*.{md,hbs}', ['default']);
  console.log('watching docs templates');
});

/**
 * Expose the `app` instance
 */

module.exports = app;
