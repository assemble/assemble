'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.route', function() {
  beforeEach(function() {
    app = new App();
  });

  describe('routes', function() {
    it('should create a route for the given path:', function(cb) {
      app = new App();
      app.create('posts');

      app.on('all', function(msg) {
        assert(msg === 'cb');
        cb();
      });

      app.route('blog/:title')
        .all(function(view, next) {
          app.emit('all', 'cb');
          next();
        });

      app.post('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });

    it('should emit events when a route method is called:', function(cb) {
      app = new App();
      app.create('posts');

      app.on('onLoad', function(view) {
        assert(view.path === 'blog/foo.js');
        cb();
      });

      app.param('title', function(view, next, title) {
        assert(title === 'foo.js');
        next();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      app.post('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });

    it('should emit errors', function(cb) {
      app = new App();
      app.create('posts');

      app.on('error', function(err) {
        assert(err.message === 'false == true');
        cb();
      });

      // wrong...
      app.param('title', function(view, next, title) {
        assert(title === 'fo.js');
        next();
      });

      app.onLoad('/blog/:title', function(view, next) {
        assert(view.path === '/blog/foo.js');
        next();
      });

      app.post('whatever', {path: '/blog/foo.js', content: 'bar baz'});
    });

    it('should have path property', function() {
      var route = new app.Route('/blog/:year/:month/:day/:slug').all([
        function() {}
      ]);
      route.path.should.equal('/blog/:year/:month/:day/:slug');
    });

    it('should have stack property', function() {
      var route = new app.Route('/blog/:year/:month/:day/:slug').all([
        function() {}
      ]);

      route.stack.should.be.instanceof(Array);
      route.stack.should.have.length(1);
    });
  });
});
