'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var View = App.View;
var view;

describe('view.isType', function() {
  beforeEach(function() {
    view = new View();
  });

  it('should expose thie "isType" method', function() {
    assert.equal(typeof view.isType, 'function');
  });

  it('should return true if a view is the given "type"', function() {
    assert(view.isType('renderable'));
  });

  it('should return false if a view is not the given "type"', function() {
    assert(!view.isType('partial'));
  });
});
