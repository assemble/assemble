/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Page = require('../lib/loader.js');
var assemble = require('..');

describe('Page', function () {
  beforeEach(function (cb) {
    assemble.init();
    cb();
  });

  describe('new Page()', function () {
    it('should create a new instance of Page', function () {
      var page = new Page();
      should.exist(page);
      page.should.be.instanceOf(Page);
    });
  });

  describe('assemble.page()', function () {
    it('should create a new instance of Page', function () {
      var page = assemble.page();
      should.exist(page);
      page.should.be.instanceOf(Page);
    });
  });

  describe('.normalize()', function () {
    it('should normalize files to a new vinyl file object.', function () {
      var page = new Page();
      var pages = page.normalize('test/fixtures/templates/no-helpers/*.hbs');

      console.log(pages)
    });
  });
});