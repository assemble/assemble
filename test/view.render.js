'use strict';

require('mocha');
require('should');
var support = require('./support');
var App = support.resolve();
var View = App.View;
var view, app;

describe('helpers', function() {
  describe('rendering', function() {
    beforeEach(function() {
      app = new App();
      view = new View();
      app.engine('tmpl', require('engine-base'));
      app.create('layouts', {viewType: 'layout'});
      app.create('pages');
    });

    it('should expose `.render` for rendering a view:', function(cb) {
      app.page('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'})
        .render({a: 'bbb'}, function(err, res) {
          if (err) return cb(err);
          res.content.should.equal('bbb');
          cb();
        });
    });

    it('should render a view with a layout', function(cb) {
      app.layout('default.tmpl', {content: 'a {% body %} b'});
      app.page('a.tmpl', {content: '<%= title %>', layout: 'default.tmpl'})
        .render({title: 'zzz'}, function(err, res) {
          if (err) return cb(err);
          res.content.should.equal('a zzz b');
          cb();
        });
    });

    it('should render a view with a layout', function(cb) {
      app.layout('foo.tmpl', {content: 'a {% body %} a'});
      app.layout('bar.tmpl', {content: 'b {% body %} b'});
      app.pages('a.tmpl', {content: '<%= title %>'});

      app.pages.getView('a.tmpl')
        .option('resolveLayout', function() {
          return 'bar.tmpl';
        })
        .render({title: 'zzz'}, function(err, res) {
          if (err) return cb(err);
          res.content.should.equal('b zzz b');
          cb();
        });
    });
  });
});

