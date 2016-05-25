'use strict';

require('mocha');
require('should');
var assert = require('assert');
var assemble = require('..');
var app;

describe('.partial()', function() {
  beforeEach(function() {
    app = assemble();
    if (!app.partials) {
      app.create('partials', {viewType: 'partial'});
    }
  });

  describe('add partial', function() {
    it('should add partials to `app.views.partials`:', function() {
      app.partial('a.hbs', {path: 'a.hbs', contents: new Buffer('a')});
      app.partial('b.hbs', {path: 'b.hbs', contents: new Buffer('b')});
      app.partial('c.hbs', {path: 'c.hbs', contents: new Buffer('c')});
      assert(Object.keys(app.views.partials).length === 3);
    });
  });
});
