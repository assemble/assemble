/**
 * Assemble <http://site.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var isAbsolute = require('is-absolute');
var assemble = require('..');

describe('assemble cwd', function () {

  var site = null;
  beforeEach(function () {
      site = assemble.create();
  });

  describe('.cwd()', function () {
    it('should return the cwd', function () {
      site.cwd().toLowerCase().should.equal(process.cwd().toLowerCase());
    });

    it('should return the cwd with appended arguments', function () {
      var expected = path.join(process.cwd(), 'path/to/something');
      site.cwd('path', 'to', 'something').should.equal(expected);
    });
    it('should return the modified cwd with appended arguments', function () {
      var expected = path.join(process.cwd(), 'test/fixtures/templates/pages');
      site.set('cwd', process.cwd() + '/test/fixtures');
      isAbsolute(site.get('cwd')).should.be.true;
      site.cwd('templates', 'pages').should.equal(expected);
    });
  });
});