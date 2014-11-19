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
// var collections = require('../lib/plugins/collection');

describe('assemble collection', function () {

  var site = null;
  beforeEach(function () {
      site = assemble.createInst();
  });

  describe('.collection()', function () {

    xit('should return a stream', function (done) {
      var stream = collections.call(assemble, {});
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
