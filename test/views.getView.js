'use strict';

require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var Views = App.Views;
var views;

describe('views.getView', function() {
  beforeEach(function() {
    views = new Views();
    views.option('renameKey', function(key, view) {
      return '123/' + (view ? view.basename : path.basename(key));
    });

    views.addView('one', {content: 'this is one'});
    views.addView('a/b/c/one.txt', {content: 'this is a/b/c/one.txt'});
    views.addView('a/b/c/two.txt', {content: '...'});
    views.addView('a/b/c/three.txt', {content: 'this is three', base: 'a/b/c'});
  });

  it('should throw an error when a string is not passed', function(cb) {
    try {
      views.getView(null);
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'expected a string');
      cb();
    }
  });

  it('should get a view by `key`', function() {
    assert(views.getView('a/b/c/one.txt'));
    assert.equal(views.getView('123/a/b/c/one.txt').content, 'this is a/b/c/one.txt');
  });

  it('should get a view by `path', function() {
    assert(views.getView('a/b/c/one.txt'));
    assert.equal(views.getView('a/b/c/one.txt').content, 'this is a/b/c/one.txt');
  });

  it('should get a view by `relative', function() {
    assert(views.getView('123/one.txt'));
    assert.equal(views.getView('123/one.txt').content, 'this is a/b/c/one.txt');
  });

  it('should get a view by `basename`', function() {
    assert(views.getView('one.txt'));
    assert.equal(views.getView('one.txt').content, 'this is a/b/c/one.txt');
  });

  it('should get a view by `filename`', function() {
    assert(views.getView('one'));
    assert.equal(views.getView('one').content, 'this is one');

    assert(views.getView('three'));
    assert.equal(views.getView('three').content, 'this is three');
  });
});
