'use strict';

var path = require('path');
var del = require('delete');
var Time = require('time-diff');
var watch = require('base-watch');
var prettify = require('gulp-prettify');
var drafts = require('gulp-drafts');
var extname = require('gulp-extname');
var ignore = require('gulp-ignore');
var debug = require('debug')('assemble:docs');
var browserSync = require('browser-sync').create();
var permalinks = require('assemble-permalinks');
var merge = require('mixin-deep');
var through = require('through2');

var viewEvents = require('./support/plugins/view-events');
var redirects = require('./support/plugins/redirects');
var manifest = require('./support/plugins/manifest');
var versions = require('./support/plugins/versions');
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
  if (fp.indexOf(__dirname) === -1) {
    return fp;
  }
  return path.basename(fp, path.extname(fp));
});

/**
 * Load some "global" data
 */

app.data({
  site: {
    title: 'Assemble Docs',
    version: pkg.version,
    base: ':destBase/en/v:site.version',
    categories: {
      docs: {
        title: 'Docs',
        description: 'Assemble documentation',
        collection: 'docs',
        filter: navFilter
      },
      api: {
        title: 'API',
        description: 'Assemble API Documentation',
        collection: 'docs-apis',
        filter: navFilter
      },
      recipes: {
        title: 'Recipes',
        description: 'Assemble recipes',
        collection: 'docs-recipes',
        filter: navFilter
      },
      subjects: {
        title: 'Subjects',
        description: 'Advanced subjects on using assemble',
        collection: 'docs-subjects',
        filter: navFilter
      }
    }
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

function navFilter(item) {
  return (typeof item.data.draft === 'undefined' || item.data.draft === false);
}

app.create('docs', {layout: 'body'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: app.data('site.categories.docs')
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/:filename.html'));

app.create('docs-api', {layout: 'body'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: app.data('site.categories.api')
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/api/:rel()/index.html', permalinkOpts));

app.create('docs-recipes', {layout: 'recipe'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: app.data('site.categories.recipes')
    }, file.data);
    next();
  })
  .use(permalinks(':site.base/recipes/:rel()/index.html', permalinkOpts));

app.create('docs-subjects', {layout: 'body'})
  .preRender(/\.md/, function(file, next) {
    file.data = merge({
      section: app.data('site.categories.subjects')
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

app.helpers('support/helpers/*.js');

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
  app.partials('templates/partials/**/*.hbs', {cwd: __dirname});
  app.layouts('templates/layouts/**/*.hbs', {cwd: __dirname});
  // app.docs('content/*.md', {cwd: __dirname});
  app.doc('content/docs.md', {cwd: __dirname});
  app.doc('content/api.md', {cwd: __dirname});
  app.doc('content/build-cycle.md', {cwd: __dirname});

  app['docs-apis']('content/api/**/*.md', {cwd: __dirname});
  app['docs-recipes']('content/recipes/**/*.md', {cwd: __dirname});
  app['docs-subjects']('content/subjects/**/*.md', {cwd: __dirname});
});

/**
 * Static server
 */

app.task('serve', function() {
  browserSync.init({
    port: 8080,
    startPath: 'docs.html',
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
    // .pipe(prettify())
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
    .pipe(app.toStream('docs-apis', changedFilter)).on('error', console.log)
    .pipe(app.toStream('docs-recipes', changedFilter)).on('error', console.log)
    .pipe(app.toStream('docs-subjects', changedFilter)).on('error', console.log)
    .pipe(drafts())
    .pipe(app.renderFile()).on('error', console.log)
    // .pipe(prettify())
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
  return app.copy(['assets/**/*'], build.dest('en/v' + pkg.version + '/assets'))
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
  'redirects',
  'generate-redirects'
]);

/**
 * Expose the `app` instance
 */

module.exports = app;
