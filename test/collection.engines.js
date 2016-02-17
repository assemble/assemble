'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var Views = App.Views;
var collection, pages;

describe('collection engines', function() {
  beforeEach(function() {
    pages = new Views();
  });

  it('should throw an error when engine name is invalid:', function() {
    (function() {
      pages.engine(null, {});
    }).should.throw('expected engine ext to be a string or array.');
  });

  it('should register an engine to the given extension', function() {
    pages.engine('hbs', function() {});
    assert(typeof pages.engines['.hbs'] === 'object');
  });

  it('should set an engine with the given extension', function() {
    var hbs = function() {};
    hbs.render = function() {};
    hbs.renderFile = function() {};
    pages.engine('hbs', hbs);
    assert(pages.engines['.hbs']);
    assert(pages.engines['.hbs'].renderFile);
    assert(pages.engines['.hbs'].render);
  });

  it('should get an engine:', function() {
    pages.engine('hbs', function() {});
    var hbs = pages.engine('hbs');
    assert(typeof hbs === 'object');
    assert(hbs.hasOwnProperty('render'));
    assert(hbs.hasOwnProperty('compile'));
  });

  it('should register multiple engines to the given extension', function() {
    pages.engine(['hbs', 'md'], function() {});
    assert(typeof pages.engines['.hbs'] === 'object');
    assert(typeof pages.engines['.md'] === 'object');
  });
});

describe('engines', function() {
  beforeEach(function() {
    pages = new Views();
    pages.addView('foo.tmpl', {content: 'A <%= letter %> {{= letter }} C'});
    pages.addView('bar.tmpl', {content: 'A <%= letter %> {{ letter }} C'});
  });

  it('should register an engine:', function() {
    pages.engine('a', {render: function() {}});
    pages.engines.should.have.property('.a');
  });

  it('should use custom delimiters:', function(cb) {
    pages.engine('tmpl', require('engine-base'), {
      delims: ['{{', '}}']
    });

    pages.render('foo.tmpl', {letter: 'B'}, function(err, res) {
      if (err) return cb(err);
      res.content.should.equal('A <%= letter %> B C');
      cb();
    });
  });

  it('should override individual delims values:', function(cb) {
    pages.engine('tmpl', require('engine-base'), {
      interpolate: /\{{([^}]+)}}/g,
      evaluate: /\{{([^}]+)}}/g,
      escape: /\{{-([^}]+)}}/g
    });
    pages.render('bar.tmpl', {letter: 'B'}, function(err, res) {
      if (err) return cb(err);
      res.content.should.equal('A <%= letter %> B C');
      cb();
    });
  });

  it('should get an engine:', function() {
    pages.engine('a', {
      render: function() {}
    });
    var a = pages.engine('a');
    a.should.have.property('render');
  });
});

describe('engine selection:', function() {
  beforeEach(function(cb) {
    collection = new Views();
    collection.engine('tmpl', require('engine-base'));
    collection.engine('hbs', require('engine-handlebars'));
    cb();
  });

  it('should get the engine from file extension:', function(cb) {
    var pages = new Views();
    pages.engine('tmpl', require('engine-base'));
    pages.engine('hbs', require('engine-handlebars'));
    pages.addView('a.tmpl', {content: '<%= a %>', locals: {a: 'b'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on the collection:', function(cb) {
    var posts = new Views({engine: 'hbs'});
    posts.engine('tmpl', require('engine-base'));
    posts.engine('hbs', require('engine-handlebars'));

    posts.addView('a', {content: '{{a}}', locals: {a: 'b'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on the view:', function(cb) {
    var posts = new Views();
    posts.engine('tmpl', require('engine-base'));
    posts.engine('hbs', require('engine-handlebars'));
    posts.addView('a', {content: '{{a}}', engine: 'hbs', locals: {a: 'b'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on view.options:', function(cb) {
    var posts = new Views();
    posts.engine('tmpl', require('engine-base'));
    posts.engine('hbs', require('engine-handlebars'));
    posts.addView('a', {content: '{{a}}', data: {a: 'b'}, options: {engine: 'hbs'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on view.data:', function(cb) {
    var posts = new Views();
    posts.engine('tmpl', require('engine-base'));
    posts.engine('hbs', require('engine-handlebars'));
    posts.addView('a', {content: '{{a}}', locals: {a: 'b'}, data: {engine: 'hbs'}})
      .render(function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });

  it('should use the engine defined on render locals:', function(cb) {
    var posts = new Views();
    posts.engine('tmpl', require('engine-base'));
    posts.engine('hbs', require('engine-handlebars'));
    posts.addView('a', {content: '{{a}}', locals: {a: 'b'}})
      .render({engine: 'hbs'}, function(err, view) {
        if (err) return cb(err);
        assert(view.content === 'b');
        cb();
      });
  });
});
