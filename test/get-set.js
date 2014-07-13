/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble config', function () {
  beforeEach(function() {
    assemble.clearCache();
  });

  describe('.set()', function () {
    it("should set properties on the `cache` object.", function () {
      assemble.set('a', 'b');
      assemble.get('a').should.equal('b');
    });

    it("should set nested properties on the `cache` object.", function () {
      assemble.set('c', {d: 'e'});
      assemble.get('c').d.should.equal('e');
    });

    it("should use dot notation to `get` values.", function () {
      assemble.set('h.i', 'j');
      assemble.get('h.i').should.equal('j');
    });

    it('should set a value', function () {
      assemble.set('a', 'b').should.equal(assemble);
    });

    it('should return the assemble when undefined', function () {
      assemble.set('a', undefined).should.equal(assemble);
    });
  });

  describe('.get()', function () {
    it('should return undefined when unset', function () {
      assert(assemble.get('a') === undefined);
    });

    it('should otherwise return the value', function () {
      assemble.set('a', 'b');
      assemble.get('a').should.equal('b');
    });
  });


  describe('.exists()', function () {
    it('should return `false` when unset', function () {
      assert(assemble.exists('alsjls') === false);
    });

    it('should return `true` when set.', function () {
      assemble.set('baba', 'zz');
      assemble.exists('baba').should.be.true;
    });
  });

  describe('.enable()', function () {
    it('should set the value to true', function () {
      assemble.enable('foo').should.equal(assemble);
      assemble.get('foo').should.be.true;
    });
  });

  describe('.disable()', function () {
    it('should set the value to false', function () {
      assemble.disable('foo').should.equal(assemble);
      assemble.get('foo').should.be.false;
    });
  });

  describe('.enabled()', function () {
    it('should default to false', function () {
      assemble.enabled('xyz').should.be.false;
    });

    it('should return true when set', function () {
      assemble.set('a', 'b');
      assemble.enabled('a').should.be.true;
    });
  });

  describe('.disabled()', function () {
    it('should default to true', function () {
      assemble.disabled('xyz').should.be.true;
    });

    it('should return false when set', function () {
      assemble.set('abc', 'xyz');
      assemble.disabled('abc').should.be.false;
    });
  });
});