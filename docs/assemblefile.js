'use strict';

var path = require('path');
var del = require('delete');
var Time = require('time-diff');
var watch = require('base-watch');
var drafts = require('gulp-drafts');
var extname = require('gulp-extname');
var ignore = require('gulp-ignore');
var debug = require('debug')('assemble:docs');
var browserSync = require('browser-sync').create();
var collections = require('assemble-collections');
var permalinks = require('assemble-permalinks');
var getDest = require('view-get-dest');
var merge = require('mixin-deep');
var through = require('through2');
var ghPages = require('gulp-gh-pages');
var ghClone = require('gh-clone');
var cmd = require('spawn-commands');

var viewEvents = require('./support/plugins/view-events');
var redirects = require('./support/plugins/redirects');
var manifest = require('./support/plugins/manifest');
var versions = require('./support/plugins/versions');
var utils = require('./support/utils');
var pkg = require('../package');
var assemble = require('..');

/**
 * Create our assemble appplication
 */

var app = assemble();

app.time = new Time();
app.use(viewEvents('permalink'));
app.use(collections());
app.use(getDest());
app.use(watch());

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
  debug('onPermalink for %s', file.path);
  file.data = merge({category: 'docs'}, app.cache.data, file.data);
  next();
});

/**
 * Customize how templates are stored. This changes the
 * key of each template, so it's easier to lookup later
 */

app.option('renameKey', function(fp, view) {
  // key has already been renamed, just strip extension
  if (fp.indexOf(__dirname) === -1) {
    if (/\.md$/.test(fp)) {
      return fp.substr(0, fp.length - 3);
    }
    return fp;
  }

  // remove __dirname/content
  var base = fp.replace(__dirname, '');
  fp = base.split(path.sep)
    .filter(Boolean)
    .slice(1)
    .join(path.sep);

  // drop extension
  var ext = path.extname(fp);
  return fp.substr(0, fp.length - ext.length);
});

/**
 * Load some "global" data
 */

app.data({
  docs: {
    content: 'https://github.com/assemble/assemble/tree/master/docs/content'
  },
  pkg: pkg,
  site: {
    title: 'Assemble Docs',
    description: 'The static site generator for Node.js, Grunt.js and Yeoman.',
    lead: 'It has never been easier to leverage the full force of powerful frameworks like Bootstrap and Zurb Foundation. Nothing can stop you now.',
    version: pkg.version,
    base: ':destBase/en/v:site.version',
    baseUrl: 'http://assemble.io'
  },
  // slug is defined in the url helper. this should be refactored.
  url: ':site.baseUrl/en/v:site.version/docs/:slug()',
  destBase: '_gh_pages',
  assets: ':site.base/assets',
  links: [{
    dest: 'assemble',
    collection: 'docs',
    text: 'Assemble'
  }]
});

/**
 * Permalink options to use in the permalinks plugin below
 */

var permalinkOpts = {
  slug: function() {
    if (this.category === 'docs') {
      return this.filename + '.html';
    }
    var rel = this.relative;
    var ext = path.extname(rel);
    return path.join(rel.substr(0, rel.length - ext.length) + '.html');
  }
};

/**
 * Custom preRender middleware to use on the `docs` collection below.
 */

function preRender(file, next) {
  var category = file.data.category;
  if (!category) return next();
  file.data = merge({
    layout: category === 'recipes' ? 'recipe' : file.data.layout
  }, file.data);
  next();
}

/**
 * Create a custom view collection for `docs`
 */

app.create('docs', {layout: 'body'})
  .preRender(/\.md/, preRender)
  .use(permalinks(':site.base/docs/:slug()', permalinkOpts));

/**
 * Configure permalinks for main site pages.
 */

app.pages.use(permalinks(':site.base/:name.html'));

/**
 * Create a custom view collection for html files that do redirects.
 */

app.create('redirects', {
  renameKey: function(key, view) {
    return view ? view.path : key;
  }
});

/**
 * Load default handlebars helpers
 */

app.helpers(require('assemble-handlebars-helpers'));

/**
 * Load helpers
 */

app.helpers('support/helpers/*.js');

/**
 * Load async-helpers
 */

