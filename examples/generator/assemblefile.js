'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('matched');
var async = require('async');
var project = require('project-name');
var namify = require('namify');

/**
 * This is an example generator, but it can also be used
 * to extend other generators.
 */

module.exports = function(generate, base, env) {

  /**
   * TODO: User help and defaults
   */

  generate.register('defaults', function(app) {
    app.task('init', function(cb) {
      console.log('generate > init (implement me!)');
      cb();
    });

    app.task('help', function(cb) {
      console.log('Would you like to choose a generator to run?');
      console.log('(implement me!)')
      cb();
    });

    app.task('error', function(cb) {
      console.log('generate > error (implement me!)');
      cb();
    });
  });

  /**
   * Readme task
   */

  generate.register('abc', function(app, base, env) {
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

  generate.register('store', function(app) {
    app.task('del', function(cb) {
      generate.store.del({ force: true });
      console.log('deleted data store');
      cb();
    });
  });

  /**
   * Default configuration settings
   */

  generate.task('defaultConfig', function(cb) {
    if (!generate.templates) {
      generate.create('templates');
    }
    generate.engine(['md', 'text'], require('engine-base'));
    generate.data({year: new Date().getFullYear()});
    cb();
  });

  /**
   * User prompts
   */

  generate.task('prompt', function(cb) {
    var pkg = env.config.pkg;

    if (!pkg || env.user.isEmpty || env.argv.raw.init) {
      forceQuestions(generate);
    }

    generate.questions.setData(pkg || {});
    generate.ask({ save: false }, function(err, answers) {
      if (err) return cb(err);
      if (!pkg) answers = {};

      answers.name = answers.name || project();
      answers.varname = namify(answers.name);
      generate.set('answers', answers);
      cb();
    });
  });

  /**
   * Load templates to be rendered
   */

  generate.task('templates', ['defaultConfig'], function(cb) {
    var opts = { cwd: env.config.cwd, dot: true };

    glob('templates/*', opts, function(err, files) {
      if (err) return cb(err);
      async.each(files, function(name, next) {
        var fp = path.join(opts.cwd, name);

        var contents = fs.readFileSync(fp);
        generate.template(name, {contents: contents, path: fp});
        next();
      }, cb);
    });
  });

  /**
   * Default task to be run
   */

  generate.task('default', function(cb) {
    generate.build('defaults:help', cb);
  });
};

/**
 * Force questions to be (re-)asked
 */

function forceQuestions(generate) {
  generate.questions.options.forceAll = true;
}
