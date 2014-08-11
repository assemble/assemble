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

xdescribe('assemble pages', function () {

  beforeEach(function () {
      assemble.init();
  });

  describe('.pages()', function () {

    it('should return a stream', function (done) {
      var stream = assemble.pages();
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    xit('should generate new files from pages', function () {
    });

  });

});