app.asyncHelpers('support/async-helpers/*.js');

/**
 * Clean out the current version's built files
 */

app.task('clean', function(cb) {
  del(build.dest('en/v' + pkg.version), {force: true}, cb);
});

/**
 * Clone current assemble/assemble.io#gh-pages ensure getting previous versions.
 */

app.task('clone', function(cb) {
  var options = {
    repo: 'assemble/assemble.io',
    branch: 'gh-pages',
    dest: build.dest()
  };

  ghClone(options, function(err, config) {
    if (err) return cb(err);
    cmd(config, cb);
  });
});

/**
 * Deploy built docs to a branch for the current version.
 */

app.task('deploy', function() {
  return app.src(build.dest('**/*'))
    .pipe(ghPages({
      remoteUrl: 'https://github.com/assemble/assemble.io.git',
      branch: 'v' + pkg.version
    }));
});

/**
 * Build manifest for a specific version.
 * This is in case an old version didn't have a manifest.
 * Run with `assemble manifest --version 0.6.0`
 */

app.task('manifest', function(cb) {
  var version = app.option('version');
  if (typeof version === 'undefined' || typeof version === 'boolean') {
    cb(new Error('--version needs to be specified when running `assemble manifest`'));
    return;
  }

  var dir = build.dest('en/v' + version);
  if (!utils.exists(dir)) {
    cb(new Error('Unable to find "' + dir + '" for version "' + version + '"'));
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
    .pipe(versions(app))
    .pipe(ignore.include(['redirects.json', 'versions.json']))
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return 'data';
    }))
    .pipe(app.dest(build.dest()));
});

/**
 * Re-load templates when triggered by watch
 */

app.task('load', function* () {
  app.partials(['templates/partials/**/*.hbs'], {cwd: __dirname});
  app.layouts(['templates/layouts/**/*.hbs'], {cwd: __dirname});
  app.pages(['templates/pages/**/*.hbs'], {cwd: __dirname});
  app.docs(['content/**/*.md'], {cwd: __dirname});
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
        redirect: { seconds: 0, url: to }
      },
      content: ''
    });
  }

  return app.toStream('redirects')
    .on('error', console.error)
    .pipe(app.renderFile('hbs'))
    .on('error', console.error)
    .pipe(extname())
    .pipe(app.dest(build.dest()));
});

/**
 * Only push files through the stream that have changed.
 * This is useful when using `assemble dev`
 */

var changed = [];
function changedFilter(key, view) {
  if (!changed.length) return true;
  return changed.filter(function(fp) {
    return view.path.substr(view.path.length - fp.length) === fp;
  }).length;
}

/**
 * Build the assemble docs
 */

app.task('build', ['load'], function() {
  return app.toStream('docs', changedFilter).on('error', console.log)
    .pipe(app.toStream('pages', changedFilter)).on('error', console.log)
    .pipe(drafts())
    .pipe(app.renderFile()).on('error', console.log)
    .pipe(extname())
    .pipe(through.obj(function(file, enc, next) {
      file.path = file.dest;
      file.base = app.data('destBase');
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
    .pipe(app.dest(build.dest()))
    .pipe(browserSync.stream());
});

/**
 * Copy assets
 */

app.task('assets', function() {
  return app.copy(['assets/**/*'], build.dest('en/v' + pkg.version + '/assets'))
    .pipe(browserSync.stream());
});

/**
 * Copy static "root" files
 */

app.task('static', function(cb) {
  return app.copy(['static/**/*'], build.dest())
    .pipe(browserSync.stream());
});

/**
 * Watch files for changes
 */

app.task('watch', function() {
  app.watch('templates/**/*.hbs', 'build');
  app.watch('assets/**/*', 'assets');
  var watcher = app.watch('content/**/*.md');

  console.log('watching docs templates');

  // manually handle the change event build
  // up a list of actual changed files and kick off
  // the build. This is useful with `assemble dev`
  watcher.on('change', function(fp) {
    changed.push(fp);
    app.build(['build'], function() {
      changed = [];
    });
  });
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
  'static',
  'redirects',
  'generate-redirects'
]);

/**
 * Expose the `app` instance
 */

module.exports = app;
