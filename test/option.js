/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('options', function () {
  describe('.options()', function () {
    var site = null;
    beforeEach(function () {
      site = assemble.createInst();
    })
    it('should set an option', function () {
      site.option('foo', 'bar');
      site.options.foo.should.exist;
      site.options.foo.should.equal('bar');
    });
    it('should get an option', function () {
      site.option('foo', 'bar');
      site.option('foo').should.exist;
      site.option('foo').should.equal('bar');
    });
  });
});