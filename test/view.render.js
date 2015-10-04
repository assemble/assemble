require('mocha');
require('should');
var View = require('../').View;
var App = require('..');
var view, app;

describe('helpers', function () {
  describe('rendering', function () {
    beforeEach(function () {
      app = new App();
      view = new View();
      app.engine('tmpl', require('engine-base'));
      app.create('layouts', {viewType: 'layout'});
      app.create('pages');
    });

    it('should expose `.render` for rendering a view:', function (done) {
      app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'})
        .render({a: 'bbb'}, function (err, res) {
          if (err) return done(err);
          res.content.should.equal('bbb');
          done();
        });
    });

    it('should render a view with a layout', function (done) {
      app.layout('default.tmpl', {content: 'a {% body %} b'});
      app.pages('a.tmpl', {content: '<%= title %>', layout: 'default.tmpl'})
        .render({title: 'zzz'}, function (err, res) {
          if (err) return done(err);
          res.content.should.equal('a zzz b');
          done();
        });
    });

    it('should render a view with a layout', function (done) {
      app.layout('foo.tmpl', {content: 'a {% body %} a'});
      app.layout('bar.tmpl', {content: 'b {% body %} b'});
      app.pages('a.tmpl', {content: '<%= title %>'});

      var page = app.pages.getView('a.tmpl')
        .option('resolveLayout', function () {
          return 'bar.tmpl';
        })
        .render({title: 'zzz'}, function (err, res) {
          if (err) return done(err);
          res.content.should.equal('b zzz b');
          done();
        });
    });
  });
});

