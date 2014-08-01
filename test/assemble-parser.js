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

describe('assemble parser', function () {
  describe('.parser()', function () {
    it('should add a parser to the stack for a given extension.', function () {
      assemble.init();

      // reset the parser stack
      assemble.cache.parsers = {};

      assemble.parser('txt', function() {});
      assemble.get('parsers.txt').length.should.equal(1);

      assemble.parser('txt', function() {});
      assemble.get('parsers.txt').length.should.equal(2);

      assemble.parser('txt', function() {});
      assemble.get('parsers.txt').length.should.equal(3);

      // Add two more parsers
      assemble.parser('hbs', function() {});
      assemble.parser('css', function() {});

      Object.keys(assemble.get('parsers')).length.should.equal(3);
    });
  });
});