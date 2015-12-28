#!/usr/bin/env node

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var utils = require('../lib/utils');
var errors = require('./errors');
var assemble = require('..');

function run(cb) {
  var cwd = process.cwd();

  /**
   * Get the assemblefile.js to use
   */

  var assemblefile = path.resolve(cwd, 'assemblefile.js');

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

  var args = utils.processArgv(app, argv);

  /**
   * Setup composer-runtimes
   */

  var name = app.name || app.options.name || 'base';
  app.use(utils.runtimes({
    displayName: function (key) {
      return name !== key ? (name + ':' + key) : key;
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
  if (typeof err === 'string' && errors[err]) {
    console.log(errors[err]);
    process.exit(1);
  }

  app.build('default', function(err) {
    if (err) throw err;
    utils.timestamp('finished ' + utils.success());
    process.exit(0);
  });
});
