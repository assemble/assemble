'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var App = require('..').Assemble;
var app;

describe('App', function () {
  it('should create a new instance of App:', function () {
    var app = new App();
    assert.equal(app instanceof App, true);
  });

  it('should contain an `options` property', function () {
    var app = new App({});
    assert.deepEqual(app.options, {});
    assert.equal(app.hasOwnProperty('options'), true);
  });

  it('should contain an `app` property', function () {
    var app = new App({app: {}});
    assert.deepEqual(app.app, {});
    assert.equal(app.hasOwnProperty('app'), true);
  });

  it('should contain a `data` property', function () {
    var app = new App({app: {}});
    assert.deepEqual(app.cache.data, {});
    assert.equal(app.hasOwnProperty('data'), true);
  });

  it('should contain a `_cache` property', function () {
    var app = new App({app: {}});
    assert.deepEqual(app._cache, {});
    assert.equal(app.hasOwnProperty('_cache'), true);
  });

  it('should cache a function call', function () {
    var app = new App();
    function foo (bar) {
      return function () {
        return bar;
      };
    };

    var bar1 = app.fragmentCache('foo', foo('bar1'));
    var bar2 = app.fragmentCache('foo', foo('bar2'));
    assert.equal(bar1, 'bar1');
    assert.equal(bar2, 'bar1');
    assert.equal(bar2, bar1);
  });

  it('should set properties on the object', function () {
    var app = new App();
    app.set('foo', 'bar');
    assert.equal(app.foo, 'bar');
  });

  it('should get properties from the object', function () {
    var app = new App();
    app.set('foo', 'bar');
    assert.equal(app.get('foo'), 'bar');
  });

  it('should clone the entire object', function () {
    var app = new App();
    app.set('foo', 'bar');
    var clone = app.clone();
    assert.equal(clone.get('foo'), app.get('foo'));
    assert.deepEqual(clone, app);
  });

  it('should set an option', function () {
    var app = new App();
    app.option('foo', 'bar');
    assert.deepEqual(app.options, {foo: 'bar'});
  });

  it('should get an option', function () {
    var app = new App({foo: 'bar'});
    assert.equal(app.option('foo'), 'bar');
  });

  it('should emit an `option` event when setting an option', function () {
    var app = new App();
    app.on('option', function (key, val) {
      assert.equal(key, 'foo');
      assert.equal(val, 'bar');
    });
    app.option('foo', 'bar');
  });

  it('should `enable` an option', function () {
    var app = new App();
    app.enable('foo');
    assert.equal(app.option('foo'), true);
  });

  it('should `disable` an option', function () {
    var app = new App();
    app.disable('foo');
    assert.equal(app.option('foo'), false);
  });

  it('should check if an option is `enabled`', function () {
    var app = new App();
    app.enable('foo');
    app.disable('bar');
    assert.equal(app.enabled('foo'), true);
    assert.equal(app.enabled('bar'), false);
  });

  it('should check if an option is `disabled`', function () {
    var app = new App();
    app.enable('foo');
    app.disable('bar');
    assert.equal(app.disabled('foo'), false);
    assert.equal(app.disabled('bar'), true);
  });

  it('should pick an option from the local `options`', function () {
    var app = new App({foo: 'bar'});
    assert.equal(app.pickOption('foo'), 'bar');
  });

  it('should pick an option from the `app.options`', function () {
    var app = new App({foo: 'bar'});
    var app = new App({app: app});
    assert.equal(app.pickOption('foo'), 'bar');
  });

  it('should `use` a function passing the object and options to the function', function () {
    var app = new App({foo: 'bar'});
    app.use(function (obj, options) {
      assert.deepEqual(obj, app);
      assert.deepEqual(app.options, options);
      assert.deepEqual(this.options, options);
      assert.deepEqual(this.options, app.options);
    });
  });

  it('should omit keys from object', function () {
    var app = new App();
    app.set('foo', 'bar');
    app.set('bar', 'baz');
    app.set('baz', 'bang');
    var clone = app.omit(['bar']);
    assert.equal(typeof clone.bar, 'undefined');
    assert.equal(clone.foo, 'bar');
    assert.equal(clone.baz, 'bang');
  });

  it('should pick only the keys from object', function () {
    var app = new App();
    app.set('foo', 'bar');
    app.set('bar', 'baz');
    app.set('baz', 'bang');
    var clone = app.pick(['bar']);
    assert.equal(clone.bar, 'baz');
    assert.equal(typeof clone.foo, 'undefined');
    assert.equal(typeof clone.baz, 'undefined');
  });

  it('should visit all properties on an object and call the specified method', function () {
    var app = new App();
    var obj = {
      foo: 'bar',
      bar: 'baz',
      baz: 'bang'
    };
    app.visit('set', obj);
    assert.equal(app.get('foo'), 'bar');
    assert.equal(app.get('bar'), 'baz');
    assert.equal(app.get('baz'), 'bang');
  });

  it('should visit all properties on all objects in an array and call the specified method', function () {
    var app = new App();
    var arr = [
      {foo: 'bar', bar: 'baz', baz: 'bang'},
      {bang: 'boom', boom: 'beep'},
      {beep: 'boop', boop: 'bop'}
    ];
    app.visit('set', arr);
    assert.equal(app.get('foo'), 'bar');
    assert.equal(app.get('bar'), 'baz');
    assert.equal(app.get('baz'), 'bang');
    assert.equal(app.get('bang'), 'boom');
    assert.equal(app.get('boom'), 'beep');
    assert.equal(app.get('beep'), 'boop');
    assert.equal(app.get('boop'), 'bop');
  });

  it('should forward method from App to another object', function () {
    var app = new App();
    var obj = {};
    app.forward(obj, ['set', 'get']);
    obj.set('foo', 'bar');
    assert.equal(obj.get('foo'), 'bar');
    assert.equal(app.get('foo'), 'bar');
    assert.equal(app.foo, 'bar');
    assert.equal(obj.foo, null);
  });

  it('should mixin a function by adding it to the App prototype', function () {
    var app = new App();
    app.mixin('upper', function (prop) {
      var val = this.get(prop);
      if (typeof val === 'string') {
        return val.toUpperCase();
      }
      return val;
    });
    app.set('foo', 'bar');
    assert.equal(typeof app.upper, 'function');
    assert.equal(app.upper('foo'), 'BAR');

    var app2 = new App();
    app2.set('bar', 'baz');
    assert.equal(typeof app2.upper, 'function');
    assert.equal(app2.upper('bar'), 'BAZ');
  });
});


