'use strict';

require('mocha');
var assert = require('assert');
var assemble = require('..');
var app;

describe('.page()', function() {
  beforeEach(function() {
    app = assemble();
    if (!app.pages) {
      app.create('pages');
    }
  });

  describe('add page', function() {
    it('should add pages to `app.views.pages`:', function() {
      app.page('a.hbs', {path: 'a.hbs', contents: new Buffer('a')});
      app.page('b.hbs', {path: 'b.hbs', contents: new Buffer('b')});
      app.page('c.hbs', {path: 'c.hbs', contents: new Buffer('c')});
      assert(Object.keys(app.views.pages).length === 3);
    });
  });
  
  describe('load', function() {
    it('should load a page from a non-glob filepath', function() {
      app.page('test/fixtures/pages/a.hbs');
      assert(Object.keys(app.views.pages).length === 1);
    });
  });
});
