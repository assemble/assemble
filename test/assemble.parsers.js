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

describe('assemble parsers', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.createInst();
  });

  describe('.parsers()', function () {
    it('should load parsers from files onto a parser stack for a given extension.', function () {
      site.init();

      // reset the parser stack
      site.cache.parsers = {};

      site.parsers('txt', __dirname + '/fixtures/parsers/a.js');
      site.get('parsers.txt').length.should.equal(1);

      site.parsers('txt', __dirname + '/fixtures/parsers/b.js');
      site.get('parsers.txt').length.should.equal(2);

      site.parsers('txt', __dirname + '/fixtures/parsers/c.js');
      site.get('parsers.txt').length.should.equal(3);

      // Add two more parsers
      site.parsers('hbs', __dirname + '/fixtures/parsers/*.js');
      site.parsers('css', __dirname + '/fixtures/parsers/*.js');

      Object.keys(site.get('parsers')).length.should.equal(3);
    });
  });
});
