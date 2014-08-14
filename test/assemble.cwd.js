/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var isAbsolute = require('is-absolute');
var Assemble = require('..');

describe('assemble cwd', function () {

  var assemble = null;
  beforeEach(function () {
      assemble = Assemble.create();
  });

  describe('.cwd()', function () {
    it('should return the cwd', function () {
      assemble.cwd().toLowerCase().should.equal(process.cwd().toLowerCase());
    });

    it('should return the cwd with appended arguments', function () {
      var expected = path.join(process.cwd(), 'path/to/something');
      assemble.cwd('path', 'to', 'something').should.equal(expected);
    });
    it('should return the modified cwd with appended arguments', function () {
      var expected = path.join(process.cwd(), 'test/fixtures/templates/pages');
      assemble.set('cwd', process.cwd() + '/test/fixtures');
      isAbsolute(assemble.get('cwd')).should.be.true;
      assemble.cwd('templates', 'pages').should.equal(expected);
    });
  });
});