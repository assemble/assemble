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

var actual = __dirname + '/partials-actual';


describe('assemble partials', function () {
  var site = null;
  beforeEach(function (done) {
    site = assemble.createInst();
    rimraf(actual, done);
  });
  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.partial()', function () {
    it('should be a method on site.', function () {
      site.partial.should.be.a.function;
    });

    it('should cache a partial defined as an object.', function () {
      site.partial({
        path: 'test-partial-a',
        data: {title: 'test-partial-a'},
        content: 'Test partial A content'
      });

      var partials = site.views.partials;
      partials.should.have.property('test-partial-a');
    });
  });

  describe('.partials()', function () {
    it('should be a method on site.', function () {
      site.partials.should.be.a.function;
    });

    it('should cache an object of partials defined as objects.', function () {
      site.partials({
        'test-partial-a': {
          data: {title: 'test-partial-a'},
          content: 'Test partial A content'
        },
        'test-partial-b': {
          data: {title: 'test-partial-b'},
          content: 'Test partial B content'
        },
        'test-partial-c': {
          data: {title: 'test-partial-c'},
          content: 'Test partial C content'
        }
      });

      var partials = site.views.partials;
      partials.should.have.property('test-partial-a');
      partials.should.have.property('test-partial-b');
      partials.should.have.property('test-partial-c');
    });

    it('should cache an object of partials defined as a string of glob patterns.', function () {

      site.partials('test/fixtures/templates/partials/*.hbs');
      var partials = site.views.partials;
      partials.should.have.property('a');
      partials.should.have.property('b');
      partials.should.have.property('c');
    });

    xit('should use a renaming function on the partial names.', function () {
      // todo
    });
  });
});
