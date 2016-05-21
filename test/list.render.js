'use strict';

require('mocha');
require('should');
var each = require('async-each');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var List = App.List;
var posts;

describe('list.render', function() {
  describe('rendering', function() {
    beforeEach(function() {
      posts = new List();
      posts.engine('tmpl', require('engine-base'));
    });

    it('should throw an error when no callback is given:', function(cb) {
      try {
        posts.render({});
        cb(new Error('expected an error'));
      } catch (err) {
        console.log(err);
        assert.equal(err.message, 'List#render is async and expects a callback function');
        cb();
      }
    });

    it('should throw an error when an engine is not defined:', function(cb) {
      posts.addItem('foo.bar', {content: '<%= name %>'});
      var page = posts.getItem('foo.bar');

      posts.render(page, function(err) {
        assert(err.message === 'List#render cannot find an engine for: .bar');
        cb();
      });
    });

    it('should use helpers to render a item:', function(cb) {
      var locals = {name: 'Halle'};

      posts.helper('upper', function(str) {
        return str.toUpperCase(str);
      });

      posts.addItem('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      var page = posts.getItem('a.tmpl');

      posts.render(page, function(err, res) {
        if (err) return cb(err);

        assert(res.content === 'a HALLE b');
        cb();
      });
    });

    it('should use helpers when rendering a item:', function(cb) {
      var locals = {name: 'Halle'};
      posts.helper('upper', function(str) {
        return str.toUpperCase(str);
      });

      posts.addItem('a.tmpl', {content: 'a <%= upper(name) %> b', locals: locals});
      var page = posts.getItem('a.tmpl');

      posts.render(page, function(err, res) {
        if (err) return cb(err);
        assert(res.content === 'a HALLE b');
        cb();
      });
    });

    it('should render a template when contents is a buffer:', function(cb) {
      posts.addItem('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});
      var item = posts.getItem('a.tmpl');

      posts.render(item, function(err, item) {
        if (err) return cb(err);
        assert(item.contents.toString() === 'b');
        cb();
      });
    });

    it('should render a template when content is a string:', function(cb) {
      posts.addItem('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});
      var item = posts.getItem('a.tmpl');

      posts.render(item, function(err, item) {
        if (err) return cb(err);
        assert(item.contents.toString() === 'b');
        cb();
      });
    });

    it('should render a item from its path:', function(cb) {
      posts.addItem('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}});

      posts.render('a.tmpl', function(err, item) {
        if (err) return cb(err);
        assert(item.content === 'b');
        cb();
      });
    });

    it('should use a plugin for rendering:', function(cb) {
      posts.engine('tmpl', require('engine-base'));
      posts.option('engine', 'tmpl');

      posts.addItems({
        'a': {content: '<%= title %>', locals: {title: 'aaa'}},
        'b': {content: '<%= title %>', locals: {title: 'bbb'}},
        'c': {content: '<%= title %>', locals: {title: 'ccc'}},
        'd': {content: '<%= title %>', locals: {title: 'ddd'}},
        'e': {content: '<%= title %>', locals: {title: 'eee'}},
        'f': {content: '<%= title %>', locals: {title: 'fff'}},
        'g': {content: '<%= title %>', locals: {title: 'ggg'}},
        'h': {content: '<%= title %>', locals: {title: 'hhh'}},
        'i': {content: '<%= title %>', locals: {title: 'iii'}},
        'j': {content: '<%= title %>', locals: {title: 'jjj'}}
      });

      posts.use(function(collection) {
        collection.option('pager', false);

        collection.renderEach = function(cb) {
          var list = new List(collection);

          each(list.items, function(item, next) {
            collection.render(item, next);
          }, cb);
        };
      });

      posts.renderEach(function(err, items) {
        if (err) return cb(err);
        assert(items[0].content === 'aaa');
        assert(items[9].content === 'jjj');
        assert(items.length === 10);
        cb();
      });
    });
  });
});
