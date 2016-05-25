'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var store = require('base-store');
var support = require('./support');
var assemble = support.resolve();
var app;

describe('store', function() {
  describe('methods', function() {
    beforeEach(function() {
      app = assemble({cli: true});
      app.use(store());
      app.store.create('app-data-tests');
    });

    afterEach(function() {
      app.store.data = {};
      app.store.del({force: true});
      app.options.cli = false;
    });

    it('should `.set()` a value on the store', function() {
      app.store.set('one', 'two');
      app.store.data.one.should.equal('two');
    });

    it('should `.set()` an object', function() {
      app.store.set({four: 'five', six: 'seven'});
      app.store.data.four.should.equal('five');
      app.store.data.six.should.equal('seven');
    });

    it('should `.set()` a nested value', function() {
      app.store.set('a.b.c.d', {e: 'f'});
      app.store.data.a.b.c.d.e.should.equal('f');
    });

    it('should `.union()` a value on the store', function() {
      app.store.union('one', 'two');
      app.store.data.one.should.eql(['two']);
    });

    it('should not union duplicate values', function() {
      app.store.union('one', 'two');
      app.store.data.one.should.eql(['two']);

      app.store.union('one', ['two']);
      app.store.data.one.should.eql(['two']);
    });

    it('should concat an existing array:', function() {
      app.store.union('one', 'a');
      app.store.data.one.should.eql(['a']);

      app.store.union('one', ['b']);
      app.store.data.one.should.eql(['a', 'b']);

      app.store.union('one', ['c', 'd']);
      app.store.data.one.should.eql(['a', 'b', 'c', 'd']);
    });

    it('should return true if a key `.has()` on the store', function() {
      app.store.set('foo', 'bar');
      app.store.set('baz', null);
      app.store.set('qux', undefined);

      assert(app.store.has('foo'));
      assert(app.store.has('baz'));
      assert(!app.store.has('bar'));
      assert(!app.store.has('qux'));
    });

    it('should return true if a nested key `.has()` on the store', function() {
      app.store.set('a.b.c.d', {x: 'zzz'});
      app.store.set('a.b.c.e', {f: null});
      app.store.set('a.b.g.j', {k: undefined});

      assert(!app.store.has('a.b.bar'));
      assert(app.store.has('a.b.c.d'));
      assert(app.store.has('a.b.c.d.x'));
      assert(!app.store.has('a.b.c.d.z'));
      assert(app.store.has('a.b.c.e'));
      assert(app.store.has('a.b.c.e.f'));
      assert(!app.store.has('a.b.c.e.z'));
      assert(app.store.has('a.b.g.j'));
      assert(!app.store.has('a.b.g.j.k'));
      assert(!app.store.has('a.b.g.j.z'));
    });

     it('should return true if a key exists `.hasOwn()` on the store', function() {
      app.store.set('foo', 'bar');
      app.store.set('baz', null);
      app.store.set('qux', undefined);

      assert(app.store.hasOwn('foo'));
      assert(!app.store.hasOwn('bar'));
      assert(app.store.hasOwn('baz'));
      assert(app.store.hasOwn('qux'));
    });

    it('should return true if a nested key exists `.hasOwn()` on the store', function() {
      app.store.set('a.b.c.d', {x: 'zzz'});
      app.store.set('a.b.c.e', {f: null});
      app.store.set('a.b.g.j', {k: undefined});

      assert(!app.store.hasOwn('a.b.bar'));
      assert(app.store.hasOwn('a.b.c.d'));
      assert(app.store.hasOwn('a.b.c.d.x'));
      assert(!app.store.hasOwn('a.b.c.d.z'));
      assert(app.store.has('a.b.c.e.f'));
      assert(app.store.hasOwn('a.b.c.e.f'));
      assert(!app.store.hasOwn('a.b.c.e.bar'));
      assert(!app.store.has('a.b.g.j.k'));
      assert(app.store.hasOwn('a.b.g.j.k'));
      assert(!app.store.hasOwn('a.b.g.j.foo'));
    });

    it('should `.get()` a stored value', function() {
      app.store.set('three', 'four');
      app.store.get('three').should.equal('four');
    });

    it('should `.get()` a nested value', function() {
      app.store.set({a: {b: {c: 'd'}}});
      app.store.get('a.b.c').should.equal('d');
    });

    it('should `.del()` a stored value', function() {
      app.store.set('a', 'b');
      app.store.set('c', 'd');
      app.store.data.should.have.property('a');
      app.store.data.should.have.property('c');

      app.store.del('a');
      app.store.del('c');
      app.store.data.should.not.have.property('a');
      app.store.data.should.not.have.property('c');
    });

    it('should `.del()` multiple stored values', function() {
      app.store.set('a', 'b');
      app.store.set('c', 'd');
      app.store.set('e', 'f');
      app.store.del(['a', 'c', 'e']);
      app.store.data.should.eql({});
    });
  });
});

