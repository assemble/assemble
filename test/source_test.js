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

var assemble = require('../lib/assemble');

describe('source', function() {

  it('should render from a string', function(done) {
    var source = 'Render string.';
    assemble(source).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      expect(_.keys(results.components).length).to.eql(1);
      expect(results.components[_.keys(results.components)[0]].content).to.eql(source);
      done();
    });
  });

  it('should render from a string using context', function(done) {
    var source = 'Render string {{foo}}.';
    var expected = 'Render string with context.';
    assemble(source, {
      metadata: {
        foo: 'with context'
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

  it('should render a string using a simple layout', function(done) {
    var source = 'Render string.';
    assemble(source, {
      metadata: {
        layoutdir: 'test/fixtures/templates/layouts',
        layoutext: '.hbs',
        layout: 'body',
      }
    }).build(function (err, results) {
      if (err) {
        console.log('Error:', err);
      }
      expect(_.keys(results.components).length).to.eql(1);
      expect(results.components[_.keys(results.components)[0]].content).to.eql(source);
      done();
    });
  });

  it('should render a string twice given a layout with two insertion points', function(done) {
    var source = 'Render string.';
    var expected = source + source;
    assemble(source, {
      metadata: {
        layoutdir: 'test/fixtures/templates/layouts',
        layoutext: '.hbs',
        layout: 'bodybody',
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