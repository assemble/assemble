/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble cache', function () {
  it('when an object is passed to set:', function () {
    assemble.set({one: 1, two: 2});
    assemble.get('one').should.eql(1);
    assemble.get('two').should.eql(2);
  });

  describe('set() - add:', function () {
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
    it('should get the given property', function () {
      assemble.get('one').should.eql(2);
    });

    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    assemble.merge(obj);

    it('should get immediate properties.', function() {
      assemble.get('a').should.eql(obj.a);
    });
    it('should get nested properties.', function() {
      assemble.get('a.b').should.eql(obj.a.b);
    });
    it('should return undefined for nonexistent properties.', function() {
      (typeof assemble.get('a.x')).should.be.undefined;
    });
    it('should return values.', function() {
      assemble.get('a.b.c').should.eql(1);
    });
    it('should return values.', function() {
      assemble.get('a.b.d').should.eql('');
    });
    it('should return values.', function() {
      (typeof assemble.get('a.b.e')).should.be.an.object;
      // assemble.get('a.b.e').should.equal.null;
    });
    it('should return values.', function() {
      (typeof assemble.get('a.b.f')).should.be.undefined;
    });
    xit('literal backslash should escape period in property name.', function() {
      assemble.get('a.b.g\\.h\\.i').should.eql(2);
    });
    it('should just return existing properties.', function() {
      assemble.get('a', true).should.eql(assemble.cache.a);
    });
    it('should create immediate properties.', function() {
      assemble.get('b', true).should.eql(assemble.cache.b);
    });
    xit('should create nested properties.', function() {
      assemble.get('c.d.e', true).should.eql(assemble.cache.c.d.e);
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
      assemble.get('a').should.eql(1)
    });
    it('should set property value.', function() {
      assemble.cache.a.should.eql(1);
    });
    it('should return nested property value.', function() {
      assemble.set('b.c.d', 1);
      assemble.get('b.c.d').should.eql(1);
    });
    it('should set property value.', function() {
      assemble.cache.b.c.d.should.eql(1);
    });
    xit('literal backslash should escape period in property name.', function() {
      assemble.set('e\\.f\\.g', 1);
      assemble.get('e\\.f\\.g').should.eql(1);
      assemble.cache['e.f.g'].should.eql(1);
    });
  });

  describe('exists():', function () {
    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    assemble.merge(obj);

    it('immediate property should exist.', function() {
      assemble.exists('a').should.be.ok;
    });
    it('nested property should exist.', function() {
      assemble.exists('a.b').should.be.ok;
    });
    it('nested property should exist.', function() {
      assemble.exists('a.b.c').should.be.ok;
    });
    xit('nested property should exist.', function() {
      assemble.exists('a.b.d').should.be.ok;
    });
    xit('nested property should exist.', function() {
      assemble.exists('a.b.e').should.be.ok;
    });
    xit('nested property should exist.', function() {
      assemble.exists('a.b.f').should.be.ok;
    });
    it('literal backslash should escape period in property name.', function() {
      assemble.exists('a.b.g\\.h\\.i').should.be.ok;
    });
    it('nonexistent property should not exist.', function() {
      assemble.exists('x').should.eql(false);
    });
    it('nonexistent property should not exist.', function() {
      assemble.exists('a.x').should.eql(false);
    });
    it('nonexistent property should not exist.', function() {
      assemble.exists('a.b.x').should.eql(false);
    });
  });

  describe('events:', function () {
    describe('when assembleuration settings are customized', function () {
      it('should have the custom settings', function () {
        assemble.wildcard.should.be.true;
        assemble.listenerTree.should.be.an.object;
      });
    });

    describe('when a listener is removed', function () {
      it('should remove listener', function () {
        var called = false;
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

        assemble.on('set', function (key, value) {
          called = true;
          assemble.exists(key).should.be.true;
        });

        assemble.set('one', 'a');
        assemble.set('two', 'c');
        assemble.set('one', 'b');
        assemble.set('two', 'd');

        called.should.be.true;
      });

      it('should emit `set`', function () {
        var called = false;

        assemble.on('set', function (key, value) {
          called = true;
          value.should.eql('baz');
        });

        assemble.set('foo', 'baz');
        called.should.be.true;
      });

      xit('should emit `enabled` when a value is enabled', function () {
        var called = false;

        assemble.once('enable', function (key, value) {
          called = true;
          assemble.enable('hidden');
        });

        assemble.enable('option');
        assemble.enabled('hidden').should.be.true;
        called.should.be.true;
      });

      xit('should emit `disable` when items on the cache are disabled.', function () {
        var called = false;

        assemble.enable('foo');
        assemble.enabled('foo').should.be.true;

        assemble.once('disable', function (key, value) {
          called = true;
        });

        assemble.disable('foo');
        called.should.be.true;

        assemble.enabled('foo').should.be.false;
      });

      it('should emit `clear` when an item is removed from the cache', function () {
        var called = false;
        assemble.set('one', 'a');
        assemble.set('two', 'c');

        assemble.on('clear', function (key, value) {
          called = true;
          assemble.get(key).should.be.undefined;
        });

        assemble.clear('one');
        assemble.clear('two');

        called.should.be.true;
      });

      it('should emit `omit` when items are omitted from the cache', function () {
        var called = false;
        assemble.set('one', 'a');
        assemble.set('two', 'c');
        assemble.set('thr', 'd');
        assemble.set('fou', 'e');
        assemble.set('fiv', 'f');
        assemble.set('six', 'g');
        assemble.set('sev', 'h');

        assemble.on('omit', function (key) {
          assemble.get(key).should.be.undefined;
          called = true;
        });

        assemble.omit(['one', 'two', 'thr', 'fou', 'fiv', 'six', 'sev']);

        called.should.be.true;
      });


      it('should emit `merged` when items are merged into the cache', function () {
        var called = false;

        assemble.on('merge', function (key) {
          assemble.get(key).should.be.undefined;
          called = true;
        });

        assemble.merge({ one: 'a' });
        assemble.merge({ two: 'c' });
        assemble.merge({ thr: 'd' });
        assemble.merge({ fou: 'e' });
        assemble.merge({ fiv: 'f' });
        assemble.merge({ six: 'g' });
        assemble.merge({ sev: 'h' });

        called.should.be.true;
      });
    });
  });
});
