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
  });
});

