/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Files = require('../lib/view/file');

describe('Files', function () {

  var files = null;
  beforeEach(function () { 
    files = new Files();
  });

  describe('.set()', function () {
    it('should set a value', function () {
      files.set('a', 'b');
      files.get('a').should.equal('b');
    });

    it('should set properties on the `cache` object.', function () {
      files.set('a', 'b');
      files.cache.a.should.equal('b');
    });

    it('should set nested properties on the `cache` object.', function () {
      files.set('c', {d: 'e'});
      files.get('c').d.should.equal('e');
    });

    it('should return `this` for chaining', function () {
      files.set('a', 'b').should.equal(files);
      files
        .set('aa', 'bb')
        .set('bb', 'cc')
        .set('cc', 'dd');
      files.get('aa').should.equal('bb');
      files.get('bb').should.equal('cc');
      files.get('cc').should.equal('dd');
    });

    it('should return undefined when not set', function () {
      files.set('a', undefined).should.equal(files);
    });
  });

  describe('.get()', function () {
    it('should return undefined when not set', function () {
      assert(files.get('a') === undefined);
    });

    it('should otherwise return the value', function () {
      files.set('a', 'b');
      files.get('a').should.equal('b');
    });
  });

  describe('.forEach()', function () {
    it('should execute a function for each item', function () {
      files = new Files({
        'one': 1,
        'two': 2,
        'three': 3
      });
      function pow (exp) {
        return function (item, key) {
          files.set(key, Math.pow(item, exp));
        };
      }
      files.forEach(pow(2));
      files.get('one').should.equal(1);
      files.get('two').should.equal(4);
      files.get('three').should.equal(9);
    });

    it('should execute a function for each item with the context', function () {
      files = new Files({
        'one': 1,
        'two': 2,
        'three': 3
      });
      var context = {
        pow: function (item, exp) {
          return Math.pow(item, exp);
        }
      };

      files.forEach(function (item, key) {
        files.set(key, this.pow(item, 2));
      }, context);

      files.get('one').should.equal(1);
      files.get('two').should.equal(4);
      files.get('three').should.equal(9);
    });
  });

  describe('.toArray()', function () {
    it('should return the values as an array', function () {
      files = new Files({
        'foo': 'bar',
        'baz': 'bang',
        'boop': 'beep'
      });
      files.toArray().should.eql(['bar', 'bang', 'beep']);
    });
  });

  describe('.length', function () {
    it('should return the number of items in the cache', function () {
      files = new Files({
        'foo': 'bar',
        'baz': 'bang',
        'boop': 'beep'
      });
      files.length.should.eql(3);
    });
  });

});