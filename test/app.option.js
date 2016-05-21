'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.option', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should set a key-value pair on options:', function() {
    app.option('a', 'b');
    assert.equal(app.options.a, 'b');
  });

  it('should set an object on options:', function() {
    app.option({c: 'd'});
    assert.equal(app.options.c, 'd');
  });

  it('should set an option.', function() {
    app.option('a', 'b');
    assert(app.options.hasOwnProperty('a'));
  });

  it('should get an option.', function() {
    app.option('a', 'b');
    assert.equal(app.option('a'), 'b');
  });

  it('should extend the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    assert.equal(app.option('x'), 'xxx');
    assert.equal(app.option('y'), 'yyy');
    assert.equal(app.option('z'), 'zzz');
  });

  it('options should be on the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    assert.equal(app.options.x, 'xxx');
    assert.equal(app.options.y, 'yyy');
    assert.equal(app.options.z, 'zzz');
  });

  it('should be chainable.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    app.option({a: 'aaa', b: 'bbb', c: 'ccc'});

    assert.equal(app.option('x'), 'xxx');
    assert.equal(app.option('a'), 'aaa');
  });

  it('should extend the `options` object when the first param is a string.', function() {
    app.option('foo', {x: 'xxx', y: 'yyy', z: 'zzz'});
    app.option('bar', {a: 'aaa', b: 'bbb', c: 'ccc'});

    assert(app.option('foo').hasOwnProperty('x'));
    assert(app.option('bar').hasOwnProperty('a'));

    assert(app.options.foo.hasOwnProperty('x'));
    assert(app.options.bar.hasOwnProperty('a'));
  });

  it('should set an option.', function() {
    app.option('a', 'b');
    assert(app.options.hasOwnProperty('a'));
  });

  it('should get an option.', function() {
    app.option('a', 'b');
    assert.equal(app.option('a'), 'b');
  });

  it('should extend the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    assert.equal(app.option('x'), 'xxx');
    assert.equal(app.option('y'), 'yyy');
    assert.equal(app.option('z'), 'zzz');
  });

  it('options should be on the `options` object.', function() {
    app.option({x: 'xxx', y: 'yyy', z: 'zzz'});
    assert.equal(app.options.x, 'xxx');
    assert.equal(app.options.y, 'yyy');
    assert.equal(app.options.z, 'zzz');
  });

  it('should be chainable.', function() {
    app
      .option({x: 'xxx', y: 'yyy', z: 'zzz'})
      .option({a: 'aaa', b: 'bbb', c: 'ccc'});

    assert.equal(app.option('x'), 'xxx');
    assert.equal(app.option('a'), 'aaa');
  });
});
