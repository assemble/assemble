/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble data', function() {
  var site = null;
  beforeEach(function () {
    site = assemble.init();
  });

  describe('.data()', function() {
    it('should set properties on the `data` object.', function() {
      site.set('data.foo', 'bar');
      site.get('data').foo.should.equal('bar');
      site.get('data.foo').should.equal('bar');
    });

    it('should read files and merge data onto `cache.data`', function() {
      site.data('package.json', { namespace: false });
      site.get('data.name').should.equal('assemble');
    });

    it('should read files and merge data onto `cache.data`', function() {
      site.data({xyz: 'abc'});
      site.get('data.xyz').should.equal('abc');
    });

    it('should read files and merge data onto `cache.data`', function() {
      site.data([{aaa: 'bbb', ccc: 'ddd'}]);
      site.get('data.aaa').should.equal('bbb');
      site.get('data.ccc').should.equal('ddd');
    });
  });

  describe('.extendData()', function() {
    it('should extend the `data` object.', function() {
      site.extendData({x: 'x', y: 'y', z: 'z'});
      site.get('data').should.have.property('x');
      site.get('data').should.have.property('y');
      site.get('data').should.have.property('z');
    });
  });

  describe('.flattenData()', function() {
    it('should merge the value of a nested `data` property onto the root of the given object.', function() {
      var root = site.flattenData({data: {x: 'x'}, y: 'y', z: 'z'});
      root.should.have.property('x');
      root.should.have.property('y');
      root.should.have.property('z');
      root.should.not.have.property('data');
    });
  });

  describe('.plasma()', function() {
    it('should read JSON files and return an object.', function() {
      var pkg = site.plasma('package.json', { namespace: false });
      pkg.name.should.equal('assemble');
    });

    it('should expand a glob pattern, read JSON/YAML files and return an object.', function() {
      var pkg = site.plasma('p*.json', { namespace: false });
      pkg.name.should.equal('assemble');
    });

    it('should accept and object and return an object.', function() {
      var foo = site.plasma({a: 'b'});
      foo.a.should.equal('b');
    });
  });
});
