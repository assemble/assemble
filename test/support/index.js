'use strict';

var assert = module.exports = require('assert');
require('should');

assert.containEql = function containEql(actual, expected) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    while (len--) {
      assert.containEql(actual[len], expected[len]);
    }
  } else {
    for (var key in expected) {
      assert.deepEqual(actual[key], expected[key]);
    }
  }
};
