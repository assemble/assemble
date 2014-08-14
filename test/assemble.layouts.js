/**
 * Assemble <http://assemble.io>
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
var Assemble = require('..');

var actual = __dirname + '/layouts-actual';


describe('assemble layouts', function () {
  var assemble = null;
  beforeEach(function (done) {
    assemble = Assemble.create();
    rimraf(actual, done);
  });
  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.layout()', function () {
    it('should be a method on assemble.', function () {
      assemble.layout.should.be.a.function;
    });

    it('should cache a layout defined as an object.', function () {
      assemble.layout({
        name: 'test-layout-a',
        data: {title: 'test-layout-a'},
        content: 'Test layout A content'
      });

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('test-layout-a');
    });
  });

  describe('.layouts()', function () {
    it('should be a method on assemble.', function () {
      assemble.layouts.should.be.a.function;
    });

    it('should return an empty array..', function () {
      assemble.layouts().should.be.empty;
    });

    it('should cache an array of layouts defined as objects.', function () {
      assemble.layouts([
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

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as objects.', function () {
      assemble.layouts({
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

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as a string of glob patterns.', function () {
      assemble.layouts('test/fixtures/templates/layouts/*.hbs');

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('a');
      layouts.should.have.property('b');
      layouts.should.have.property('c');
    });
  });
});
