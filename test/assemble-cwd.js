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

describe('assemble cwd', function () {

  beforeEach(function () {
      assemble.init();
  });

  describe('.cwd()', function () {
    it('should return the cwd', function () {
      assemble.cwd().should.equal(process.cwd());
    });
    it('should return the cwd with appended arguments', function () {
      assemble.cwd('path', 'to', 'something').should.equal(process.cwd() + '/path/to/something');
    });
    it('should return the modified cwd with appened arguments', function () {
      assemble.set('cwd', process.cwd() + '/test/fixtures');
      assemble.cwd('templates', 'pages').should.equal(process.cwd() + '/test/fixtures/templates/pages');
    });
  });

});