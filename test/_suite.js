'use strict';

var assemble = require('..');
var runner = require('base-test-runner')();
var suite = require('base-test-suite');

/**
 * Run the tests in `base-test-suite`
 */

runner.on('templates', function(file) {
  require(file.path)(assemble);
});

runner.addFiles('templates', suite.test.templates);
runner.addFiles('templates', suite.test['assemble-core']);