describe('create', function() {
  beforeEach(function() {
    app = assemble({cli: true});
    app.use(store());
    app.store.create('abc');

    // init the actual store json file
    app.store.set('a', 'b');
  });

  afterEach(function() {
    app.store.data = {};
    app.store.del({force: true});
    app.options.cli = false;
  });

  it('should expose a `create` method', function() {
    assert.equal(typeof app.store.create, 'function');
  });

  it('should create a "sub-store" with the given name', function() {
    var store = app.store.create('created');
    assert.equal(store.name, 'created');
  });

  it('should create a "sub-store" with the project name when no name is passed', function() {
    var store = app.store.create('app-store');
    assert.equal(store.name, 'app-store');
  });

  it('should throw an error when a conflicting store name is used', function(cb) {
    try {
      app.store.create('create');
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'Cannot create store: "create", since "create" is a reserved property key. Please choose a different store name.');
      cb();
    }
  });

  it('should add a store object to store[name]', function() {
    app.store.create('foo');
    assert.equal(typeof app.store.foo, 'object');
    assert.equal(typeof app.store.foo.set, 'function');
    app.store.foo.del({force: true});
  });

  it('should save the store in a namespaced directory under the parent', function() {
    app.store.create('foo');
    var dir = path.dirname(app.store.path);

    assert.equal(app.store.foo.path, path.join(dir, 'assemble/foo.json'));
    app.store.foo.set('a', 'b');
    app.store.foo.del({force: true});
  });

  it('should set values on the custom store', function() {
    app.store.create('foo');
    app.store.foo.set('a', 'b');
    assert.equal(app.store.foo.data.a, 'b');
    app.store.foo.del({force: true});
  });

  it('should get values from the custom store', function() {
    app.store.create('foo');
    app.store.foo.set('a', 'b');
    assert.equal(app.store.foo.get('a'), 'b');
    app.store.foo.del({force: true});
  });
});

describe('events', function() {
  beforeEach(function() {
    app = assemble({cli: true});
    app.use(store());
    app.store.create('abc');
  });

  afterEach(function() {
    app.store.data = {};
    app.store.del({force: true});
    app.options.cli = false;
  });

  it('should emit `set` when an object is set:', function() {
    var keys = [];
    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set({a: {b: {c: 'd'}}});
    keys.should.eql(['a']);
  });

  it('should emit `set` when a key/value pair is set:', function() {
    var keys = [];

    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set('a', 'b');
    keys.should.eql(['a']);
  });

  it('should emit `set` when an object value is set:', function() {
    var keys = [];

    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set('a', {b: 'c'});
    keys.should.eql(['a']);
  });

  it('should emit `set` when an array of objects is passed:', function(cb) {
    var keys = [];

    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set([{a: 'b'}, {c: 'd'}]);
    keys.should.eql(['a', 'c']);
    cb();
  });

  it('should emit `has`:', function(cb) {
    var keys = [];

    app.store.on('has', function(val) {
      assert(val);
      cb();
    });

    app.store.set('a', 'b');
    app.store.has('a');
  });

  it('should emit `del` when a value is delted:', function(cb) {
    app.store.on('del', function(keys) {
      keys.should.eql('a');
      assert.equal(typeof app.store.get('a'), 'undefined');
      cb();
    });

    app.store.set('a', {b: 'c'});
    app.store.get('a').should.eql({b: 'c'});
    app.store.del('a');
  });

  it('should emit deleted keys on `del`:', function(cb) {
    var arr = [];

    app.store.on('del', function(key) {
      arr.push(key);
      assert.equal(Object.keys(app.store.data).length, 0);
    });

    app.store.set('a', 'b');
    app.store.set('c', 'd');
    app.store.set('e', 'f');

    app.store.del({force: true});
    arr.should.eql(['a', 'c', 'e']);
    cb();
  });

  it('should throw an error if force is not passed', function() {
    app.store.set('a', 'b');
    app.store.set('c', 'd');
    app.store.set('e', 'f');

    (function() {
      app.store.del();
    }).should.throw('options.force is required to delete the entire cache.');
  });
});
