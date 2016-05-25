'use strict';

var runner = require('base-test-runner')();
var suite = require('base-test-suite');

/**
 * Run the tests in `base-test-suite`
 */

runner.on('templates', function(file) {
  require(file.path)(require('..'));
});

runner.addFiles('templates', suite.test.templates);
