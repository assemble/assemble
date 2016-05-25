'use strict';

require('mocha');
require('should');
var fs = require('fs');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('view.set', function() {
  beforeEach(function() {
    app = new App();
    app.create('page');
    app.engine('tmpl', require('engine-base'));
  });

  it('should set a property on a view:', function(cb) {
    app.page('abc', {path: 'test/fixtures/templates/a.tmpl'})
      .set('read', function() {
        this.contents = fs.readFileSync(this.path);
        return this;
      });

    assert('read' in app.views.pages.abc);
    app.views.pages.abc
      .read()
      .set('data.name', 'Brooke')
      .render(function(err, res) {
        if (err) return cb(err);
        assert(res.content === 'Brooke');
        cb();
      });
  });
});
