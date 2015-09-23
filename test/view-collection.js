require('mocha');
require('should');
var assert = require('assert');
var App = require('..');
var Views = App.Views;
var vc;

describe('vc', function () {
  describe('method', function () {
    beforeEach(function () {
      vc = new Views();
    });

    it('should return a new view collection', function () {
      var vc = new Views();
      assert(typeof vc === 'object');
    });

    it('should create an instance without new', function () {
      assert(typeof Views === 'function');
    });

    it('should have isCollection property', function () {
      var vc = new Views();
      assert(vc.isCollection === true);
    });
  });

  describe('adding views', function () {
    beforeEach(function () {
      vc = new Views();
    });

    it('should load a view onto the respective vc:', function () {
      vc.addView('a.hbs');
      vc.views.should.have.property('a.hbs');
    });

    it('should allow collection methods to be chained:', function () {
      vc
        .addViews({'a.hbs': {path: 'a.hbs'}})
        .addViews({'b.hbs': {path: 'b.hbs'}})
        .addViews({'c.hbs': {path: 'c.hbs'}});

      vc.views.should.have.properties([
        'a.hbs',
        'b.hbs',
        'c.hbs'
      ]);
    });
  });

  describe('queue', function () {
    beforeEach(function () {
      vc = new Views();
    });

    it('should emit arguments on addView:', function (done) {
      vc.on('addView', function (a, b, c, d, e) {
        assert(a === 'a');
        assert(b === 'b');
        assert(c === 'c');
        assert(d === 'd');
        assert(e === 'e');
        done();
      });

      vc.addView('a', 'b', 'c', 'd', 'e');
    });

    it('should expose the `queue` property for loading views:', function () {
      vc.queue.push(vc.view('b', {path: 'b'}));

      vc.addView('a', {path: 'a'});
      assert(vc.views.hasOwnProperty('a'));
      assert(vc.views.hasOwnProperty('b'));
    });

    it('should load all views on the queue when addView is called:', function () {
      vc.on('addView', function (key, value) {
        vc.queue.push(vc.view(key, {content: value}));
      });

      vc.addView('a.html', 'aaa');
      vc.addView('b.html', 'bbb');
      vc.addView('c.html', 'ccc');
      assert(vc.views.hasOwnProperty('a.html'));
      assert(vc.getView('a.html').content === 'aaa');
      assert(vc.views.hasOwnProperty('b.html'));
      assert(vc.getView('b.html').content === 'bbb');
      assert(vc.views.hasOwnProperty('c.html'));
      assert(vc.getView('c.html').content === 'ccc');
    });
  });
});

describe('options', function () {
  it('should expose the `option` method:', function () {
    vc.option('foo', 'bar')
      .addViews('a.hbs')
      .addViews('b.hbs')
      .addViews('c.hbs');

    vc.options.should.have.property('foo', 'bar');
    vc.views.should.have.properties([
      'a.hbs',
      'b.hbs',
      'c.hbs'
    ]);
  });
});