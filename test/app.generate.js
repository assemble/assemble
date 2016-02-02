'use strict';

require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.generate', function() {
  beforeEach(function() {
    app = new App();
  });

  describe('app.generate', function() {
    it('should expose a generate method on app', function() {
      // assert.equal(typeof app.generate, 'function');
    });
  });
});

