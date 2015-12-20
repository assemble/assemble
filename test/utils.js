require('mocha');
require('should');
var assert = require('assert');
var utils = require('../lib/utils')

describe('utils', function () {
  describe('arrayify', function() {
    it('should return true if a value looks like a view:', function () {
      assert.deepEqual(utils.arrayify('str'), ['str']);
      assert.deepEqual(utils.arrayify(['str']), ['str']);
    });
  });
});

