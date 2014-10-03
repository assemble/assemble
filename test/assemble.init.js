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

describe('assemble init', function () {

  var site = null;
  beforeEach(function() {
    site = assemble.createInst();
  });

  describe('.init()', function () {
    it('should re-initialize all values', function () {
      site.init();

      site.cache.pages.should.be.empty;
      site.cache.partials.should.be.empty;
      site.cache.layouts.should.be.empty;
      site.cache.helpers.should.be.empty;
      site.cache.locals.should.be.empty;
      site.cache.imports.should.be.empty;
    });

    it('should prepopulate default engines.', function () {
      site.init();
      Object.keys(site.engines).length.should.equal(4);
    });
  });
});
