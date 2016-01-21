'use strict';

require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var list;

describe('list.getIndex', function() {
  beforeEach(function() {
    list = new List();
    list.items = [];
  });

  it('should get the index of a key when key is not renamed', function() {
    list.addItem('a/b/c/ddd.hbs', {content: 'ddd'});
    list.addItem('a/b/c/eee.hbs', {content: 'eee'});
    assert.equal(list.getIndex('a/b/c/ddd.hbs'), 0);
    assert.equal(list.getIndex('a/b/c/eee.hbs'), 1);
  });

  it('should get the index by path', function() {
    list.addItem('d.md', {path: 'a/b/c/d.md', content: 'ddd'});
    assert.equal(list.getIndex('a/b/c/d.md'), 0);
  });

  it('should get the index by relative path', function() {
    list.addItem('d.md', {path: 'a/b/c/d.md', content: 'ddd', base: 'a/b'});
    assert.equal(list.getIndex('c/d.md'), 0);
  });

  it('should get the index by stem', function() {
    list.addItem('d.md', {path: 'a/b/c/d.md', content: 'ddd', base: 'a/b'});
    assert.equal(list.getIndex('d'), 0);
  });

  it('should get the index by basename', function() {
    list.addItem('a/b/c/d.md', {path: 'a/b/c/d.md', content: 'ddd', base: 'a/b'});
    assert.equal(list.getIndex('d.md'), 0);
  });

  it('should get the index by key', function() {
    list.addItem('d.md', {path: 'a/b/c/d.md', content: 'ddd', base: 'a/b'});
    list.getItem('d.md').key = 'foo';
    assert.equal(list.getIndex('foo'), 0);
  });

  it('should get the index of a key for dotfiles', function() {
    list.addItem('.gitignore', {content: 'ddd'});
    assert.equal(list.getIndex('.gitignore'), 0);
  });

  it('should throw an error when argument is undefined', function(cb) {
    try {
      list.getIndex();
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'expected a string or instance of Item');
      cb();
    }
  });

  it('should return `-1` when the item is not found', function() {
    assert.equal(list.getIndex('flflflfl'), -1);
  });

  it('should get the correct index for dotfiles', function() {
    list.addItem('.DS_Store', {content: '...'});
    list.addItem('.gitignore', {content: 'ddd'});
    list.addItem('.zzz', {content: '...'});
    assert.equal(list.getIndex('.gitignore'), 1);
  });

  it('should get the correct index for dotfiles by their extensions', function() {
    list.addItem('a/b/c/.DS_Store', {content: '...'});
    list.addItem('a/b/c/.gitignore', {content: 'ddd'});
    list.addItem('a/b/c/.zzz', {content: '...'});
    assert.equal(list.getIndex('.gitignore'), 1);
  });

  it('should get the correct index for dotfiles by their paths', function() {
    list.addItem('a/b/c/.DS_Store', {content: '...'});
    list.addItem('a/b/c/.gitignore', {content: 'ddd'});
    list.addItem('a/b/c/.zzz', {content: '...'});
    assert.equal(list.getIndex('a/b/c/.gitignore'), 1);
  });

  it('should get the index of a key when key is renamed', function() {
    list = new List({
      renameKey: function(key) {
        return path.basename(key);
      }
    });
    list.addItem('a/b/c/ddd.hbs', {content: 'ddd'});
    list.addItem('a/b/c/eee.hbs', {content: 'eee'});
    assert.equal(list.getIndex('a/b/c/ddd.hbs'), 0);
    assert.equal(list.getIndex('ddd.hbs'), 0);
    assert.equal(list.getIndex('a/b/c/eee.hbs'), 1);
    assert.equal(list.getIndex('eee.hbs'), 1);
  });
});

