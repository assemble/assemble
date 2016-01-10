#!/usr/bin/env node

var path = require('path');
var utils = require('../lib/utils');
var errors = require('./errors');
var assemble = require('..');
var Env = assemble.Env;

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
    app.fn = fn;
    fn(app);
  }

  app.generator('base', require('../lib/generator'));

  /**
   * Create enviroment
   */

  app.env = createEnv('assemblefile.js', process.cwd());

  /**
   * Process command line arguments
   */

  // var app = runner(argv);
  var args = utils.processArgv(app, argv);
  app.set('argv', args);

  /**
   * Show path to assemblefile
   */

  var fp = utils.homeRelative(root, assemblefile);
  utils.timestamp('using assemblefile ' + fp);

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
   * Listen for generator configs, and register them
   * as they're emitted
   */

  app.env.on('config', function(name, env) {
    app.register(name, env.config.fn, env);
  });

  /**
   * Resolve assemble generators
   */

  app.env
    .resolve('assemble-generator-*/assemblefile.js', {
      configfile: 'assemblefile.js',
      cwd: utils.gm
    })
    .resolve('generate-*/generator.js', {
      configfile: 'generator.js',
      cwd: utils.gm
    });

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

  /**
   * Run tasks
   */

  app.build(argv, function(err) {
    if (err) throw err;
    utils.timestamp('finished ' + utils.success());
    process.exit(0);
  });
});

/**
 * Creat a new `env` object
 */

function createEnv(configfile, cwd) {
  var env = new Env(configfile, 'assemble', cwd);;
  env.module.path = utils.tryResolve('assemble');
  return env;
}

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
