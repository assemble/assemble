#!/usr/bin/env node

var path = require('path');
var utils = require('../lib/utils');
var errors = require('./errors');
var assemble = require('..');

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    help: 'h',
    verbose: 'v'
  }
});

function run(cb) {
  var cwd = process.cwd();
  var root = cwd;

  /**
   * Set the working directory
   */

  if (argv.cwd && cwd !== path.resolve(argv.cwd)) {
    process.chdir(argv.cwd);
    cwd = process.cwd();
  }

  /**
   * Log the working directory
   */

  utils.timestamp('cwd set to ' + utils.formatDir(cwd));

  /**
   * Get the assemblefile.js to use
   */

  var assemblefile = path.resolve(cwd, argv.file || 'assemblefile.js');

  /**
   * Notify the user if assemblefile.js is not found
   */

  if (!utils.exists(assemblefile)) {
    cb('assemblefile');
    return;
  }

  /**
   * Get the `assemble` instance to use
   */

  var app = require(assemblefile);
  if (utils.hasValue(app) === false) {
    var msg = errors['exports']
      .split('${assemblefile}')
      .join(utils.homeRelative(assemblefile));

    var err = new Error(msg);
    cb(err);
    return;
  }

  /**
   * If `app` is a function, it's an assemble "generator",
   * so we need to invoke it with an instance of assemble
   */

  if (typeof app === 'function') {
    var fn = app;
    app = assemble(argv);
    app.option(argv);
    app.fn = fn;
    fn(app);
  }

  /**
   * Process command line arguments
   */

  var args = utils.processArgv(app, argv);
  app.set('argv', args);

  /**
   * Show path to assemblefile
   */

  var fp = utils.homeRelative(assemblefile);
  utils.timestamp('using assemblefile ' + utils.colors.green('~/' + fp));

  /**
   * Setup composer-runtimes
   */

  app.use(utils.runtimes({
    displayName: function (key) {
      return app.name !== key ? (app.name + ':' + key) : key;
    }
  }));

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (argv.emit && typeof argv.emit === 'string') {
    app.on(argv.emit, console.error.bind(console));
  }

  /**
   * Process command line arguments
   */

  app.cli.process(args);
  cb(null, app);
}

/**
 * Run
 */

run(function(err, app) {
  if (err) handleError(err);

  /**
   * Listen for errors
   */

  app.on('error', function(err) {
    console.log(err);
  });

  var tasks = app.get('argv.tasks');
  if (!tasks.length) {
    tasks = ['default'];
  }

  /**
   * Run tasks
   */

  app.build(tasks, function(err) {
    if (err) throw err;
    utils.timestamp('finished ' + utils.success());
    process.exit(0);
  });
});

/**
 * Handle CLI errors
 */

function handleError(err) {
  if (typeof err === 'string' && errors[err]) {
    console.error(errors[err]);
  } else {
    console.error(err);
  }
  process.exit(1);
}
