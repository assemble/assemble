/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('assemble init', function () {
  describe('.template()', function () {
    var site = null;
    beforeEach(function () {
      site = assemble.create();
    });

    it('should create new template type methods on Assemble.prototype.', function () {
      site.template('monkey', 'monkies');
      should.exist(site.monkey);
      should.exist(site.monkies);
      should.exist(site.cache.monkies);
    });

    it('should create new template type methods on Assemble.prototype for layout types.', function () {
      site.template('lion', 'lions', {isLayout: true});
      should.exist(site.lion);
      should.exist(site.lions);
      should.exist(site.cache.lions);
    });

    it('should load new templates add store them on the cache for the custom template type.', function () {
      site.template('doowb', 'doowbs');
      site.doowb({
        name: 'brian',
        data: {
          first: 'Brian'
        },
        content: '---\nlast: Woodward\n---\nHi this is {{first}} {{last}}'
      });

      should.exist(site.cache.doowbs.brian);
      site.cache.doowbs.brian.contents.toString().should.equal('Hi this is {{first}} {{last}}');
      site.cache.doowbs.brian.original.toString().should.equal('---\nlast: Woodward\n---\nHi this is {{first}} {{last}}');
      should.exist(site.cache.doowbs.brian.data.first);
      should.exist(site.cache.doowbs.brian.data.last);
    });

    it('should load new templates add store them on the cache for the custom template type as layouts.', function () {
      site.template('jon', 'jons', {isLayout: true});
      site.jon({
        name: 'jon',
        data: {
          first: 'Jon',
          ext: '.hbs'
        },
        content: '---\nlast: Schlinkert\n---\nHi this is {{first}} {{last}}'
      });

      should.exist(site.cache.jons.jon);
      site.cache.jons.jon.contents.toString().should.equal('Hi this is {{first}} {{last}}');
      site.cache.jons.jon.original.toString().should.equal('---\nlast: Schlinkert\n---\nHi this is {{first}} {{last}}');
      should.exist(site.cache.jons.jon.data.first);
      should.exist(site.cache.jons.jon.data.last);
      should.exist(site.layoutEngines['.hbs'].cache.jon);
    });

    it('should store template context in the context manager for the correct type.', function () {
      site.template('foo', 'foos', {isLayout: true});
      site.foo({
        name: 'bar',
        data: {
          beep: 'boop',
          ext: '.hbs'
        },
        content: '---\nbang: baz\n---\nSome things {{beep}} {{bang}}.'
      });

      should.exist(site.context.ctx.foos);
      var context = site.context.get('foos');
      context.should.have.property('bar');
      context.bar.should.have.property('beep');
      context.bar.should.have.property('bang');
      context.bar.beep.should.equal('boop');
      context.bar.bang.should.equal('baz');
    });

  });
});




