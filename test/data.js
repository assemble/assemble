/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble data', function() {
  describe('.data()', function() {
    it("should set properties on the `data` object.", function() {
      assemble.set('data.foo', 'bar');
      assemble.get('data').foo.should.equal('bar');
      assemble.get('data.foo').should.equal('bar');
    });

    it("should read files and merge data onto `cache.data`", function() {
      assemble.data('package.json');
      var name = assemble.get('data.name');
      name.should.equal('assemble');
    });
  });

  describe('.extendData()', function() {
    it("should extend the `data` object.", function() {
      assemble.extendData({x: 'x', y: 'y', z: 'z'});
      assemble.get('data').should.have.property('x');
      assemble.get('data').should.have.property('y');
      assemble.get('data').should.have.property('z');
    });
  });


  describe('.root()', function() {
    it("should merge the value of a nested `data` property onto the root of the given object.", function() {
      var root = assemble.root({data: {x: 'x'}, y: 'y', z: 'z'});
      root.should.have.property('x');
      root.should.have.property('y');
      root.should.have.property('z');
      root.should.not.have.property('data');
    });
  });

  describe('.namespace()', function() {
    it("should namespace the data using the basename of the file.", function() {
      assemble.namespace('test/fixtures/data/alert.json');
      assemble.get('data').should.have.property('alert');
    });
    it("should namespace the data using the basename of the file.", function() {
      assemble.namespace('test/fixtures/data/data.json');
      assemble.get('data').should.have.property('root');
      assemble.get('data').should.not.have.property('data');
    });
  });

  describe('.plasma()', function() {
    it("should read JSON files and return an object.", function() {
      var pkg = assemble.plasma('package.json')
      pkg.name.should.equal('assemble');
    });

    it("should expand a glob pattern, read JSON/YAML files and return an object.", function() {
      var pkg = assemble.plasma('p*.json')
      pkg.name.should.equal('assemble');
    });

    it("should accept and object and return an object.", function() {
      var foo = assemble.plasma({a: 'b'})
      foo.a.should.equal('b');
    });
  });
});
