/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');


describe('assemble omit', function () {
  describe('.omit()', function () {

    it('should omit a value from the cache', function () {
      assemble.set('a', 'b');

      // property should be on the cache
      assemble.get('a').should.equal('b');
      assemble.omit('a');

      // property should not be on the cache
      assert(assemble.get('a') === undefined);
    });

    it('should omit an array of values from the cache', function () {
      assemble
      	.set('a', 'a')
      	.set('b', 'b')
      	.set('c', 'c')
      	.set('d', 'd');

      // properties should be on the cache
      assemble.get('a').should.equal('a');
      assemble.get('b').should.equal('b');
      assemble.get('c').should.equal('c');
      assemble.get('d').should.equal('d');

      assemble.omit(['a', 'b', 'c', 'd']);

      // properties should not be on the cache
      assert(assemble.get('a') === undefined);
      assert(assemble.get('b') === undefined);
      assert(assemble.get('c') === undefined);
      assert(assemble.get('d') === undefined);
    });

  });
});