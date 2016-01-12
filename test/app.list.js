require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var app;

describe('list', function() {
  describe('method', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should expose the list method', function() {
      assert(typeof app.list === 'function');
    });

    it('should return a new list', function() {
      var list = app.list();
      assert(typeof list === 'object');
    });

    it('should have isList property', function() {
      var list = app.list();
      assert(list.isList === true);
    });
  });

  describe('adding items', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('pages');
    });

    it('should expose the `option` method from a list:', function() {
      var list = app.list();
      list.option('a', 'b');
      assert(list.options);
      assert(list.options.a === 'b');
    });
  });

  describe('addItem', function() {
    beforeEach(function() {
      app = new App();
    });

    it('should add items to a list', function() {
      var pages = app.list({List: List});
      pages.addItem('foo');
      pages.addItem('bar');
      pages.addItem('baz');

      pages.items.hasOwnProperty('foo');
      pages.items.hasOwnProperty('bar');
      pages.items.hasOwnProperty('baz');
    });

    it('should create a list from an existing list:', function() {
      var pages = app.list({List: List});
      pages.addItem('foo');
      pages.addItem('bar');
      pages.addItem('baz');

      var posts = app.list(pages);
      posts.items.hasOwnProperty('foo');
      posts.items.hasOwnProperty('bar');
      posts.items.hasOwnProperty('baz');
    });
  });

  describe('rendering items', function() {
    beforeEach(function() {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('pages');

      app.cache.data = {};
    });

    it('should render a item with inherited app.render', function(done) {
      app.page('test/fixtures/templates/a.tmpl')
        .use(function(item) {
          if (!item.contents) {
            item.contents = fs.readFileSync(item.path);
          }
        })
        .set('data.name', 'Brian')
        .render(function(err, res) {
          if (err) return done(err);
          assert(res.content === 'Brian');
          done();
        });
    });
  });
});
