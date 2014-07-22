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
var Page = require('../lib/view/page');

describe('assemble page', function () {

  describe('.page()', function () {
    it('should create a new instance of Page', function () {
      assemble.init();
      var page = assemble.page();
      should.exist(page);
      page.should.be.instanceOf(Page);
    });
  });

});