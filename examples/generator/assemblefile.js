'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('matched');
var async = require('async');
var project = require('project-name');
var namify = require('namify');

/**
 * HEADS UP! This is temporarily broken. We're re-working
 * the generator API and will update this when it's done.
 */

/**
 * This is an example generator, but it can also be used
 * to extend other generators.
 */

module.exports = function(assemble, base, env) {

  /**
   * TODO: User help and defaults
   */

  assemble.register('defaults', function(app) {
    app.task('init', function(cb) {
      console.log('assemble > init (implement me!)');
      cb();
    });

    app.task('help', function(cb) {
      console.log('Would you like to choose a generator to run?');
      console.log('_(TODO)_')
      cb();
    });

    app.task('error', function(cb) {
      console.log('assemble > error (implement me!)');
      cb();
    });
  });

  /**
   * Readme task
   */

  assemble.register('abc', function(app, base, env) {
    app.task('one', function(cb) {
      console.log('app > one');
      cb();
    });

    app.task('two', function(cb) {
      console.log('app > two');
      cb();
    });
  });

  /**
   * Data store tasks
   */

  assemble.register('store', function(app) {
    app.task('del', function(cb) {
      assemble.store.del({ force: true });
      console.log('deleted data store');
      cb();
    });
  });

  /**
   * Default configuration settings
   */

  assemble.task('defaultConfig', function(cb) {
    if (!assemble.templates) {
      assemble.create('templates');
    }
    assemble.engine(['md', 'text'], require('engine-base'));
    assemble.data({year: new Date().getFullYear()});
    cb();
  });

  /**
   * User prompts
   */

  assemble.task('prompt', function(cb) {
    var pkg = env.config.pkg;

    if (!pkg || env.user.isEmpty || env.argv.raw.init) {
      forceQuestions(assemble);
    }

    assemble.questions.setData(pkg || {});
    assemble.ask({ save: false }, function(err, answers) {
      if (err) return cb(err);
      if (!pkg) answers = {};

      answers.name = answers.name || project();
      answers.varname = namify(answers.name);
      assemble.set('answers', answers);
      cb();
    });
  });

  /**
   * Load templates to be rendered
   */

  assemble.task('templates', ['defaultConfig'], function(cb) {
    var opts = { cwd: env.config.cwd, dot: true };

    glob('templates/*', opts, function(err, files) {
      if (err) return cb(err);
      async.each(files, function(name, next) {
        var fp = path.join(opts.cwd, name);

        var contents = fs.readFileSync(fp);
        assemble.template(name, {contents: contents, path: fp});
        next();
      }, cb);
    });
  });

  /**
   * Default task to be run
   */

  assemble.task('default', function(cb) {
    assemble.build('defaults:help', cb);
  });
};

/**
 * Force questions to be (re-)asked
 */

function forceQuestions(assemble) {
  assemble.questions.options.forceAll = true;
}
