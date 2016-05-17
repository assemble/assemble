'use strict';
var path = require('path');
var debug = require('debug')('generate:docs');
var utils = require('./support/utils');

module.exports = function(app, base) {
  debug('initializing <%s>, from <%s>', __filename, module.parent.id);
  app.option(base.options);

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));

  app.use(utils.conflict());
  app.use(utils.scaffold());

  /**
   * Default variables
   */

  var cwd = process.cwd();
  var defaultDest = 'src/templates/pages';
  var defaultName = 'page';

  /**
   * Setup boilerplate
   */

  var boilerplate = new utils.Boilerplate({
    options: {
      cwd: cwd
    },
    docs: {
      api: { src: './src/scaffolds/docs/api.md', dest: 'src/content/api' },
      recipe: { src: './src/scaffolds/docs/recipe.md', dest: 'src/content/recipes' },
      subject: { src: './src/scaffolds/docs/subject.md', dest: 'src/content/subjects' }
    },
    page: {
      src: './src/scaffolds/pages/page.hbs',
      dest: 'src/templates/pages'
    }
  });

  /**
   * Tasks
   */

  createTasks(boilerplate);

  function createDefaultTasks(app) {
    app.task('dest', {silent: true}, function(cb) {
      app.question('dest', 'Destination directory?', {default: defaultDest});
      app.ask('dest', {save: false}, function(err, answers) {
        if (err) return cb(err);
        app.option('dest', path.resolve(app.cwd, answers.dest));
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
  }

  function createTasks() {
    createDefaultTasks(app);
    var targets = createTargetTasks(app, boilerplate.targets);

    var list = [];
    var scaffolds = boilerplate.scaffolds;
    for (var prop in scaffolds) {
      var scaffold = scaffolds[prop];
      boilerplate.run(scaffold);
      createSubGenerator(prop, scaffold);
      list.push(prop);
    }
    app.task('help', function*() {
      console.log();
      console.log('Available scaffolds: ');
      targets.forEach(function(name) {
        console.log(`$ gen ${name}`);
      });
      console.log();

      console.log('Available subgenerators: ');
      list.forEach(function(name) {
        console.log(`$ gen ${name}`);
      });
      console.log();
    });
  }

  function createSubGenerator(name, scaffold) {
    app.register(name, function(gen, base) {
      gen.use(utils.conflict());
      gen.use(utils.scaffold());
      createDefaultTasks(gen);
      var targets = createTargetTasks(gen, scaffold);

      gen.task('help', { silent: true }, function*() {
        console.log();
        console.log('Available scaffolds: ');
        targets.forEach(function(name) {
          console.log(`$ gen ${gen.name}:${name}`);
        });
        console.log();
      });

      gen.task('default', 'help');
    });
  }

  function createTargetTasks(app, targets) {
    var list = [];
    for (var name in targets) {
      var target = targets[name];
      boilerplate.run(target);

      if (target.files) {
        list.push(name);
        createTargetTask(app, name, target);
      }
    }
    return list;
  }

  /**
   * Dynamically create a set of tasks for a specific tempate being generated.
   */

  function createTargetTask(app, name, target) {
    var opts = utils.extend({name: name, dest: target.files[0].dest}, target.options);

    app.task(name + ':set-dest', {silent: true}, function*() {
      defaultDest = opts.dest;
    });

    app.task(name + ':set-name', {silent: true}, function*() {
      defaultName = opts.name;
    });

    app.task(name, [name + ':set-dest', name + ':set-name', 'name', 'dest'], function() {
      app.debug(`generating "${name}" file`);
      var dest = app.option('dest') || app.cwd;

      // add `options` to the context
      app.data({ options: app.options });
      var config = {
        options: {
          cwd: cwd,
          pipeline: [
            app.renderFile('*'),
            rename(defaultName),
            app.conflicts(dest)
          ]
        }
      };
      config[name] = target;

      var scaffold = new utils.Scaffold(config);
      return app.scaffold(scaffold);
    });
  }

  function rename(name) {
    return utils.through.obj(function(file, enc, next) {
      file.stem = name;
      next(null, file);
    });
  }
};
