/**!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');


describe('assemble options', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.createInst();
  });

  describe('.option()', function () {
    describe('.set()', function () {
      it('should set options on `site.options`', function () {
        site.option('a', 'b');
        site.options.a.should.equal('b');
      });

      it('should set options objects on `site.options`', function () {
        site.option({d: 'e', f: 'g'});
        site.options.d.should.equal('e');
        site.options.f.should.equal('g');
      });
    });

    describe('.get()', function () {
      it('should get options', function () {
        site.option({d: 'e', f: 'g'});
        site.option('d').should.equal('e');
        site.option('f').should.equal('g');
      });
    });

    describe('.extend()', function () {
      it('should extend the options', function () {
        site.option({d: 'e', f: 'g'});
        site.option('d').should.equal('e');
        site.option('f').should.equal('g');
      });
    });
  });
});
