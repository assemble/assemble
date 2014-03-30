
  /**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var _ = require('lodash');

var assemble = require('../');

describe('async helpers', function() {

  it('should render from a string with an async helper', function(done) {

    var source = 'Render string {{asyncFoo foo}}.';
    var expected = 'Render string with context.';
    assemble(source, {
      metadata: {
        foo: 'with context',
        helpers: ['test/fixtures/helpers/**/*.js']
      }
    }).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      expect(_.keys(results.components).length).to.eql(1);
      expect(results.components[_.keys(results.components)[0]].content).to.eql(expected);
      done();
    });
  });

});
