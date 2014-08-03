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

describe('assemble cache', function () {
  afterEach(function() {
    assemble.clear();
  });

  describe('.set()', function () {
    it('should set a value', function () {
      assemble.set('a', 'b');
      assemble.get('a').should.equal('b');
    });

    it('should set properties on the `cache` object.', function () {
      assemble.set('a', 'b');
      assemble.cache.a.should.equal('b');
    });

    it('should allow an object to be set directly.', function () {
      assemble.set({x: 'y'});
      assemble.cache.x.should.equal('y');
      assemble.get('x').should.equal('y');
    });

    it('should set nested properties on the `cache` object.', function () {
      assemble.set('c', {d: 'e'});
      assemble.get('c').d.should.equal('e');
    });

    it('should use dot notation to `set` values.', function () {
      assemble.set('h.i', 'j');
      assemble.get('h').should.eql({i: 'j'});
    });

    it('should use dot notation to `get` values.', function () {
      assemble.set('h', {i: 'j'});
      assemble.get('h.i').should.equal('j');
    });

    it('should return `this` for chaining', function () {
      assemble.set('a', 'b').should.equal(assemble);
      assemble
        .set('aa', 'bb')
        .set('bb', 'cc')
        .set('cc', 'dd');
      assemble.get('aa').should.equal('bb');
      assemble.get('bb').should.equal('cc');
      assemble.get('cc').should.equal('dd');
    });

    it('should expand template strings in the config.', function () {
      assemble
        .set('l', 'm')
        .set('j', {k: '${l}'}, true);
      assemble.cache.j.k.should.eql('m');
      assemble.get('j.k').should.eql('m');
    });

    it('should return undefined when not set', function () {
      assemble.set('a', undefined).should.equal(assemble);
    });
  });

  describe('.get()', function () {
    it('should return undefined when no set', function () {
      assert(assemble.get('a') === undefined);
    });

    it('should otherwise return the value', function () {
      assemble.set('a', 'b');
      assemble.get('a').should.equal('b');
    });
  });


  describe('.exists()', function () {
    it('should return `false` when not set', function () {
      assemble.exists('alsjls').should.be.false;
    });

    it('should return `true` when set.', function () {
      assemble.set('baba', 'zz');
      assemble.exists('baba').should.be.ok;
    });
  });

  describe('.enable()', function () {
    it('should set the value to true', function () {
      assemble.enable('foo').should.equal(assemble);
      assemble.get('foo').should.be.ok;
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
      assemble.enabled('a').should.be.ok;
    });
  });

  describe('.disabled()', function () {
    it('should default to true', function () {
      assemble.disabled('xyz').should.be.ok;
    });

    it('should return false when set', function () {
      assemble.set('abc', 'xyz');
      assemble.disabled('abc').should.be.false;
    });
  });
});