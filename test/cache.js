/*!
 * normalize-config <https://github.com/jonschlinkert/normalize-config>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var Cache = require('config-cache');

describe('Cache', function () {
  var config = new Cache();

  describe('constructor:', function () {
    it('when new Cache() is defined:', function () {
      var config = new Cache({
        one: 1,
        two: 2
      });
      config.get('one').should.eql(1);
      config.get('two').should.eql(2);
    });
  });

  describe('set() - add:', function () {
    it('should set a new property with the given value', function () {
      config.set('one', 1);
      config.get('one').should.eql(1);
    });
  });

  describe('set() - update:', function () {
    it('should update an existing property with the given value', function () {
      config.set('one', 2);
      config.get('one').should.eql(2);
    });
  });

  describe('get():', function () {
    it('should get the given property', function () {
      config.get('one').should.eql(2);
    });

    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    config.merge(obj);

    it('should get immediate properties.', function() {
      config.get('a').should.eql(obj.a);
    });
    it('should get nested properties.', function() {
      config.get('a.b').should.eql(obj.a.b);
    });
    it('should return undefined for nonexistent properties.', function() {
      (typeof config.get('a.x')).should.be.undefined;
    });
    it('should return values.', function() {
      config.get('a.b.c').should.eql(1);
    });
    it('should return values.', function() {
      config.get('a.b.d').should.eql('');
    });
    it('should return values.', function() {
      (typeof config.get('a.b.e')).should.be.an.object;
      // config.get('a.b.e').should.equal.null;
    });
    it('should return values.', function() {
      (typeof config.get('a.b.f')).should.be.undefined;
    });
    xit('literal backslash should escape period in property name.', function() {
      config.get('a.b.g\\.h\\.i').should.eql(2);
    });
    it('should just return existing properties.', function() {
      config.get('a', true).should.eql(config.cache.a);
    });
    it('should create immediate properties.', function() {
      config.get('b', true).should.eql(config.cache.b);
    });
    xit('should create nested properties.', function() {
      config.get('c.d.e', true).should.eql(config.cache.c.d.e);
    });
  });

  describe('all:', function () {
    it('should list the entire cache', function () {
      config.get().should.eql(config.cache);
    });
  });

  describe('set()/get():', function () {
    var config = new Cache();
    it('should return immediate property value.', function() {
      config.set('a', 1);
      config.get('a').should.eql(1)
    });
    it('should set property value.', function() {
      config.cache.a.should.eql(1);
    });
    it('should return nested property value.', function() {
      config.set('b.c.d', 1);
      config.get('b.c.d').should.eql(1);
    });
    it('should set property value.', function() {
      config.cache.b.c.d.should.eql(1);
    });
    xit('literal backslash should escape period in property name.', function() {
      config.set('e\\.f\\.g', 1);
      config.get('e\\.f\\.g').should.eql(1);
      config.cache['e.f.g'].should.eql(1);
    });
  });

  describe('exists():', function () {
    var config = new Cache();
    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};

    config.merge(obj);

    it('immediate property should exist.', function() {
      config.exists('a').should.be.ok;
    });
    it('nested property should exist.', function() {
      config.exists('a.b').should.be.ok;
    });
    it('nested property should exist.', function() {
      config.exists('a.b.c').should.be.ok;
    });
    xit('nested property should exist.', function() {
      config.exists('a.b.d').should.be.ok;
    });
    xit('nested property should exist.', function() {
      config.exists('a.b.e').should.be.ok;
    });
    xit('nested property should exist.', function() {
      config.exists('a.b.f').should.be.ok;
    });
    it('literal backslash should escape period in property name.', function() {
      config.exists('a.b.g\\.h\\.i').should.be.ok;
    });
    it('nonexistent property should not exist.', function() {
      config.exists('x').should.eql(false);
    });
    it('nonexistent property should not exist.', function() {
      config.exists('a.x').should.eql(false);
    });
    it('nonexistent property should not exist.', function() {
      config.exists('a.b.x').should.eql(false);
    });
  });

  describe('events:', function () {
    describe('when configuration settings are customized', function () {
      it('should have the custom settings', function () {
        var config = new Cache();
        config.wildcard.should.be.true;
        config.listenerTree.should.be.an.object;
      });
    });

    describe('when a listener is removed', function () {
      it('should remove listener', function () {
        var config = new Cache();
        var called = false;
        var type = 'foo', listeners;
        var fn = function () {};

        // add
        config.on(type, fn);
        listeners = config.listeners(type);
        listeners.length.should.equal(1);

        // remove
        config.removeListener(type, fn);
        listeners = config.listeners(type);
        listeners.length.should.equal(0);
      });
    });

    describe('when listeners are added', function () {
      it('should add the listeners', function () {
        var config = new Cache();
        var called = false;
        config.on('foo', function () {
          called = 'a';
        });
        config.emit('foo');
        called.should.equal('a');
        config.on('foo', function () {
          called = 'b';
        });
        config.emit('foo');
        called.should.equal('b');
        config.on('foo', function () {
          called = true;
        });
        config.emit('foo');
        called.should.equal(true);
        config.listeners('foo').length.should.equal(3);
      });

      it('should emit `set` when a value is set', function () {
        var called = false;
        var value = '';
        var config = new Cache();
        config.on('set', function (key, val) {
          called = key;
          value = val;
        });
        config.set('foo', 'bar');
        called.should.equal('foo');
        value.should.equal('bar');
      });

      it('should emit `set` when items are set on the config.', function () {
        var called = false;
        var config = new Cache();

        config.on('set', function (key, value) {
          called = true;
          config.exists(key).should.be.true;
        });

        config.set('one', 'a');
        config.set('two', 'c');
        config.set('one', 'b');
        config.set('two', 'd');

        called.should.be.true;
      });

      it('should emit `set`', function () {
        var called = false;
        var config = new Cache();

        config.on('set', function (key, value) {
          called = true;
          value.should.eql('baz');
        });

        config.set('foo', 'baz');
        called.should.be.true;
      });

      xit('should emit `enabled` when a value is enabled', function () {
        var config = new Cache();
        var called = false;

        config.once('enable', function (key, value) {
          called = true;
          config.enable('hidden');
        });

        config.enable('option');
        config.enabled('hidden').should.be.true;
        called.should.be.true;
      });

      xit('should emit `disable` when items on the cache are disabled.', function () {
        var called = false;
        var config = new Cache();

        config.enable('foo');
        config.enabled('foo').should.be.true;

        config.once('disable', function (key, value) {
          called = true;
        });

        config.disable('foo');
        called.should.be.true;

        config.enabled('foo').should.be.false;
      });

      it('should emit `clear` when an item is removed from the cache', function () {
        var called = false;
        var config = new Cache();
        config.set('one', 'a');
        config.set('two', 'c');

        config.on('clear', function (key, value) {
          called = true;
          config.get(key).should.be.undefined;
        });

        config.clear('one');
        config.clear('two');

        called.should.be.true;
      });

      it('should emit `omit` when items are omitted from the cache', function () {
        var called = false;
        var config = new Cache();
        config.set('one', 'a');
        config.set('two', 'c');
        config.set('thr', 'd');
        config.set('fou', 'e');
        config.set('fiv', 'f');
        config.set('six', 'g');
        config.set('sev', 'h');

        config.on('omit', function (key) {
          config.get(key).should.be.undefined;
          called = true;
        });

        config.omit(['one', 'two', 'thr', 'fou', 'fiv', 'six', 'sev']);

        called.should.be.true;
      });


      it('should emit `merged` when items are merged into the cache', function () {
        var called = false;
        var config = new Cache();

        config.on('merge', function (key) {
          config.get(key).should.be.undefined;
          called = true;
        });

        config.merge({ one: 'a' });
        config.merge({ two: 'c' });
        config.merge({ thr: 'd' });
        config.merge({ fou: 'e' });
        config.merge({ fiv: 'f' });
        config.merge({ six: 'g' });
        config.merge({ sev: 'h' });

        called.should.be.true;
      });
    });
  });
});
