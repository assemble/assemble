'use strict';

require('mocha');
var assert = require('assert');
var App = require('..');
var app;

describe('app.cli', function() {
  beforeEach(function() {
    app = new App();
  });

  describe('app.cli.map', function() {
    it('should add a property to app.cli', function() {
      app.cli.map('abc', function() {});
      assert.equal(app.cli.keys.pop(), 'abc');
    });
  });
});

