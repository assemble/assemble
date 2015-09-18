require('mocha');
require('should');
var fs = require('fs');
var assert = require('assert');
var App = require('../');
var app;

describe('collection', function () {
  describe('method', function () {
    beforeEach(function () {
      app = new App();
    });

    it('should expose the collection method', function () {
      assert(typeof app.collection === 'function');
    });

    it('should return a new collection', function () {
      var collection = app.collection();
      assert(typeof collection === 'object');
    });

    it('should have isCollection property', function () {
      var collection = app.collection();
      assert(collection.isCollection === true);
    });
  });

  describe('adding views', function () {
    beforeEach(function () {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('pages');
    });

    it('should load a view onto the respective collection:', function () {
      app.pages('test/fixtures/pages/a.hbs');
      app.views.pages.should.have.property('test/fixtures/pages/a.hbs');
    });

    it('should allow collection methods to be chained:', function () {
      app
        .pages('test/fixtures/pages/a.hbs')
        .pages('test/fixtures/pages/b.hbs')
        .pages('test/fixtures/pages/c.hbs');

      app.views.pages.should.have.properties([
        'test/fixtures/pages/a.hbs',
        'test/fixtures/pages/b.hbs',
        'test/fixtures/pages/c.hbs'
      ]);
    });

    it('should expose the `option` method:', function () {
      app.pages.option('foo', 'bar')
        .pages('test/fixtures/pages/a.hbs')
        .pages('test/fixtures/pages/b.hbs')
        .pages('test/fixtures/pages/c.hbs');

      app.pages.options.should.have.property('foo', 'bar');
      app.views.pages.should.have.properties([
        'test/fixtures/pages/a.hbs',
        'test/fixtures/pages/b.hbs',
        'test/fixtures/pages/c.hbs'
      ]);
    });

    it('should expose the `option` method:', function () {
      app.pages.option('foo', 'bar')
        .pages('test/fixtures/pages/a.hbs')
        .pages('test/fixtures/pages/b.hbs')
        .pages('test/fixtures/pages/c.hbs');

      assert(app.pages.count === 3);
    });
  });

  describe('rendering views', function () {
    beforeEach(function () {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('pages');
    });

    it('should render a view with inherited app.render', function (done) {
      app.page('test/fixtures/templates/a.tmpl')
        .use(function (view) {
          if (!view.contents) {
            view.contents = fs.readFileSync(view.path);
          }
        })
        .set('data.name', 'Brian')
        .render(function (err, res) {
          if (err) return done(err);
          assert(res.contents.toString() === 'Brian');
          done();
        });
    });
  });
});

describe('collection singular method', function () {
  describe('create', function () {
    beforeEach(function () {
      app = new App();
    });

    it('should add a pluralized collection from singular name', function () {
      app.create('page');
      assert(typeof app.views.pages === 'object');
    });
  });

  describe('adding views', function () {
    beforeEach(function () {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('page');
    });

    it('should add a view to the created collection:', function () {
      app.page('test/fixtures/pages/a.hbs');
      assert(typeof app.views.pages['test/fixtures/pages/a.hbs'] === 'object');
    });

    it('should expose the `option` method:', function () {
      app.pages.option('foo', 'bar')
      app.pages.options.should.have.property('foo', 'bar');
    });
  });
});
