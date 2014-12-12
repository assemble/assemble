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
var app;
// var collections = require('../lib/plugins/collection');

describe('assemble collection', function () {
  beforeEach(function () {
    app = assemble.init();
  });

  describe('.collection()', function () {
    it.skip('should return a stream', function (done) {
      var stream = collections.call(assemble, {});
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    it.skip('should generate index pages', function () {});
    it.skip('should generate related pages', function () {});
  });
});
