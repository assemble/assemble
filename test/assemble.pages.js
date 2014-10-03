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

describe('assemble pages', function () {

  var site = null;
  beforeEach(function () {
    site = assemble.createInst();
  });

  describe('.pages()', function () {

    xit('should return a stream', function (done) {
      var stream = site.pages();
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    xit('should generate new files from pages', function () {
    });

  });

});
