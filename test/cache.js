/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble cache', function () {
  describe('exists():', function () {
    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    assemble.extend(obj);

    it('immediate property should exist.', function() {
      assert.equal(assemble.exists('a'), true);
    });
    it('nested property should exist.', function() {
      assert.equal(assemble.exists('a.b'), true);
    });
    it('nested property should exist.', function() {
      assert.equal(assemble.exists('a.b.c'), true);
    });
    it('nested property should exist.', function() {
      assert.equal(assemble.exists('a.b.d'), true);
    });
    it('nested property should exist.', function() {
      assert.equal(assemble.exists('a.b.e'), true);
    });
    it('nested property should exist.', function() {
      assert.equal(assemble.exists('a.b.f'), true);
    });
    it('nonexistent property should not exist.', function() {
      assert.equal(assemble.exists('x'), false);
    });
    it('nonexistent property should not exist.', function() {
      assert.equal(assemble.exists('a.x'), false);
    });
    it('nonexistent property should not exist.', function() {
      assert.equal(assemble.exists('a.b.x'), false);
    });
  });

  describe('set() - add:', function () {
    it('when an object is passed to set:', function () {
      assemble.set({one: 1, two: 2});
      assemble.get('one').should.eql(1);
      assemble.get('two').should.eql(2);
    });

    it('should set a new property with the given value', function () {
      assemble.set('one', 1);
      assemble.get('one').should.eql(1);
    });
  });

  describe('set() - update:', function () {
    it('should update an existing property with the given value', function () {
      assemble.set('one', 2);
      assemble.get('one').should.eql(2);
    });
  });

  describe('get():', function () {
    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    assemble.set(obj);

    it('should get immediate properties.', function() {
      assemble.get('a').should.eql(obj.a);
    });
    it('should get nested properties.', function() {
      assemble.get('a.b').should.eql(obj.a.b);
    });
    it('should return undefined for nonexistent properties.', function() {
      assert.equal(typeof assemble.get('a.x'), 'undefined');
    });
    it('should return values.', function() {
      assemble.get('a.b.c').should.eql(1);
    });
    it('should return values.', function() {
      assemble.get('a.b.d').should.eql('');
    });
    it('should return values.', function() {
      assert.equal(typeof assemble.get('a.b.e'), 'object');
    });
    it('should return values.', function() {
      assert.equal(typeof assemble.get('a.b.f'), 'undefined');
    });
    it('literal backslash should escape period in property name.', function() {
      assemble.get('a.b.g\\.h\\.i', true).should.equal(2);
    });
    it('should just return existing properties.', function() {
      assemble.get('a', true).should.eql(assemble.cache.a);
    });
  });

  describe('all:', function () {
    it('should list the entire cache', function () {
      assemble.get().should.eql(assemble.cache);
    });
  });

  describe('set()/get():', function () {
    it('should return immediate property value.', function() {
      assemble.set('a', 1);
      assemble.get('a').should.equal(1);
    });
    it('should set property value.', function() {
      assemble.cache.a.should.equal(1);
    });
    it('should return nested property value.', function() {
      assemble.set('b.c.d', 1);
      assemble.get('b.c.d').should.equal(1);
    });
    it('should set property value.', function() {
      assemble.cache.b.c.d.should.equal(1);
    });
    it('literal backslash should escape period in property name.', function() {
      assemble.set('e\\.f\\.g', 1, true);
      assemble.get('e\\.f\\.g', true).should.equal(1);
      assemble.cache['e.f.g'].should.equal(1);
    });
  });
});

describe('cache events:', function () {
  describe('when a listener is removed', function () {
    it('should remove listener', function () {
      var type = 'foo', listeners;
      var fn = function () {};

      // add
      assemble.on(type, fn);
      listeners = assemble.listeners(type);
      listeners.length.should.equal(1);

      // remove
      assemble.removeListener(type, fn);
      listeners = assemble.listeners(type);
      listeners.length.should.equal(0);
    });
  });

  describe('when listeners are added', function () {
    it('should add the listeners', function () {
      var called = false;
      assemble.on('foo', function () {
        called = 'a';
      });
      assemble.emit('foo');
      called.should.equal('a');
      assemble.on('foo', function () {
        called = 'b';
      });
      assemble.emit('foo');
      called.should.equal('b');
      assemble.on('foo', function () {
        called = true;
      });
      assemble.emit('foo');
      called.should.equal(true);
      assemble.listeners('foo').length.should.equal(3);
    });

    it('should emit `set` when a value is set', function () {
      var called = false;
      var value = '';
      assemble.on('set', function (key, val) {
        called = key;
        value = val;
      });
      assemble.set('foo', 'bar');
      called.should.equal('foo');
      value.should.equal('bar');
    });

    it('should emit `set` when items are set on the assemble.', function () {
      var called = false;

      assemble.on('set', function (key) {
        called = true;
        assemble.has(key).should.be.true;
      });

      assemble.set('one', 'a');
      assemble.set('two', 'c');
      assemble.set('one', 'b');
      assemble.set('two', 'd');
      called.should.be.true;
    });
  });
});
