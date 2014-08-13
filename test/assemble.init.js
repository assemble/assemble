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

      assemble.cache.pages.should.be.empty;
      assemble.cache.partials.should.be.empty;
      assemble.cache.layouts.should.be.empty;
      assemble.cache.helpers.should.be.empty;
      assemble.cache.locals.should.be.empty;
      assemble.cache.imports.should.be.empty;
    });

    it('should prepopulate default engines.', function () {
      assemble.init();
      Object.keys(assemble.engines).length.should.equal(3);
    });
  });
});
