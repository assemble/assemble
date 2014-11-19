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
    site = assemble.createInst();
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
        path: 'test-layout-a',
        data: {title: 'test-layout-a'},
        content: 'Test layout A content',
        ext: '.hbs'
      });

      var layouts = site.views.layouts;
      layouts.should.have.property('test-layout-a');
    });
  });

  describe('.layouts()', function () {
    it('should be a method on site.', function () {
      site.layouts.should.be.a.function;
    });

    it('should return an empty array..', function () {
      site.views.layouts.should.be.empty;
    });

    it('should cache an object of layouts defined as objects.', function () {
      site.layouts({
        'test-layout-a': {
          data: {title: 'test-layout-a'},
          content: 'Test layout A content',
          ext: '.hbs'
        },
        'test-layout-b': {
          data: {title: 'test-layout-b'},
          content: 'Test layout B content',
          ext: '.hbs'
        },
        'test-layout-c': {
          data: {title: 'test-layout-c'},
          content: 'Test layout C content',
          ext: '.hbs'
        }
      });

      var layouts = site.views.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as a string of glob patterns.', function () {
      site.layouts('test/fixtures/templates/layouts/*.hbs');

      var layouts = site.views.layouts;
      layouts.should.have.property('a');
      layouts.should.have.property('b');
      layouts.should.have.property('c');
    });
  });
});
