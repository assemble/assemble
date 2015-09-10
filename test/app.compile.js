require('should');
var assert = require('assert');
var App = require('..');
var app;

describe('compile', function () {
  beforeEach(function () {
    app = new App();
    app.create('page');
  });

  it('should throw an error when no callback is given:', function () {
    app.page('foo.bar', {content: '<%= name %>'});
    var page = app.pages.getView('foo.bar');
    (function() {
      app.compile(page);
    }).should.throw('Templates#compile cannot find an engine for: .bar');
  });

  it('should compile a template:', function () {
    app.engine('tmpl', require('engine-base'));
    app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>', a: 'b'});

    var page = app.pages.getView('a.tmpl');
    var view = app.compile(page);
    assert.equal(typeof view.fn, 'function');
  });
});
