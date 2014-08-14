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
var assemble = require('..');

var actual = __dirname + '/partials-actual';


describe('assemble partials', function () {
  beforeEach(function (done) {
    assemble.init();
    rimraf(actual, done);
  });
  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.partial()', function () {
    it('should be a method on assemble.', function () {
      assemble.partial.should.be.a.function;
    });

    it('should cache a partial defined as an object.', function () {
      assemble.partial({
        name: 'test-partial-a',
        data: {title: 'test-partial-a'},
        content: 'Test partial A content'
      });

      var partials = assemble.cache.partials;
      partials.should.have.property('test-partial-a');
    });
  });

  xdescribe('options partials', function () {
    it('should be a method on assemble.', function () {
      // assemble.option('partials', ['test/fixtures/templates/partials/*.hbs']);
      assemble.partial.should.be.a.function;
    });
  });

  describe('.partials()', function () {
    it('should be a method on assemble.', function () {
      assemble.partials.should.be.a.function;
    });

    it('should return an empty array..', function () {
      assemble.partials().should.be.empty;
    });

    it('should cache an array of partials defined as objects.', function () {
      assemble.partials([
        {
          name: 'test-partial-a',
          data: {title: 'test-partial-a'},
          content: 'Test partial A content'
        },
        {
          name: 'test-partial-b',
          data: {title: 'test-partial-b'},
          content: 'Test partial B content'
        },
        {
          name: 'test-partial-c',
          data: {title: 'test-partial-c'},
          content: 'Test partial C content'
        }
      ]);

      var partials = assemble.cache.partials;
      partials.should.have.property('test-partial-a');
      partials.should.have.property('test-partial-b');
      partials.should.have.property('test-partial-c');
    });

    it('should cache an object of partials defined as objects.', function () {
      assemble.partials({
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

      var partials = assemble.cache.partials;
      partials.should.have.property('test-partial-a');
      partials.should.have.property('test-partial-b');
      partials.should.have.property('test-partial-c');
    });

    it('should cache an object of partials defined as a string of glob patterns.', function () {

      assemble.partials('test/fixtures/templates/partials/*.hbs');
      var partials = assemble.cache.partials;
      partials.should.have.property('a');
      partials.should.have.property('b');
      partials.should.have.property('c');
    });

    it('should add the partial data to the context manager', function () {
      assemble.partials({
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

      var context = assemble.context.get('partials');
      context.should.have.property('test-partial-a');
      context.should.have.property('test-partial-b');
      context.should.have.property('test-partial-c');
    });

    xit('should use a renaming function on the partial names.', function () {
      // todo
    });
  });
});
