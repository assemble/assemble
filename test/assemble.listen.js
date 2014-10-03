/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble listen', function() {
  var site = null;
  beforeEach(function () {
    site = assemble.createInst();
  });

  describe('.listen()', function() {
    it('should expand and process options when added', function() {
      site.data({ foo: 'bar' });
      site.option({ baz: '<%= foo %>' });
      site.get('data').foo.should.equal('bar');
      site.get('data').baz.should.equal('bar');
      site.option('baz').should.equal('<%= foo %>');
    });

    it('should expand and process options.data when added', function() {
      site.data({ foo: 'bar' });
      site.option({ data: { baz: '<%= foo %>' } });
      site.get('data').foo.should.equal('bar');
      site.get('data').baz.should.equal('bar');
      site.option('data').should.eql({ baz: '<%= foo %>' });
    });
  });

});
