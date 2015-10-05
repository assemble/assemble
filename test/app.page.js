require('mocha');
require('should');
var assert = require('assert');
var assemble = require('..');
var app;

describe('.page()', function () {
  beforeEach(function() {
    app = assemble();
  });

  describe('add page', function () {
    it('should add pages to `app.views.pages`:', function () {
      app.page('a.hbs', {path: 'a.hbs', contents: new Buffer('a')});
      app.page('b.hbs', {path: 'b.hbs', contents: new Buffer('b')});
      app.page('c.hbs', {path: 'c.hbs', contents: new Buffer('c')});
      assert(Object.keys(app.views.pages).length === 3);
    });
  });
});
