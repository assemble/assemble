/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var rimraf = require('rimraf');
var Assemble = require('..');

var actual = __dirname + '/partials-actual';

describe('assemble partials', function () {
  var assemble = null;
  beforeEach(function (done) {
    assemble = Assemble.init();
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
        path: 'test-partial-a',
        data: {title: 'test-partial-a'},
        content: 'Test partial A content'
      });

      var partials = assemble.views.partials;
      partials.should.have.property('test-partial-a');
    });
  });

  describe('.partials()', function () {
    it('should be a method on assemble.', function () {
      assemble.partials.should.be.a.function;
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

      var partials = assemble.views.partials;
      partials.should.have.property('test-partial-a');
      partials.should.have.property('test-partial-b');
      partials.should.have.property('test-partial-c');
    });

    it('should cache an object of partials defined as a string of glob patterns.', function () {
      assemble.partials('test/fixtures/templates/partials/*.hbs');
      var partials = assemble.views.partials;
      partials.should.have.property('a');
      partials.should.have.property('b');
      partials.should.have.property('c');
    });

    it('should use a renaming function on the partial names.', function () {
      assemble.partials('test/fixtures/templates/partials/*.hbs');
      assemble.option({
        name: function (fp) {
          return fp;
        }
      });
      var partials = assemble.views.partials;
      partials.should.have.property('a');
      partials.should.have.property('b');
      partials.should.have.property('c');
    });
  });
});
