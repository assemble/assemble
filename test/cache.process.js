/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var Config = require('config-cache');
var config = new Config();


describe('config process', function () {
  beforeEach(function() {
    config.clear();
    config.omit('abcdefghijklmnopqrstuvwxyz'.split(''));
  });

  describe('.process()', function () {
    it('should resolve template strings in config values', function () {
      var store = config.process({a: '<%= b %>', b: 'c'});
      store.a.should.equal('c')
    });

    it('should resolve es6 template strings in config values', function () {
      var store = config.process({a: '${b}', b: 'c'});
      store.a.should.equal('c')
    });

    it('should recursively resolve template strings.', function () {
      var store = config.process({
        a: '${b}',
        b: '${c}',
        c: '${d}',
        d: '${e.f.g}',
        e: {f:{g:'h'}}});
      store.a.should.equal('h');
    });

    describe('when functions are defined on the config', function() {
      it('should used them on config templates', function() {
        config.set({
          upper: function (str) {
            return str.toUpperCase();
          }
        });

        config.set({fez: 'bang', pop: 'boom-pow!'});
        config.set({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        config.get('whistle').should.equal('<%= upper(fez) %>-<%= upper(pop) %>');

        var a = config.process(config.get('whistle'), config.get());
        a.should.equal('BANG-BOOM-POW!');

        var b = config.process(config.get(), config.get());
        b.whistle.should.equal('BANG-BOOM-POW!');
      });
    });
  });
});