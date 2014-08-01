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

describe('assemble init', function () {

  describe('.init()', function () {
    it('should re-initialize all values', function () {
      assemble.init();
      assemble.middleware.should.be.empty;
      assemble.plugins.should.be.empty;
      assemble.locals.should.be.empty;
      assemble.files.length.should.equal(0);
      assemble.files.cache.should.be.empty;
    });

    it('should prepopulate default engines.', function () {
      assemble.init();
      Object.keys(assemble.engines).length.should.equal(3);
    });
  });
});