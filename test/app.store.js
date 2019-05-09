'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var store = require('base-store');
var App = require('..');
var app;

describe('store', function() {
  describe('methods', function() {
    beforeEach(function() {
      app = new App();
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
      assert.equal(app.store.data.one, 'two');
    });

    it('should `.set()` an object', function() {
      app.store.set({four: 'five', six: 'seven'});
      assert.equal(app.store.data.four, 'five');
      assert.equal(app.store.data.six, 'seven');
    });

    it('should `.set()` a nested value', function() {
      app.store.set('a.b.c.d', {e: 'f'});
      assert.equal(app.store.data.a.b.c.d.e, 'f');
    });

    it('should `.union()` a value on the store', function() {
      app.store.union('one', 'two');
      assert.deepEqual(app.store.data.one, ['two']);
    });

    it('should not union duplicate values', function() {
      app.store.union('one', 'two');
      assert.deepEqual(app.store.data.one, ['two']);

      app.store.union('one', ['two']);
      assert.deepEqual(app.store.data.one, ['two']);
    });

    it('should concat an existing array:', function() {
      app.store.union('one', 'a');
      assert.deepEqual(app.store.data.one, ['a']);

      app.store.union('one', ['b']);
      assert.deepEqual(app.store.data.one, ['a', 'b']);

      app.store.union('one', ['c', 'd']);
      assert.deepEqual(app.store.data.one, ['a', 'b', 'c', 'd']);
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
      assert.equal(app.store.get('three'), 'four');
    });

    it('should `.get()` a nested value', function() {
      app.store.set({a: {b: {c: 'd'}}});
      assert.equal(app.store.get('a.b.c'), 'd');
    });

    it('should `.del()` a stored value', function() {
      app.store.set('a', 'b');
      app.store.set('c', 'd');
      assert(app.store.data.hasOwnProperty('a'));
      assert(app.store.data.hasOwnProperty('c'));

      app.store.del('a');
      app.store.del('c');
      assert(!app.store.data.hasOwnProperty('a'));
      assert(!app.store.data.hasOwnProperty('c'));
    });

    it('should `.del()` multiple stored values', function() {
      app.store.set('a', 'b');
      app.store.set('c', 'd');
      app.store.set('e', 'f');
      app.store.del(['a', 'c', 'e']);
      assert.deepEqual(app.store.data, {});
    });
  });
});

describe('create', function() {
  beforeEach(function() {
    app = new App({cli: true});
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
    app = new App({cli: true});
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
    assert.deepEqual(keys, ['a']);
  });

  it('should emit `set` when a key/value pair is set:', function() {
    var keys = [];

    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set('a', 'b');
    assert.deepEqual(keys, ['a']);
  });

  it('should emit `set` when an object value is set:', function() {
    var keys = [];

    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set('a', {b: 'c'});
    assert.deepEqual(keys, ['a']);
  });

  it('should emit `set` when an array of objects is passed:', function(cb) {
    var keys = [];

    app.store.on('set', function(key) {
      keys.push(key);
    });

    app.store.set([{a: 'b'}, {c: 'd'}]);
    assert.deepEqual(keys, ['a', 'c']);
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
      assert.deepEqual(keys, 'a');
      assert.equal(typeof app.store.get('a'), 'undefined');
      cb();
    });

    app.store.set('a', {b: 'c'});
    assert.deepEqual(app.store.get('a'), {b: 'c'});
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
    assert.deepEqual(arr, ['a', 'c', 'e']);
    cb();
  });

  it('should throw an error if force is not passed', function(cb) {
    app.store.set('a', 'b');
    app.store.set('c', 'd');
    app.store.set('e', 'f');

    try {
      app.store.del();
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'options.force is required to delete the entire cache.');
      cb();
    }
  });
});
