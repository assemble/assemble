require('mocha');
require('should');
var path = require('path');
var get = require('get-value');
var List = require('../').List;
var Views = require('../').Views;
var View = require('../').View;
var assert = require('./support/');
var list, views;

describe('list', function () {
  describe('constructor', function () {
    it('should create an instance of List:', function () {
      var list = new List();
      assert(list instanceof List);
    });
  });

  describe('static methods', function () {
    it('should expose `extend`:', function () {
      assert(typeof List.extend ==='function');
    });
  });

  describe('prototype methods', function () {
    beforeEach(function() {
      list = new List();
    });

    it('should expose `set`', function () {
      assert(typeof list.set ==='function');
    });
    it('should expose `get`', function () {
      assert(typeof list.get ==='function');
    });
    it('should expose `visit`', function () {
      assert(typeof list.visit ==='function');
    });
    it('should expose `define`', function () {
      assert(typeof list.define ==='function');
    });
    it('should expose `addItem`', function () {
      assert(typeof list.addItem ==='function');
    });

    it('should expose `items`', function () {
      assert(Array.isArray(list.items));
    });
    it('should expose `keys`', function () {
      assert(Array.isArray(list.keys));
    });
  });

  describe('instance', function () {
    beforeEach(function() {
      list = new List();
    });

    it('should set a value on the instance:', function () {
      list.set('a', 'b');
      assert(list.a ==='b');
    });

    it('should get a value from the instance:', function () {
      list.set('a', 'b');
      assert(list.get('a') ==='b');
    });
  });

  describe('addItem', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should add an item to `items`:', function () {
      list.addItem('one', {content: '...'});
      assert(list.items.length === 1);
      assert(Buffer.isBuffer(list.items[0].contents));
    });

    it('should create an instance of `Item`:', function () {
      list.addItem('one', {content: '...'});
      assert(list.items[0] instanceof list.Item);
    });

    it('should allow an `Item` constructor to be passed:', function () {
      var Vinyl = require('vinyl');
      Vinyl.prototype.foo = function(key, value) {
        this[key] = value;
      };
      list = new List({Item: Vinyl});
      list.addItem('one', {content: '...'});
      list.items[0].foo('bar', 'baz');
      assert(list.items[0].bar === 'baz');
    });

    it('should allow an instance of `Item` to be passed:', function () {
      var list = new List({Item: View});
      var view = new View({content: '...'});
      list.addItem('one', view);
      view.set('abc', 'xyz');
      assert(list.items[0] instanceof list.Item);
      assert(Buffer.isBuffer(list.items[0].contents));
      assert(list.items[0].abc === 'xyz');
    });
  });

  describe('addItems', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should add an object with multiple items:', function () {
      list.addItems({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });
      assert(Buffer.isBuffer(list.items[0].contents));
      assert(Buffer.isBuffer(list.items[1].contents));
    });
  });

  describe('addItems', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should add an array with multiple items:', function () {
      list.addList([
        {path: 'one', content: 'foo'},
        {path: 'two', content: 'bar'}
      ]);
      assert(Buffer.isBuffer(list.items[0].contents));
      assert(Buffer.isBuffer(list.items[1].contents));
    });

    it('should take a sync callback on `addList`:', function () {
      function addContents(item) {
        item.contents = new Buffer(item.path.charAt(0));
      }

      list.addList([
        { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      ], addContents);

      assert(Buffer.isBuffer(list.items[0].contents));
      assert(Buffer.isBuffer(list.items[1].contents));
      assert(Buffer.isBuffer(list.items[2].contents));
    });
  });

  describe('sortBy', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
    ];

    it('should sort a list:', function () {
      list = new List();
      list.addList(items);

      var compare = function(prop) {
        return function (a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ]);

      assert.containEql(res.items, [
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } }
      ]);
    });

    it('should not sort the (original) instance list `items`:', function () {
      list = new List();
      list.addList(items);

      var compare = function(prop) {
        return function (a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ]);

      // should not be sorted
      assert.containEql(list.items, items);

      // should be sorted
      assert.containEql(res.items, [
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } }
      ]);
    });

    it('should pass options to array-sort from the constructor:', function () {
      list = new List({sort: {reverse: true}});
      list.addList(items);

      var compare = function(prop) {
        return function (a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ]);

      assert.containEql(res.items, [
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } }
      ]);
    });

    it('should pass options to array-sort from the sortBy method:', function () {
      list = new List();
      list.addList(items);

      var compare = function(prop) {
        return function (a, b, fn) {
          var valA = get(a, prop);
          var valB = get(b, prop);
          return fn(valA, valB);
        };
      };

      var res = list.sortBy('locals.date', 'doesnt.exist', [
        compare('locals.foo'),
        compare('locals.bar')
      ], {reverse: true});

      assert.containEql(res.items, [
        { key: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
        { key: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
        { key: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
        { key: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
        { key: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
        { key: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
        { key: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
        { key: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
        { key: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
        { key: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
        { key: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
        { key: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
        { key: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } }
      ]);
    });
  });

  describe('groupBy', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
    ];

    it('should group a list by a property:', function () {
      list = new List();
      list.addList(items);

      var res = list.groupBy('locals.foo');
      var keys = ['zzz', 'mmm', 'xxx', 'aaa', 'ccc', 'rrr', 'ttt', 'yyy'];
      assert.deepEqual(Object.keys(res), keys);
    });
  });

  describe('sort and group', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2013-02-01', foo: 'xxx', bar: 5 } },
      { path: 'i.md', locals: { date: '2013-02-01', foo: 'lll', bar: 5 } },
      { path: 'k.md', locals: { date: '2013-03-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2013-02-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'm.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'n.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 7 } },
      { path: 'o.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 7 } },
      { path: 'p.md', locals: { date: '2013-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
    ];

    it('should group a list by a property:', function () {
      list = new List(items);

      var context = list
        .sortBy('locals.date')
        .groupBy(function (view) {
          var date = view.locals.date;
          view.locals.year = date.slice(0, 4);
          view.locals.month = date.slice(5, 7);
          view.locals.day = date.slice(8, 10);
          return view.locals.year;
        }, 'locals.month');

      var keys = Object.keys(context);
      assert(keys[0] === '2012');
      assert(keys[1] === '2013');
      assert(keys[2] === '2014');
      assert(keys[3] === '2015');
    });
  });

  describe('paginate', function() {
    var items = [
      { path: 'a.md', locals: { date: '2014-01-01', foo: 'zzz', bar: 1 } },
      { path: 'f.md', locals: { date: '2014-01-01', foo: 'mmm', bar: 2 } },
      { path: 'd.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 3 } },
      { path: 'i.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 5 } },
      { path: 'k.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 1 } },
      { path: 'j.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 4 } },
      { path: 'h.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 6 } },
      { path: 'l.md', locals: { date: '2014-01-01', foo: 'xxx', bar: 7 } },
      { path: 'e.md', locals: { date: '2015-01-02', foo: 'aaa', bar: 8 } },
      { path: 'b.md', locals: { date: '2012-01-02', foo: 'ccc', bar: 9 } },
      { path: 'f.md', locals: { date: '2014-06-01', foo: 'rrr', bar: 10 } },
      { path: 'c.md', locals: { date: '2015-04-12', foo: 'ttt', bar: 11 } },
      { path: 'g.md', locals: { date: '2014-02-02', foo: 'yyy', bar: 12 } },
    ];

    it('should paginate a list:', function () {
      list = new List(items);

      var res = list.paginate();
      assert.equal(res.length, 2);
      assert.containEql(res[0].items, items.slice(0, 10));
      assert.containEql(res[1].items, items.slice(10));
    });

    it('should paginate a list with given options:', function () {
      list = new List(items);
      var res = list.paginate({limit: 5});

      assert.equal(res.length, 3);
      assert.containEql(res[0].items, items.slice(0, 5));
      assert.containEql(res[1].items, items.slice(5, 10));
      assert.containEql(res[2].items, items.slice(10));
    });
  });

  describe('Views instance', function() {
    beforeEach(function() {
      views = new Views();
    });

    it('should add views from an instance of Views:', function () {
      views.addViews({
        one: {content: 'foo'},
        two: {content: 'bar'}
      });

      list = new List(views);
      assert(Buffer.isBuffer(list.items[0].contents));
      assert(Buffer.isBuffer(list.items[1].contents));
    });
  });

  describe('getIndex', function() {
    beforeEach(function() {
      list = new List();
    });
    it('should get the index of a key when key is not renamed:', function () {
      list.addItem('a/b/c/ddd.hbs', {content: 'ddd'});
      list.addItem('a/b/c/eee.hbs', {content: 'eee'});
      assert(list.getIndex('a/b/c/ddd.hbs') === 0);
      assert(list.getIndex('a/b/c/eee.hbs') === 1);
    });

    it('should get the index of a key when key is renamed:', function () {
      list = new List({
        renameKey: function (key) {
          return path.basename(key);
        }
      });
      list.addItem('a/b/c/ddd.hbs', {content: 'ddd'});
      list.addItem('a/b/c/eee.hbs', {content: 'eee'});
      assert(list.getIndex('a/b/c/ddd.hbs') === 0);
      assert(list.getIndex('ddd.hbs') === 0);
      assert(list.getIndex('a/b/c/eee.hbs') === 1);
      assert(list.getIndex('eee.hbs') === 1);
    });
  });

  describe('getItem', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should get an view from `views`:', function () {
      list.addItem('one', {content: 'aaa'});
      list.addItem('two', {content: 'zzz'});
      assert(list.items.length === 2);
      assert(Buffer.isBuffer(list.items[0].contents));
      assert(Buffer.isBuffer(list.getItem('one').contents));
      assert(list.getItem('one').contents.toString() === 'aaa');
      assert(list.getItem('two').contents.toString() === 'zzz');
    });
  });

  describe('use', function() {
    beforeEach(function() {
      list = new List();
    });

    it('should use middleware on a list:', function () {
      list.addItem('one', {content: 'aaa'});
      list.addItem('two', {content: 'zzz'});

      list
        .use(function (list, options) {
          options.foo = 'bar';
        })
        .use(function () {
          this.set('one', 'two');
        });

      assert(list.one === 'two');
      assert(list.options.foo === 'bar');
    });
  });
});

