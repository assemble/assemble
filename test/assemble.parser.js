/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble parser', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.create();
  });

  describe('.parser()', function () {
    it('should add a parser to the stack for a given extension.', function () {
      site.init();

      // reset the parser stack
      site.cache.parsers = {};

      site.parser('txt', function() {});
      site.get('parsers.txt').length.should.equal(1);

      site.parser('txt', function() {});
      site.get('parsers.txt').length.should.equal(2);

      site.parser('txt', function() {});
      site.get('parsers.txt').length.should.equal(3);

      // Add two more parsers
      site.parser('hbs', function() {});
      site.parser('css', function() {});

      Object.keys(site.get('parsers')).length.should.equal(3);
    });
  });
});