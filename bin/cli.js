#!/usr/bin/env node

var util = require('util');
var path = require('path');
var plugins = require('../lib/plugins');
var utils = require('../lib/utils');
var errors = require('./errors');
var assemble = require('..');

var argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {help: 'h', verbose: 'v'}
});

function run(cb) {
  var cwd = process.cwd();
  var app;

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

  /**
   * Get the `assemble` instance to use
   */


  if (utils.exists(assemblefile)) {
    app = require(assemblefile);
  } else {
    app = require('../lib/generator');
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
  } else if (Object.keys(app).length === 0) {
    var msg = util.format(errors['instance'], utils.homeRelative(assemblefile));
    cb(new Error(msg));
    return;
  }

  /**
   * Listen for errors
   */

  app.on('error', handleError);

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (argv.emit && typeof argv.emit === 'string') {
    app.on(argv.emit, console.log.bind(console));
  }

  /**
   * Process command line arguments
   */

  var tasks = argv._.length ? argv._ : ['default'];
  var args = app.argv(argv);
  args.tasks = tasks;

  app.set('cache.argv', args);
  app.option(args);

  /**
   * Show path to assemblefile
   */

  var fp = utils.homeRelative(assemblefile);
  utils.timestamp('using assemblefile ' + utils.colors.green('~/' + fp));

  /**
   * Registert `runtimes` plugin
   */

  app.use(plugins.runtimes());

  /**
   * Process command line arguments
   */

  cb(null, app);
}

/**
 * Run
 */

run(function(err, app) {
  if (err) handleError(err);

  /**
   * Process command line arguments
   */

  app.cli.process(app.get('cache.argv'), function(err) {
    if (err) handleError(err);

    /**
     * Run tasks
     */

    app.build(app.get('cache.argv.tasks'), function(err) {
      if (err) handleError(err);
      process.exit(0);
    });
  });
});

/**
 * Handle CLI errors
 */

function handleError(err) {
  if (typeof err === 'string' && errors[err]) {
    console.error(errors[err]);
  } else {
    if (argv.verbose) {
      console.error(err.stack);
    } else {
      console.error(err.message);
    }
  }
  process.exit(1);
}
