/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;

var assemble = require('../');

describe('async helpers', function() {

  it('should render from a string with an async helper', function (done) {

    var src = 'Render string {{asyncFoo foo}}.';
    var expected = 'Render string with context.';
    assemble(src, {
      foo: 'with context',
      helpers: ['test/fixtures/helpers/**/*.js']
    }).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      expect(results.source.content).to.eql(expected);
      done();
    });
  });

  it('should render from a string with a long running async helper', function (done) {
    var src = 'Timeout: {{timeout 1.5}}';
    var expected = 'Timeout: Finished in 1.5 seconds.';
    assemble(src, {
      helpers: ['test/fixtures/helpers/**/*.js']
    }).build(function (err, results) {
      if (err) {
        console.log('Error', err);
      }
      expect(results.source.content).to.eql(expected);
      done();
    });
  });

  it('should render from a template file with an async helper', function (done) {
    var src = 'test/fixtures/templates/async/index.hbs';
    var expected = 'Render async string.\n';
    var options = {
      helpers: ['test/fixtures/helpers/**/*.js']
    };

    assemble(src, options).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      expect(results.source.content).to.eql(expected);
      done();
    });
  });

});
