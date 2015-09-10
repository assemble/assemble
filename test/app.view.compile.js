require('mocha');
require('should');
var assert = require('assert');
var App = require('../');
var app;

describe('app view', function () {
  describe('compile method', function () {
    beforeEach(function () {
      app = new App();
      app.engine('tmpl', require('engine-base'));
      app.create('page');
    });

    it('should use helpers to render a view:', function () {
      var buffer = new Buffer('a b c');
      var view = app.page('a.tmpl', {contents: buffer})
        .compile();
      assert(typeof view.fn === 'function');
    });
  });
});

