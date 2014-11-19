/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('data', function () {
  describe('.data()', function () {
    var site = null;
    beforeEach(function () {
      site = assemble.createInst();
    });
    it('should add data', function () {
      site.data({ foo: 'bar' });
      site.cache.data.foo.should.exist;
      site.cache.data.foo.should.equal('bar');
    });
  });
});