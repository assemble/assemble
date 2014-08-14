/**
 * Assemble <http://site.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble buffer', function () {
  var site = null;
  beforeEach(function () {
    site = assemble.create();
  });

  describe('.buffer()', function () {
    it('should return a stream', function (done) {
      var stream = site.buffer();
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    xit('should buffer files', function () {
    });
  });
});