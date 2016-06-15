'use strict';

require('mocha');
var assert = require('assert');
var assemble = require('..');
var app;

describe('.layout()', function() {
  beforeEach(function() {
    app = assemble();
    if (!app.layout) {
      app.create('layout', {viewType: 'layout'});
    }
  });

  describe('add layout', function() {
    it('should add layouts to `app.views.layouts`:', function() {
      app.layout('a.hbs', {path: 'a.hbs', contents: new Buffer('a')});
      app.layout('b.hbs', {path: 'b.hbs', contents: new Buffer('b')});
      app.layout('c.hbs', {path: 'c.hbs', contents: new Buffer('c')});
      assert(Object.keys(app.views.layouts).length === 3);
    });
  });
});
