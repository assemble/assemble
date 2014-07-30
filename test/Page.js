/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Loader = require('../lib/loader.js');
var assemble = require('..');

describe('Page', function () {
  beforeEach(function (cb) {
    assemble.init();
    cb();
  });

  describe('new Loader()', function () {
    it('should create a new instance of Loader', function () {
      var page = new Loader();
      should.exist(page);
      page.should.be.instanceOf(Loader);
    });
  });

  describe('assemble.page()', function () {
    it('should create a new instance of Page', function () {
      var page = assemble.page();
      should.exist(page);
      page.should.be.instanceOf(Loader);
    });
  });

  describe('.normalize()', function () {
    it('should normalize files to a new vinyl file object.', function () {
      var page = new Loader();
      var pages = page.normalize('test/fixtures/templates/no-helpers/*.hbs');

      console.log(pages)
    });
  });
});