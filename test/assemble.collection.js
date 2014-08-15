/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble collection', function () {

  var site = null;
  beforeEach(function () {
      site = assemble.create();
  });

  describe('.collection()', function () {

    it('should return a stream', function (done) {
      var stream = site.collection();
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    xit('should generate index pages', function () {
    });

    xit('should generate related pages', function () {
    });

  });

});
