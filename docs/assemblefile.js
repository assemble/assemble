'use strict';

var path = require('path');
var cwd = require('memoize-path')(__dirname);
var debug = require('debug')('assemble:docs');
var pipeline = require('./support/pipeline');
var plugin = require('./support/plugins');
var Search = require('./support/search');
var utils = require('./support/utils');
var pkg = require('../package');
var assemble = require('..');

/**
 * Create our assemble application
 */

var app = assemble();
utils.diff('starting build');

/**
 * Load plugins
 */

app.use(plugin.viewEvents('permalink'));
app.use(plugin.collections());
app.use(plugin.getDest());
app.use(plugin.watch());
utils.diff('loaded plugins');

/**
 * Setup search plugin
 */

var search = new Search(app);

/**
 * Common variables
 */

var build = {
  // site assets
  assets: src('assets'),
  static: src('static'),

  // site data
  data: src('data'),

  // site content and templates
  content: src('content'),
  templates: src('templates'),
  partials: src('templates/partials'),
  layouts: src('templates/layouts'),
  pages: src('templates/pages'),

  // dest path
  dest: src('../_gh_pages')
};

// create src path from `memoize-path`
function src(base) {
  return function(fp) {
    return fp ? cwd(base)(fp)() : cwd(base)();
  };
}

/**
 * Middleware
 */

app.onPermalink(/./, function(file, next) {
  debug('onPermalink for %s', file.path);
  file.data = utils.merge({category: 'docs'}, app.cache.data, file.data);
  next();
});

/**
 * Load helpers
 */

app.helpers(require('assemble-handlebars-helpers'));
app.asyncHelpers('support/async-helpers/*.js');
app.helpers('support/helpers/*.js');
utils.diff('loaded helpers');

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
    title: 'Assemble Documentation',
    description: 'The static site generator for Node.js.',
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
utils.diff('loaded data');

/**
 * Custom preRender middleware to use on the `docs` collection below.
 */

function preRender(file, next) {
  var category = file.data.category;
  if (!category) return next();
  file.data = utils.merge({
    layout: category === 'recipes' ? 'recipe' : file.data.layout
  }, file.data);
  next();
}

/**
 * Create a custom view collection for `docs`
 */

app.create('docs', {layout: 'body'});
app.docs.preRender(/\.md/, preRender);
app.docs.use(plugin.permalinks(':site.base/docs/:slug()', {
  slug: function() {
    if (this.category === 'docs') {
      return this.filename + '.html';
    }
    var rel = this.relative;
    var ext = path.extname(rel);
    return path.join(rel.substr(0, rel.length - ext.length) + '.html');
  }
}));
utils.diff('created docs collection');

/**
 * Create a custom view collection for html
 * files that do redirects.
 */

app.create('redirects', {renameKey: utils.renameKey});
utils.diff('configured redirects collection');

/**
 * Configure permalinks for main site pages.
 */

app.pages.use(plugin.permalinks(':site.base/:name.html'));
utils.diff('configured permalinks plugin');

/**
 * Clean out the current version's built files
 */

app.task('clean', function(cb) {
  utils.del(build.dest('en/v' + pkg.version), {force: true}, cb);
});

/**
 * Clone current assemble/assemble.io#gh-pages ensure getting previous versions.
 */

app.task('clone', function(cb) {
  utils.diff('starting clone task');

  var options = {
    repo: 'assemble/assemble.io',
    branch: 'gh-pages',
    dest: build.dest()
  };

  utils.ghClone(options, function(err, config) {
    if (err) return cb(err);
    utils.cmd(config, cb);
  });
});

/**
 * Deploy built docs to a branch for the current version.
 */

app.task('deploy', function() {
  utils.diff('starting deploy task');

  return app.src(build.dest('**/*'))
    .pipe(pipeline.ghPages({
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
  utils.diff('starting manifest task');

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
    .pipe(pipeline.manifest(app, {
      renamePath: function(fp) {
        return 'en/v' + version + '/' + fp;
      }
    }))
    .pipe(pipeline.ignore.include('manifest.json'))
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return dir;
    }))
    .on('end', function() {
      utils.diff('finished manifest task');
    });
});

