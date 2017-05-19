#!/usr/bin/env node

var fs = require('fs');
var util = require('util');
var path = require('path');
var assemble = require('..');
var commands = require('../lib/commands');
var plugins = require('../lib/plugins');
var utils = require('../lib/utils');
var errors = require('./errors');
var argv = utils.parseArgs(process.argv.slice(2));

function run(cb) {
  var cwd = process.cwd();
  var app;

  /**
   * Set the working directory
   */

  if (argv.cwd && cwd !== path.resolve(argv.cwd)) {
    process.ORIG_CWD = process.cwd();
    process.chdir(argv.cwd);
    cwd = process.cwd();
  }

  /**
   * Log the working directory
   */

  console.log(utils.log.timestamp, 'using cwd ' + utils.formatDir(cwd));

  /**
   * Get the assemblefile.js to use
   */

  var assemblefile = path.resolve(cwd, argv.file || 'assemblefile.js');

  /**
   * Get the `assemble` instance to use
   */

  var defaults = require('../lib/generator');
  var configfile = fs.existsSync(assemblefile);
  if (configfile) {
    app = require(assemblefile);
  } else {
    app = defaults;
  }

  /**
   * If `app` is a function, it's an assemble "generator",
   * so we need to invoke it with an instance of assemble
   */

  if (typeof app === 'function') {
    var fn = app;
    app = assemble(argv);
    app.option(argv);
    app.use(fn);
  } else if (Object.keys(app).length === 0) {
    var msg = util.format(errors['instance'], utils.homeRelative(assemblefile));
    cb(new Error(msg));
    return;
  }

  assemble.initPlugins(app);

  /**
   * Listen for errors
   */

  app.on('error', handleError);
  app.on('build', function(event, build) {
    if (typeof event === 'string' && !build.isSilent) {
      app.log.time(event, build.key, app.log.magenta(build.time));
    }
  });
  app.on('task', function(event, task) {
    if (typeof event === 'string' && !task.isSilent) {
      app.log.time(event, task.key);
    }
  });

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (argv.emit && typeof argv.emit === 'string') {
    app.on(argv.emit, app.log.bind(console));
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

  if (configfile) {
    var fp = utils.homeRelative(assemblefile);
    app.log.path('using assemblefile ' + utils.colors.green('~/' + fp));
  }

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
  commands(app);

  /**
   * Process command line arguments
   */

  app.cli.process(app.get('cache.argv'), function(err) {
    if (err) handleError(err);

    /**
     * Run tasks
     */

    var tasks = app.get('cache.argv.tasks');
    app.build(tasks, function(err) {
      if (err) handleError(err);
      app.log.success('finished');
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
