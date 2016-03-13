'use strict';

var path = require('path');
var del = require('delete');
var Time = require('time-diff');
var watch = require('base-watch');
var prettify = require('gulp-prettify');
var extname = require('gulp-extname');
var ignore = require('gulp-ignore');
var debug = require('debug')('assemble:docs');
var browserSync = require('browser-sync').create();
var permalinks = require('assemble-permalinks');
var markdown = require('helper-markdown');
var merge = require('mixin-deep');
var through = require('through2');

var viewEvents = require('./support/plugins/view-events');
var redirects = require('./support/plugins/redirects');
var manifest = require('./support/plugins/manifest');
var getDest = require('./support/plugins/get-dest');
var utils = require('./support/utils');
var pkg = require('../package');
var assemble = require('..');

/**
 * Create our assemble appplication
 */

var app = assemble();
app.time = new Time();
viewEvents('permalink')(app);
app.use(permalinks());
app.use(getDest());
app.use(watch());

app.on('error', function(err) {
  console.log(err.stack);
});

/**
 * Common variables
 */

var build = {
  dest: path.resolve.bind(path, __dirname, '../_gh_pages')
};

/**
 * Middleware
 */

app.onPermalink(/./, function(file, next) {
  debug('creating permalink context for %s', file.path);
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

/**
 * Create a custom view collection
 */

var permalinkOpts = {
  rel: function() {
    var rel = this.relative;
    var ext = path.extname(rel);
    return rel.substr(0, rel.length - ext.length);
  }
};

app.create('docs', {layout: 'body'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: {
        title: 'Docs',
        description: 'Assemble documentation',
        collection: 'docs'
      }
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/:filename.html'));

app.create('docs-api', {layout: 'body'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: {
        title: 'API',
        description: 'Assemble API Documentation',
        collection: 'docs-api'
      }
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/api/:rel()/index.html', permalinkOpts));

app.create('docs-recipes', {layout: 'markdown-raw'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: {
        title: 'Recipes',
        description: 'Assemble recipes',
        collection: 'docs-recipes'
      }
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/recipes/:rel()/index.html', permalinkOpts));

app.create('docs-subjects', {layout: 'body'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: {
        title: 'Subjects',
        description: 'Advanced subjects on using assemble',
        collection: 'docs-subjects'
      }
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/subjects/:rel()/index.html', permalinkOpts));


app.create('redirects', {
  renameKey: function(key, view) {
    return view ? view.path : key;
  }
});

/**
 * Load helpers
 */

app.helper('markdown', markdown);
app.helpers('support/helpers/*.js');

app.helper('resolveId', function(id, options) {
  return this.resolveId(id);
});

/**
 * Clean out the current version's built files
 */

app.task('clean', function(cb) {
  del(build.dest('en/v' + pkg.version), {force: true}, cb);
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
    cb(new Error('--version needs to be specified when running `assemble manifest`'));
    return;
  }

  var dir = build.dest('en/v' + version);
  if (!utils.exists(dir)) {
    cb(new Error('invalid version [' + version + ']. ' + dir + ' does not exist'));
    return;
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
  return app.src(build.dest('en/*/manifest.json'))
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
  app.partials('templates/partials/**/*.hbs', {cwd: __dirname});
  app.layouts('templates/layouts/**/*.hbs', {cwd: __dirname});
  // app.docs('content/*.md', {cwd: __dirname});
  app.doc('content/docs.md', {cwd: __dirname});
  app.doc('content/api.md', {cwd: __dirname});
  app.doc('content/build-cycle.md', {cwd: __dirname});

  app['docs-apis']('content/api/**/*.md', {cwd: __dirname});
  app['docs-recipes']('content/recipes/**/*.md', {cwd: __dirname});
  app['docs-subjects']('content/subjects/**/*.md', {cwd: __dirname});
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
      baseDir: build.dest()
    }
  });
});

/**
 * Create redirect views from paths > "data/redirects.json"
 */

app.task('generate-redirects', function() {
  app.data('data/redirects.json', { namespace: 'redirects' });
  var redirects = app.data('redirects');

  for(var key in redirects) {
    var to = redirects[key];
    app.redirect(key, {
      path: key,
      data: {
        title: key,
        layout: 'redirect',
        redirect: { seconds: 3, url: to }
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
    .pipe(app.dest(build.dest()));
});

/**
 * Build the assemble docs
 */

app.task('build', ['load'], function() {
  return app.toStream('docs').on('error', console.log)
    .pipe(app.toStream('docs-apis')).on('error', console.log)
    .pipe(app.toStream('docs-recipes')).on('error', console.log)
    .pipe(app.toStream('docs-subjects')).on('error', console.log)
    .pipe(app.renderFile()).on('error', console.log)
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
      return build.dest();
    }))
    .pipe(browserSync.stream());
});

/**
 * Copy assets
 */

app.task('assets', function() {
  return app.copy(['assets/**/*'], build.dest('en/v' + pkg.version + '/assets'));
});

/**
 * Watch files for changes
 */

app.task('watch', function() {
  app.watch(['{content,recipes}/**/*.md', 'templates/**/*.hbs'], ['build']);
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
