/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('config process', function () {
  beforeEach(function() {
    assemble.clear();
    assemble.omit('abcdefghijklmnopqrstuvwxyz'.split(''));
  });

  describe('.process()', function () {
    it('should resolve template strings in config values', function () {
      var store = assemble.process({a: '<%= b %>', b: 'c'});
      store.a.should.equal('c');
    });

    it('should resolve es6 template strings in config values', function () {
      var store = assemble.process({a: '${b}', b: 'c'});
      store.a.should.equal('c');
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
        assemble.set({
          upper: function (str) {
            return str.toUpperCase();
          }
        });

        assemble.set({fez: 'bang', pop: 'boom-pow!'});
        assemble.set({whistle: '<%= upper(fez) %>-<%= upper(pop) %>'});
        assemble.get('whistle').should.equal('<%= upper(fez) %>-<%= upper(pop) %>');

        var a = assemble.process(assemble.get('whistle'), assemble.get());
        a.should.equal('BANG-BOOM-POW!');

        var b = assemble.process(assemble.get(), assemble.get());
        b.whistle.should.equal('BANG-BOOM-POW!');
      });
    });
  });
});