/**
 * Re-load site content when triggered by watch
 */

app.task('load-content', function* () {
  utils.diff('loading content');
  app.docs(build.content('**/*.md'));
});

/**
 * Re-load templates when triggered by watch
 */

app.task('load-templates', function* () {
  utils.diff('loading templates');
  app.partials(build.partials('**/*.hbs'));
  app.layouts(build.layouts('**/*.hbs'));
  app.pages(build.pages('**/*.hbs'));
});

/**
 * Static server
 */

app.task('serve', function() {
  pipeline.browserSync.init({
    port: 8080,
    startPath: 'index.html',
    server: {
      baseDir: build.dest()
    }
  });
});

/**
 * Build up a redirects.json file
 */

app.task('create-redirects', function() {
  utils.diff('starting create-redirects task');

  return app.src(build.dest('en/*/manifest.json'))
    .pipe(pipeline.redirects(app))
    .pipe(pipeline.versions(app))
    .pipe(pipeline.ignore.include(['redirects.json', 'versions.json']))
    .pipe(app.dest(function(file) {
      file.base = file.dirname;
      return build.data();
    }))
    .pipe(app.dest(build.dest()))
    .on('end', function() {
      utils.diff('finished create-redirects task');
    });
});

/**
 * Create redirect views from paths > "data/redirects.json"
 */

app.task('render-redirects', function() {
  app.data(build.data('redirects.json'), { namespace: 'redirects' });
  var redirects = app.data('redirects');

  for (var key in redirects) {
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
    .pipe(pipeline.extname())
    .pipe(app.dest(build.dest()))
    .on('end', function() {
      utils.diff('finished render-redirects task');
    });
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

app.task('build', ['load-*'], function() {
  utils.diff('starting build task');

  return app.toStream('docs', changedFilter).on('error', console.log)
    .pipe(app.toStream('pages', changedFilter)).on('error', console.log)
    .pipe(pipeline.drafts())
    .pipe(search.collect())
    .pipe(app.renderFile()).on('error', console.log)
    .pipe(pipeline.extname())
    .pipe(utils.through.obj(function(file, enc, next) {
      file.path = file.dest;
      file.base = app.data('destBase');
      next(null, file);
    }))
    .pipe(pipeline.manifest(app, {
      base: 'en/v' + pkg.version,
      renamePath: function(fp) {
        var idx = fp.indexOf('en/v' + pkg.version);
        if (idx === -1) return fp;
        return fp.substr(idx);
      }
    }))
    .pipe(search.generate({
      base: 'en/v' + pkg.version
    }))
    .pipe(app.dest(build.dest()))
    .pipe(pipeline.browserSync.stream())
    .on('end', function() {
      utils.diff('finished build task');
    });
});

/**
 * Copy assets
 */

app.task('assets', function() {
  utils.diff('starting assets task');

  return app.copy(build.assets('**/*'), build.dest('en/v' + pkg.version + '/assets'))
    .pipe(pipeline.browserSync.stream())
    .on('end', function() {
      utils.diff('finished assets task');
    });
});

/**
 * Copy static "root" files
 */

app.task('static', function(cb) {
  utils.diff('starting static task');

  return app.copy(build.static('**/*'), build.dest())
    .pipe(pipeline.browserSync.stream())
    .on('end', function() {
      utils.diff('finished static task');
    });
});

/**
 * Watch files for changes
 */

app.task('watch', function() {
  app.watch(build.templates('**/*.hbs'), 'build');
  app.watch(build.assets('**/*'), 'assets');
  var watcher = app.watch(build.content('**/*.md'));

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
  'create-redirects',
  'render-redirects'
], function(cb) {
  utils.diff('finished default task');
  cb();
});

/**
 * Expose the `app` instance
 */

module.exports = app;
