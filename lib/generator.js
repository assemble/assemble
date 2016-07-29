'use strict';

var utils = require('./utils');

module.exports = function(app) {

  // use `base-questions` plugin for user prompts
  app.use(utils.questions());

  /**
   * Listend for `done` event
   */

  app.on('done', function() {
    app.log.success('done');
    process.exit();
  });

  /**
   * Generate an `assemblefile.js`
   */

  app.task('init', function(cb) {
    app.confirm('init', 'Welcome to assemble! Want to create an assemblefile.js?');
    app.ask('init', {save: false}, function(err, answers) {
      if (err) {
        cb(err);
        return;
      }
      if (!answers.init) {
        app.log.time('Got it, we\'re all finished here. Run `assemble` to lean the next step.');
        app.emit('done');
        return;
      }
      app.build(['new', 'prompt-install'], cb);
    });
  });

  /**
   * Generate an `assemblefile.js`
   */

  app.task('new', function(cb) {
    app.src('templates/assemblefile.js', {cwd: __dirname})
      .pipe(app.dest(process.cwd()))
      .on('end', function() {
        app.log.success('created assemblefile.js');
        cb();
      });
  });

  /**
   * Prompt to install assemble
   */

  app.task('prompt-install', function(cb) {
    app.confirm('install', 'Want to install assemble to devDependencies now?');
    app.ask('install', {save: false}, function(err, answers) {
      if (err) {
        cb(err);
        return;
      }
      if (!answers.install) {
        app.log.time('Got it, stopping');
        app.emit('done');
        return;
      }
      app.log.time('installing assemble');
      install(['assemble'], cb);
    });
  });

  /**
   * Asks if you want to generate an `assemblefile.js`
   */

  app.task('prompt-new', function(cb) {
    app.confirm('file', 'No assemblefile.js found, want to add one?');
    app.ask('file', {save: false}, function(err, answers) {
      if (err) {
        cb(err);
        return;
      }
      if (!answers.file) {
        app.log.time('Got it, stopping');
        app.emit('done');
        return;
      }
      app.build(['new', 'prompt-install'], cb);
    });
  });

  /**
   * Display a help menu of available commands and flags.
   *
   * ```sh
   * $ assemble help
   * ```
   * @name help
   * @api public
   */

  app.task('help', { silent: true }, function(cb) {
    app.base.cli.process({ help: true }, cb);
  });

  /**
   * Default task
   */

  app.task('default', ['prompt-new']);
};

/**
 * Install devDependencies
 */

function install(args, cb) {
  args = ['install', '--save-dev'].concat(args);
  utils.spawn('npm', args, {stdio: 'inherit'})
    .on('error', cb)
    .on('close', function(code, err) {
      cb(err, code);
    });
}
