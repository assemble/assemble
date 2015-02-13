/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var Assemble = require('..');


describe('options', function () {
  describe('.options()', function () {
    var assemble = null;
    beforeEach(function () {
      assemble = Assemble.init();
    });
    it('should set an option', function () {
      assemble.option('foo', 'bar');
      assemble.options.foo.should.exist;
      assemble.options.foo.should.equal('bar');
    });
    it('should get an option', function () {
      assemble.option('foo', 'bar');
      assemble.option('foo').should.exist;
      assemble.option('foo').should.equal('bar');
    });
  });
});
