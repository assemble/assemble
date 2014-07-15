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


describe('assemble options', function () {
  describe('.option()', function () {
    describe('.set()', function () {
      it("should set options on `assemble.options`", function () {
        assemble.option.set('a', 'b');
        assemble.options.a.should.equal('b');
      });

      it("should set options objects on `assemble.options`", function () {
        assemble.option.set({d: 'e', f: 'g'});
        assemble.options.d.should.equal('e');
        assemble.options.f.should.equal('g');
      });
    });

    describe('.get()', function () {
      it("should get options", function () {
        assemble.option.set({d: 'e', f: 'g'});
        assemble.option.get('d').should.equal('e');
        assemble.option.get('f').should.equal('g');
      });
    });


    describe('.extend()', function () {
      it("should extend the options", function () {
        assemble.option.set({d: 'e', f: 'g'});
        assemble.option.get('d').should.equal('e');
        assemble.option.get('f').should.equal('g');
      });
    });
  });
});