'use strict';

require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.get-set', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should set a value', function() {
    app.set('a', 'b');
    assert.equal(app.get('a'), 'b');
  });

  it('should set properties on the instance.', function() {
    app.set('a', 'b');
    assert.equal(app.a, 'b');
  });

  it('should allow an object to be set directly.', function() {
    app.set({x: 'y'});
    assert.equal(app.x, 'y');
    assert.equal(app.get('x'), 'y');
  });

  it('should set nested properties on the instance.', function() {
    app.set('c', {d: 'e'});
    assert.equal(app.get('c').d, 'e');
  });

  it('should use dot notation to `set` values.', function() {
    app.set('h.i', 'j');
    assert.deepEqual(app.get('h'), {i: 'j'});
  });

  it('should use dot notation to `get` values.', function() {
    app.set('h', {i: 'j'});
    assert.equal(app.get('h.i'), 'j');
  });

  it('should return `this` for chaining', function() {
    assert.equal(app.set('a', 'b'), app);
    app
      .set('aa', 'bb')
      .set('bb', 'cc')
      .set('cc', 'dd');
    assert.equal(app.get('aa'), 'bb');
    assert.equal(app.get('bb'), 'cc');
    assert.equal(app.get('cc'), 'dd');
  });

  it('should return undefined when not set', function() {
    assert.equal(app.set('a', undefined), app);
  });
});

describe('app.get()', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should return undefined when no set', function() {
    assert(app.get('a') === undefined);
  });

  it('should otherwise return the value', function() {
    app.set('a', 'b');
    assert.equal(app.get('a'), 'b');
  });
});
