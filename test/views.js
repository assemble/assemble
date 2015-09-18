require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var isBuffer = require('is-buffer');
var List = require('..').List;
var View = require('..').View;
var Views = require('..').Views;
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

      collection.addView('one', {content: '...'});
      assert(typeof collection.views.one === 'object');
      assert(isBuffer(collection.views.one.contents));
    });

    it('should create an instance of `View`:', function () {
      collection.addView('one', {content: '...'});
      assert(collection.views.one instanceof collection.View);
    });

    it('should allow an `View` constructor to be passed:', function () {
      View.prototype.foo = function(key, value) {
        this[key] = value;
      };
      collection = new Views({View: View});
      collection.addView('one', {content: '...'});
      collection.views.one.foo('bar', 'baz');
      assert(collection.views.one.bar === 'baz');
    });

    it('should allow an instance of `View` to be passed:', function () {
      var collection = new Views({View: View});
      var view = new View({content: '...'});
      collection.addView('one', view);
      view.set('abc', 'xyz');
      assert(collection.views.one instanceof collection.View);
      assert(isBuffer(collection.views.one.contents));
      assert(collection.views.one.abc === 'xyz');
    });
  });

  describe('addViews', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should add multiple views:', function () {
      collection.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should create views from an instance of Views', function () {
      collection.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      var pages = new Views(collection);
      assert(isBuffer(pages.views.one.contents));
      assert(isBuffer(pages.views.two.contents));
    });

    it('should add an array of views:', function () {
      collection.addViews([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });
  });

  describe('view', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should return a single collection view from a key-value pair', function () {
      var one = collection.view('one', {content: 'foo'});
      var two = collection.view('two', {content: 'bar'});

      assert(one instanceof View);
      assert(one.path === 'one');
      assert(two instanceof View);
      assert(two.path === 'two');
    });

    it('should return a single collection view from an object', function () {
      var one = collection.view({path: 'one', content: 'foo'});
      var two = collection.view({path: 'two', content: 'bar'});

      assert(one instanceof View);
      assert(one.path === 'one');
      assert(two instanceof View);
      assert(two.path === 'two');
    });
  });

  describe('addList', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should add a list of views:', function () {
      collection.addList([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should add a list of views from the constructor:', function () {
      var list = new List([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);

      collection = new Views(list);
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.views.two.contents));
    });

    it('should throw an error when list is not an array:', function () {
      var views = new Views();
      (function () {
        views.addList();
      }).should.throw('expected list to be an array.');

      (function () {
        views.addList({});
      }).should.throw('expected list to be an array.');

      (function () {
        views.addList('foo');
      }).should.throw('expected list to be an array.');
    });

    it('should load an array of items from an event:', function () {
      var collection = new Views();

      collection.on('addList', function (list) {
        while (list.length) {
          collection.addView({path: list.pop()});
        }
      });

      collection.addList(['a.txt', 'b.txt', 'c.txt']);
      assert(collection.views.hasOwnProperty('a.txt'));
      assert(collection.views['a.txt'].path === 'a.txt');
    });

    it('should load an object of views from an event:', function () {
      var collection = new Views();

      collection.on('addViews', function (views) {
        for (var key in views) {
          collection.addView('foo/' + key, views[key]);
          delete views[key];
        }
      });

      collection.addViews({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert(collection.views.hasOwnProperty('foo/a'));
      assert(collection.views['foo/a'].path === 'a.txt');
    });

    it('should signal `loaded` when finished:', function () {
      var collection = new Views();

      collection.on('addViews', function (views) {
        for (var key in views) {
          if (key === 'c') break;
          collection.addView('foo/' + key, views[key]);
        }
      });

      collection.addViews({
        a: {path: 'a.txt'},
        b: {path: 'b.txt'},
        c: {path: 'c.txt'}
      });

      assert(collection.views.hasOwnProperty('foo/a'));
      assert(!collection.views.hasOwnProperty('foo/c'));
      assert(collection.views['foo/a'].path === 'a.txt');
    });
  });

  describe('getView', function() {
    beforeEach(function() {
      collection = new Views();
    });
    it('should get a view from `views`:', function () {
      collection.addView('one', {content: 'aaa'});
      collection.addView('two', {content: 'zzz'});
      assert(isBuffer(collection.views.one.contents));
      assert(isBuffer(collection.getView('one').contents));
      assert(collection.getView('one').contents.toString() === 'aaa');
      assert(collection.getView('two').contents.toString() === 'zzz');
    });
  });

  describe('count', function() {
    beforeEach(function() {
      collection = new Views();
    });

    it('should get the number of views:', function () {
      collection.addView('one', {content: 'aaa'});
      collection.addView('two', {content: 'zzz'});
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
      collection.addView('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.views['d.hbs'].contents.toString() === 'foo bar baz');
    });

    it('should get a view with the renamed key:', function () {
      collection.addView('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.getView('d.hbs').contents.toString() === 'foo bar baz');
    });

    it('should get a view with the original key:', function () {
      collection.addView('a/b/c/d.hbs', {content: 'foo bar baz'});
      assert(collection.getView('a/b/c/d.hbs').contents.toString() === 'foo bar baz');
    });
  });
});

