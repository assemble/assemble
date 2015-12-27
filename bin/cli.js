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

  var app = require(assemblefile);
  if (typeof app === 'function') {
    var fn = app;
    app = assemble();
    fn(app);
  }

  var name = app.name || app.options.name || 'base';
  app.use(utils.runtimes({
    displayName: function (key) {
      return name !== key ? (name + ':' + key) : key;
    }
  }));

  app.cli.process(argv);
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
