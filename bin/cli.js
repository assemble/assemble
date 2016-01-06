#!/usr/bin/env node

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var utils = require('../lib/utils');
var errors = require('./errors');
var assemble = require('..');

function run(cb) {
  var cwd = process.cwd();
  var root = cwd;

  if (argv.cwd && process.cwd() !== argv.cwd) {
    process.chdir(argv.cwd);
    utils.timestamp('cwd changed to ' + utils.colors.yellow('~/' + argv.cwd));
  }

  /**
   * Get the assemblefile.js to use
   */

  var assemblefile = path.resolve(process.cwd(), 'assemblefile.js');

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
  if (typeof app === 'function') {
    var fn = app;
    app = assemble();
    app.option(argv);
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

  var fp = utils.homeRelative(root, assemblefile);
  utils.timestamp('using assemblefile ' + fp);

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

  var tasks = app.get('argv.tasks');
  if (!tasks.length) {
    tasks = ['default'];
  }

  /**
   * Listen for errors
   */

  app.on('error', function(err) {
    console.log(err);
  });

  /**
   * Run tasks
   */

  app.build(tasks, function(err) {
    if (err) throw err;
    utils.timestamp('finished ' + utils.success());
    process.exit(0);
  });
});



function handleError(err) {
  if (typeof err === 'string' && errors[err]) {
    console.error(errors[err]);
  } else {
    console.error(err);
  }
  process.exit(1);
}
