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


describe('assemble config', function () {
  beforeEach(function() {
    assemble.init();
    assemble.omit('abcdefghijklmnopqrstuvwxyz'.split(''));
  });

  describe('.process()', function () {
    it('should resolve template strings in config values', function () {
      var config = assemble.process({a: '<%= b %>', b: 'c'});
      config.cache.a.should.equal('c')
    });

    it('should resolve es6 template strings in config values', function () {
      var config = assemble.process({a: '${b}', b: 'c'});
      config.cache.a.should.equal('c')
    });

    it('should recursively resolve template strings.', function () {
      var config = assemble.process({
        a: '${b}',
        b: '${c}',
        c: '${d}',
        d: '${e.f.g}',
        e: {f:{g:'h'}}});
      config.cache.a.should.equal('h');
    });

    describe('when functions are defined on the config', function() {
      it('should used them on config templates', function() {
	      assemble.data({upper: function(str) {
	        return str.toUpperCase();
	      }});
        assemble.data({fez: 'bang', pop: 'boom-pow!'});
        assemble.data({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        assemble.get('whistle').should.equal('BANG-BOOM-POW!');
      });
    });
  });
});