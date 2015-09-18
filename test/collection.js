require('mocha');
require('should');
var assert = require('assert');
var App = require('..');
var Views = App.Views;
var collection;

describe('collection', function () {
  describe('method', function () {
    beforeEach(function () {
      collection = new Views();
    });

    it('should expose the collection method', function () {
      assert(typeof Views === 'function');
    });

    it('should return a new collection', function () {
      var collection = new Views();
      assert(typeof collection === 'object');
    });

    it('should have isCollection property', function () {
      var collection = new Views();
      assert(collection.isCollection === true);
    });
  });

  describe('adding views', function () {
    beforeEach(function () {
      collection = new Views();
    });

    it('should load a view onto the respective collection:', function () {
      collection.addView('a.hbs');
      collection.views.should.have.property('a.hbs');
    });

    it('should allow collection methods to be chained:', function () {
      collection
        .addViews({'a.hbs': {path: 'a.hbs'}})
        .addViews({'b.hbs': {path: 'b.hbs'}})
        .addViews({'c.hbs': {path: 'c.hbs'}});

      collection.views.should.have.properties([
        'a.hbs',
        'b.hbs',
        'c.hbs'
      ]);
    });

    it('should expose the `option` method:', function () {
      collection.option('foo', 'bar')
        .addViews('a.hbs')
        .addViews('b.hbs')
        .addViews('c.hbs');

      collection.options.should.have.property('foo', 'bar');
      collection.views.should.have.properties([
        'a.hbs',
        'b.hbs',
        'c.hbs'
      ]);
    });
  });

  describe('queue', function () {
    beforeEach(function () {
      collection = new Views();
    });

    it('should emit arguments on addView:', function (done) {
      collection.on('addView', function (a, b, c, d, e) {
        assert(a === 'a');
        assert(b === 'b');
        assert(c === 'c');
        assert(d === 'd');
        assert(e === 'e');
        done();
      });

      collection.addView('a', 'b', 'c', 'd', 'e');
    });

    it('should expose the `queue` property for loading views:', function () {
      collection.queue.push(collection.view('b', {path: 'b'}));

      collection.addView('a', {path: 'a'});
      assert(collection.views.hasOwnProperty('a'));
      assert(collection.views.hasOwnProperty('b'));
    });

    it('should load all views on the queue when addView is called:', function () {
      collection.on('addView', function (key, value) {
        collection.queue.push(collection.view(key, {content: value}));
      });

      collection.addView('a.html', 'aaa');
      collection.addView('b.html', 'bbb');
      collection.addView('c.html', 'ccc');
      assert(collection.views.hasOwnProperty('a.html'));
      assert(collection.getView('a.html').content === 'aaa');
      assert(collection.views.hasOwnProperty('b.html'));
      assert(collection.getView('b.html').content === 'bbb');
      assert(collection.views.hasOwnProperty('c.html'));
      assert(collection.getView('c.html').content === 'ccc');
    });

    it('should expose the `option` method:', function () {
      collection.option('foo', 'bar')
        .addViews('a.hbs')
        .addViews('b.hbs')
        .addViews('c.hbs');

      collection.options.should.have.property('foo', 'bar');
      collection.views.should.have.properties([
        'a.hbs',
        'b.hbs',
        'c.hbs'
      ]);
    });
  });
});
