/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble init', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.init();
  });

  describe('.init()', function () {
    it('should re-initialize all values', function () {
      site.views.pages.should.be.empty;
      site.views.partials.should.be.empty;
      site.views.layouts.should.be.empty;
    });

    it('should prepopulate default engines.', function () {
      site.engines.should.have.property('.hbs');
    });
  });
});
