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


describe('config process', function () {
  beforeEach(function() {
    assemble.init();
  });

  describe('.process()', function () {
    it('should resolve template strings in config values', function () {
      var store = assemble.process({a: '<%= b %>', b: 'c'});
      store.a.should.equal('c')
    });

    it('should resolve es6 template strings in config values', function () {
      var store = assemble.process({a: '${b}', b: 'c'});
      store.a.should.equal('c')
    });

    it('should recursively resolve template strings.', function () {
      var store = assemble.process({
        a: '${b}',
        b: '${c}',
        c: '${d}',
        d: '${e.f.g}',
        e: {f:{g:'h'}}});
      store.a.should.equal('h');
    });

    describe('when functions are defined on the config', function() {
      it('should used them on config templates', function() {
        assemble.data({
          upper: function (str) {
            return str.toUpperCase();
          }
        });

        assemble.data({fez: 'bang', pop: 'boom-pow!'});
        assemble.data({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        assemble.get('data.whistle').should.equal('<%= upper(fez) %>-<%= upper(pop) %>');

        var a = assemble.process(assemble.get('data.whistle'), assemble.get('data'));
        a.should.equal('BANG-BOOM-POW!');

        var b = assemble.process(assemble.get('data'), assemble.get('data'));
        b.whistle.should.equal('BANG-BOOM-POW!');
      });
    });
  });
});