'use strict';
var path = require('path');
var opts = {alias: {tmpl: 't'}, default: {tmpl: 'page'}};
var argv = require('minimist')(process.argv.slice(2), opts);
var debug = require('debug')('generate:doc');

var utils = require('./lib/utils');
var rename = require('./lib/rename');
var files = require('./lib/files');

module.exports = function(app, base) {
  if (this.isRegistered('assemble-docs-generate-doc')) return;
  debug('initializing <%s>, from <%s>', __filename, module.parent.id);

  /**
   * Register instance plugins
   */

  app
    .use(require('generate-defaults'))
    .use(require('generate-collections'))
    .use(utils.conflicts())
    .use(rename())
    .use(files());

  /**
   * Set options
   */

  app
    .option(base.options)
    .option(argv)
    .option({delims: ['<%', '%>']})
    .option('renameFile', function(file) {
      file.stem = 'page';
      return file;
    });

  /**
   * Register pipeline plugins
   */

  app.plugin('rename', rename);

  /**
   * Register helpers
   */

  app.helper('camelcase', require('camel-case'));
  app.helper('relative', function(dest) {
    return (dest !== this.app.cwd) ? path.relative(dest, this.app.cwd) : './';
  });

  var cwd = process.cwd();

  var defaultDest = 'templates/pages';
  function setDefaultDest(dest) {
    return function*() {
      defaultDest = dest;
    };
  }

  var defaultName = 'page';
  function setDefaultName(name) {
    return function*() {
      defaultName = name;
    };
  }

  app.task('templates', function*() {
    app.debug('loading templates');
    app.templates(['./scaffolds/**/*.{hbs,md}'], { cwd: cwd });
    app.debug('loaded templates');
  });

  app.task('dest', {silent: true}, function(cb) {
    app.question('dest', 'Destination directory?', {default: defaultDest});
    app.ask('dest', {save: false}, function(err, answers) {
      if (err) return cb(err);
      app.option('dest', answers.dest);
      cb();
    });
  });

  app.task('name', {silent: true}, function(cb) {
    app.question('name', 'File name?', {default: defaultName});
    app.ask('name', {save: false}, function(err, answers) {
      if (err) return cb(err);
      defaultName = answers.name;
      cb();
    });
  });

  // app.task('files', ['templates', 'name', 'dest'], function(cb) {
  //   app.chooseFiles(app.options, cb);
  // });

  function createTask(name, options) {
    var opts = utils.extend({
      defaultDest: 'templates/pages',
      defaultName: 'page'
    }, options);

    app.task(name + ':set-dest', {silent: true}, function*() {
      defaultDest = opts.defaultDest;
    });

    app.task(name + ':set-name', {silent: true}, function*() {
      defaultName = opts.defaultName;
    });

    app.task(name, [name + ':set-dest', name + ':set-name', 'templates', 'name', 'dest'], function() {
      app.debug(`generating "${name}" file`);
      var dest = app.option('dest') || app.cwd;

      // add `options` to the context
      app.data({ options: app.options });

      return app.toStream('templates')
        .pipe(filter(name))
        .pipe(app.renderFile('*'))
        .pipe(app.renameFile(function(file) {
          file.path = path.join(cwd, dest, defaultName + file.extname);
          return file;
        }))
        .pipe(app.conflicts(dest))
        .pipe(app.dest(dest));
    });
  }

  createTask('page', {
    defaultName: 'page',
    defaultDest: 'templates/pages'
  });

  createTask('api', {
    defaultName: 'api',
    defaultDest: 'content/api'
  });

  createTask('recipe', {
    defaultName: 'recipe',
    defaultDest: 'content/recipes'
  });

  createTask('subject', {
    defaultName: 'subject',
    defaultDest: 'content/subjects'
  });

  app.task('default', ['page']);
};

function filter(pattern, options) {
  var isMatch = utils.match.matcher(pattern, options);

  return utils.through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next();
      return;
    }

    if (isMatch(file)) {
      next(null, file);
    } else {
      next();
    }
  });
}
