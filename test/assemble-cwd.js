/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var assert = require('assert');
var should = require('should');
var normalize = require('normalize-path');
var assemble = require('..');

describe('assemble cwd', function () {

  beforeEach(function () {
      assemble.init();
  });

  describe('.cwd()', function () {
    it('should return the cwd', function () {
      assemble.cwd().should.equal(normalize(process.cwd()));
    });
    it('should return the cwd with appended arguments', function () {
      var expected = normalize(path.join(process.cwd(), 'path/to/something'));
      assemble.cwd('path', 'to', 'something').should.equal(expected);
    });
    it('should return the modified cwd with appended arguments', function () {
      var expected = normalize(path.join(process.cwd(), 'test/fixtures/templates/pages'));
      assemble.set('cwd', process.cwd() + '/test/fixtures');
      assemble.cwd('templates', 'pages').should.equal(expected);
    });
  });
});