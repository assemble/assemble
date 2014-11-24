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
      site.views.pages.should.be.empty;
      site.views.partials.should.be.empty;
      site.views.layouts.should.be.empty;
    });

    it('should prepopulate default engines.', function () {
      Object.keys(site.engines).length.should.equal(2);
    });
  });
});
