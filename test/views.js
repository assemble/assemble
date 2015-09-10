require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var Views = require('../').Views;
var collection;

describe('views', function () {
  describe('constructor', function () {
    it('should create an instance of Views:', function () {
      var collection = new Views();
      assert(collection instanceof Views);
    });
  });

  describe('static methods', function () {
    it('should expose `extend`:', function () {
      assert(typeof Views.extend ==='function');
    });
  });

  describe('prototype methods', function () {
    beforeEach(function() {
      collection = new Views();
    });

    it('should expose `set`', function () {
      assert(typeof collection.set ==='function');
    });
    it('should expose `get`', function () {
      assert(typeof collection.get ==='function');
    });
    it('should expose `visit`', function () {
      assert(typeof collection.visit ==='function');
    });
    it('should expose `define`', function () {
      assert(typeof collection.define ==='function');
    });
    it('should expose `addView`', function () {
      assert(typeof collection.addView ==='function');
    });
  });

  describe('instance', function () {
    beforeEach(function() {
      collection = new Views();
    });

    it('should throw an error if attempting to set count:', function () {
      (function () {
        collection.count = 5;
      }).should.throw('count is a read-only getter and cannot be defined.');
    });

    it('should set a value on the instance:', function () {
      collection.set('a', 'b');
      assert(collection.a ==='b');
    });

    it('should get a value from the instance:', function () {
      collection.set('a', 'b');
      assert(collection.get('a') ==='b');
    });
  });

  describe('option', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should set a key/value pair on options:', function () {
      collection.option('a', 'b');
      assert(collection.options.a === 'b');
    });

    it('should set an object on options:', function () {
      collection.option({c: 'd'});
      assert(collection.options.c === 'd');
    });

    it('should get an option:', function () {
      collection.option({c: 'd'});
      var c = collection.option('c');
      assert(c === 'd');
    });
  });

  describe('addView', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should throw an error when args are invalid:', function () {
      (function () {
        collection.addView(function() {});
      }).should.throw('expected value to be an object.');
    });

    it('should add a view to `views`:', function () {
      collection.addView('foo');
      collection.views.should.have.property('foo');

      collection.addView('one', {contents: new Buffer('...')});
      assert(typeof collection.views.one === 'object');
      assert(Buffer.isBuffer(collection.views.one.contents));
    });

    it('should create an instance of `View`:', function () {
      collection.addView('one', {contents: new Buffer('...')});
      assert(collection.views.one instanceof collection.View);
    });

    it('should allow an `View` constructor to be passed:', function () {
      var View = require('../').View;
      View.prototype.foo = function(key, value) {
        this[key] = value;
      };
      collection = new Views({View: View});
      collection.addView('one', {contents: new Buffer('...')});
      collection.views.one.foo('bar', 'baz');
      assert(collection.views.one.bar === 'baz');
    });

    it('should allow an instance of `View` to be passed:', function () {
      var View = require('../').View;
      var collection = new Views({View: View});
      var view = new View({contents: new Buffer('...')});
      collection.addView('one', view);
      view.set('abc', 'xyz');
      assert(collection.views.one instanceof collection.View);
      assert(Buffer.isBuffer(collection.views.one.contents));
      assert(collection.views.one.abc === 'xyz');
    });
  });

  describe('addViews', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should add multiple views:', function () {
      collection.addViews({
        one: {contents: new Buffer('foo')},
        two: {contents: new Buffer('bar')}
      });
      assert(Buffer.isBuffer(collection.views.one.contents));
      assert(Buffer.isBuffer(collection.views.two.contents));
    });
  });

  describe('getView', function() {
    beforeEach(function() {
      collection = new Views();
    });
    it('should get a view from `views`:', function () {
      collection.addView('one', {contents: new Buffer('aaa')});
      collection.addView('two', {contents: new Buffer('zzz')});
      assert(Buffer.isBuffer(collection.views.one.contents));
      assert(Buffer.isBuffer(collection.getView('one').contents));
      assert(collection.getView('one').contents.toString() === 'aaa');
      assert(collection.getView('two').contents.toString() === 'zzz');
    });
  });

  describe('count', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should get the number of views:', function () {
      collection.addView('one', {contents: new Buffer('aaa')});
      collection.addView('two', {contents: new Buffer('zzz')});
      assert(collection.count === 2);
    });
  });
});

describe('options', function() {
  describe('options.renameKey', function() {
    beforeEach(function() {
      collection = new Views({
        renameKey: function (key) {
          return path.basename(key);
        }
      });
    });

    it('should use a custom rename key function on view keys', function() {
      collection.addView('a/b/c/d.hbs', {contents: new Buffer('foo bar baz')});
      assert(collection.views['d.hbs'].contents.toString() === 'foo bar baz');
    });

    it('should get a view with the renamed key:', function () {
      collection.addView('a/b/c/d.hbs', {contents: new Buffer('foo bar baz')});
      assert(collection.getView('d.hbs').contents.toString() === 'foo bar baz');
    });

    it('should get a view with the original key:', function () {
      collection.addView('a/b/c/d.hbs', {contents: new Buffer('foo bar baz')});
      assert(collection.getView('a/b/c/d.hbs').contents.toString() === 'foo bar baz');
    });
  });
});

