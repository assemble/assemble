/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('data', function () {
  describe('.data()', function () {
    var site = null;
    beforeEach(function () {
      site = assemble.init();
    });
    it('should add data', function () {
      site.data({ foo: 'bar' });
      site.cache.data.foo.should.exist;
      site.cache.data.foo.should.equal('bar');
    });
  });
});
