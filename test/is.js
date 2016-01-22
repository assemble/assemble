'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();

describe('is', function() {
  describe('isApp', function() {
    it('should return true if value is an instance of App', function() {
      var app = new App();
      assert(App.isApp(app));
    });
    it('should return false if value is not an instance of App', function() {
      assert(!App.isApp('foo'));
    });
  });

  describe('isCollection', function() {
    it('should return true if value is an instance of Collection', function() {
      var collection = new App.Collection();
      assert(App.isCollection(collection));
    });
    it('should return false if value is not an instance of Collection', function() {
      assert(!App.isCollection('foo'));
    });
  });

  describe('isViews', function() {
    it('should return true if value is an instance of Views', function() {
      var collection = new App.Views();
      assert(App.isViews(collection));
    });
    it('should return false if value is not an instance of Views', function() {
      assert(!App.isViews('foo'));
    });
  });

  describe('isList', function() {
    it('should return true if value is an instance of List', function() {
      var collection = new App.List();
      assert(App.isList(collection));
    });
    it('should return false if value is not an instance of List', function() {
      assert(!App.isList('foo'));
    });
  });

  describe('isView', function() {
    it('should return true if value is an instance of View', function() {
      var collection = new App.View();
      assert(App.isView(collection));
    });
    it('should return false if value is not an instance of View', function() {
      assert(!App.isView('foo'));
    });
  });

  describe('isItem', function() {
    it('should return true if value is an instance of Item', function() {
      var collection = new App.Item();
      assert(App.isItem(collection));
    });
    it('should return false if value is not an instance of Item', function() {
      assert(!App.isItem('foo'));
    });
  });
});

