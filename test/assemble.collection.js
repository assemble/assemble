/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var Assemble = require('..');
var assemble;
// var collections = require('../lib/plugins/collection');

describe('assemble collection', function () {
  beforeEach(function () {
    assemble = Assemble.init();
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
