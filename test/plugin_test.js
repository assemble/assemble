/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var path = require('path');
var _ = require('lodash');

var assemble = require('../');

describe('middleware', function() {

  it('should load middleware', function(done) {
    var options = {
      name: 'middleware-test-1',
      source: 'Some Template',
      data: {
        middleware: [path.join(__dirname, '../examples/middleware/example-js.js')]
      }
    };
    assemble(options).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      expect(_.keys(results.middleware).length).to.not.eql(0);
      done();
    });
  });

});
