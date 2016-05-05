'use strict';
var path = require('path');
var debug = require('debug')('generate:doc');
var utils = require('./lib/utils');

module.exports = function(app, base) {
  if (this.isRegistered('assemble-docs-generate-doc')) return;
  debug('initializing <%s>, from <%s>', __filename, module.parent.id);

  /**
   * Use `generate-mocha` to pull in instance and pipeline plugins
   */

  app.use(require('generate-mocha'));

  /**
   * Set options
   */

  app.option('renameFile', function(file) {
    file.stem = 'page';
    return file;
  });

  /**
   * Default variables
   */

  var cwd = process.cwd();
  var defaultDest = 'templates/pages';
  var defaultName = 'page';

  /**
   * Tasks
   */

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

  createTask('api', {name: 'api', dest: 'content/api'});
  createTask('page', {name: 'page', dest: 'templates/pages'});
  createTask('recipe', {name: 'recipe', dest: 'content/recipes'});
  createTask('subject', {name: 'subject', dest: 'content/subjects'});

  app.task('default', ['page']);

  /**
   * Dynamically create a set of tasks for a specific tempate being generated.
   */

  function createTask(name, options) {
    var opts = utils.extend({name: 'page', dest: 'templates/pages'}, options);

    app.task(name + ':set-dest', {silent: true}, function*() {
      defaultDest = opts.dest;
    });

    app.task(name + ':set-name', {silent: true}, function*() {
      defaultName = opts.name;
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
