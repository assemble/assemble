require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('events', function () {
  beforeEach(function () {
    app = new App();
  });

  it('should listen for an event:', function () {
    var app = new App();
    app.on('foo', function () {
    });
    assert(Array.isArray(app._callbacks['$foo']));
  });

  it('should emit an event:', function (done) {
    var app = new App();
    app.on('foo', function (val) {
      assert(val === 'bar');
      done();
    });
    assert(Array.isArray(app._callbacks['$foo']));
    app.emit('foo', 'bar');
  });

  it('should listen for error events:', function (done) {
    var app = new App();
    app.on('foo', function (val) {
      assert(val === 'bar');
      done();
    });
    assert(Array.isArray(app._callbacks['$foo']));
    app.emit('foo', 'bar');
  });

  it('should listen for `view` events:', function () {
    var app = new App();

    app.on('view', function (view) {
      view.foo = 'bar';
    });

    var view = app.view({path: 'a', content: 'b'});
    assert(view.foo === 'bar');
  });
});
