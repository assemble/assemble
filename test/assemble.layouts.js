/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var fs = require('graceful-fs');
var path = require('path');
var should = require('should');
var File = require('vinyl');
var rimraf = require('rimraf');
var assemble = require('..');

var actual = __dirname + '/layouts-actual';


describe('assemble layouts', function () {
  var site = null;
  beforeEach(function (done) {
    site = assemble.create();
    rimraf(actual, done);
  });
  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.layout()', function () {
    it('should be a method on site.', function () {
      site.layout.should.be.a.function;
    });

    it('should cache a layout defined as an object.', function () {
      site.layout({
        name: 'test-layout-a',
        data: {title: 'test-layout-a'},
        content: 'Test layout A content'
      });

      var layouts = site.cache.layouts;
      layouts.should.have.property('test-layout-a');
    });
  });

  describe('.layouts()', function () {
    it('should be a method on site.', function () {
      site.layouts.should.be.a.function;
    });

    it('should return an empty array..', function () {
      site.layouts().should.be.empty;
    });

    it('should cache an array of layouts defined as objects.', function () {
      site.layouts([
        {
          name: 'test-layout-a',
          data: {title: 'test-layout-a'},
          content: 'Test layout A content'
        },
        {
          name: 'test-layout-b',
          data: {title: 'test-layout-b'},
          content: 'Test layout B content'
        },
        {
          name: 'test-layout-c',
          data: {title: 'test-layout-c'},
          content: 'Test layout C content'
        }
      ]);

      var layouts = site.cache.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as objects.', function () {
      site.layouts({
        'test-layout-a': {
          data: {title: 'test-layout-a'},
          content: 'Test layout A content'
        },
        'test-layout-b': {
          data: {title: 'test-layout-b'},
          content: 'Test layout B content'
        },
        'test-layout-c': {
          data: {title: 'test-layout-c'},
          content: 'Test layout C content'
        }
      });

      var layouts = site.cache.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as a string of glob patterns.', function () {
      site.layouts('test/fixtures/templates/layouts/*.hbs');

      var layouts = site.cache.layouts;
      layouts.should.have.property('a');
      layouts.should.have.property('b');
      layouts.should.have.property('c');
    });
  });
});
