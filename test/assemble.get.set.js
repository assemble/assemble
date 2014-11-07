/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble cache', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.createInst();
  });

  describe('.set()', function () {
    it('should set a value', function () {
      site.set('a', 'b');
      site.get('a').should.equal('b');
    });

    it('should set properties on the `cache` object.', function () {
      site.set('a', 'b');
      site.cache.a.should.equal('b');
    });

    it('should allow an object to be set directly.', function () {
      site.set({x: 'y'});
      site.cache.x.should.equal('y');
      site.get('x').should.equal('y');
    });

    it('should set nested properties on the `cache` object.', function () {
      site.set('c', {d: 'e'});
      site.get('c').d.should.equal('e');
    });

    it('should use dot notation to `set` values.', function () {
      site.set('h.i', 'j');
      site.get('h').should.eql({i: 'j'});
    });

    it('should use dot notation to `get` values.', function () {
      site.set('h', {i: 'j'});
      site.get('h.i').should.equal('j');
    });

    it('should return `this` for chaining', function () {
      site.set('a', 'b').should.equal(site);
      site
        .set('aa', 'bb')
        .set('bb', 'cc')
        .set('cc', 'dd');
      site.get('aa').should.equal('bb');
      site.get('bb').should.equal('cc');
      site.get('cc').should.equal('dd');
    });

    it('should expand template strings in the config.', function () {
      site
        .set('l', 'm')
        .set('j', {k: '${l}'}, true);
      site.cache.j.k.should.eql('m');
      site.get('j.k').should.eql('m');
    });

    it('should return undefined when not set', function () {
      site.set('a', undefined).should.equal(site);
    });
  });

  describe('.get()', function () {
    it('should return undefined when no set', function () {
      assert(site.option('a') === undefined);
    });

    it('should otherwise return the value', function () {
      site.set('a', 'b');
      site.get('a').should.equal('b');
    });
  });


  describe('.exists()', function () {
    it('should return `false` when not set', function () {
      site.exists('alsjls').should.be.false;
    });

    it('should return `true` when set.', function () {
      site.set('baba', 'zz');
      site.exists('baba').should.be.ok;
    });
  });

  describe('.enable()', function () {
    it('should set the value to true', function () {
      site.enable('foo').should.equal(site);
      site.option('foo').should.be.ok;
    });
  });

  describe('.disable()', function () {
    it('should set the value to false', function () {
      site.disable('foo').should.equal(site);
      site.option('foo').should.be.false;
    });
  });

  describe('.enabled()', function () {
    it('should default to false', function () {
      site.enabled('xyz').should.be.false;
    });

    it('should return true when set', function () {
      site.option('a', 'b');
      site.enabled('a').should.be.ok;
    });
  });

  describe('.disabled()', function () {
    it('should default to true', function () {
      site.disabled('xyz').should.be.ok;
    });

    it('should return false when set', function () {
      site.option('abc', 'xyz');
      site.disabled('abc').should.be.false;
    });
  });
});