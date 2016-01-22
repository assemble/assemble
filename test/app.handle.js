'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.handle', function() {
  beforeEach(function() {
    app = new App();
    app.create('pages');
    app.handlers(['foo']);
  });

  it('should support custom handle methods:', function(cb) {
    var page = app.page('foo', {contents: null});

    app.handle('foo', page, function(err, view) {
      if (err) return cb(err);
      
      assert(typeof view.path === 'string');
      cb();
    });
  });

  it('should not blow up if `options.handled` does not exist:', function(cb) {
    var page = app.page('foo', {contents: null});
    delete page.options.handled;

    app.handle('foo', page, function(err, view) {
      if (err) return cb(err);
      
      assert(typeof view.path === 'string');
      cb();
    });
  });
});
