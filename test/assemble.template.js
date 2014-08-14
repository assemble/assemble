/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var Assemble = require('..');


describe('assemble init', function () {
  describe('.template()', function () {
    var assemble = null;
    beforeEach(function () {
      assemble = Assemble.create();
    });

    it('should create new template type methods on Assemble.prototype.', function () {
      assemble.template('monkey', {plural: 'monkies'});
      should.exist(assemble.monkey);
      should.exist(assemble.monkies);
      should.exist(assemble.cache.monkies);
    });

    it('should create new template type methods on Assemble.prototype for layout types.', function () {
      assemble.template('lion', {plural: 'lions', isLayout: true});
      should.exist(assemble.lion);
      should.exist(assemble.lions);
      should.exist(assemble.cache.lions);
    });

    it('should load new templates add store them on the cache for the custom template type.', function () {
      assemble.template('doowb', {plural: 'doowbs'});
      assemble.doowb({
        name: 'brian',
        data: {
          first: 'Brian'
        },
        content: '---\nlast: Woodward\n---\nHi this is {{first}} {{last}}'
      });

      should.exist(assemble.cache.doowbs.brian);
      assemble.cache.doowbs.brian.contents.toString().should.equal('Hi this is {{first}} {{last}}');
      assemble.cache.doowbs.brian.original.toString().should.equal('---\nlast: Woodward\n---\nHi this is {{first}} {{last}}');
      should.exist(assemble.cache.doowbs.brian.data.first);
      should.exist(assemble.cache.doowbs.brian.data.last);
    });

    it('should load new templates add store them on the cache for the custom template type as layouts.', function () {
      assemble.template('jon', {plural: 'jons', isLayout: true});
      assemble.jon({
        name: 'jon',
        data: {
          first: 'Jon',
          ext: '.hbs'
        },
        content: '---\nlast: Schlinkert\n---\nHi this is {{first}} {{last}}'
      });

      should.exist(assemble.cache.jons.jon);
      assemble.cache.jons.jon.contents.toString().should.equal('Hi this is {{first}} {{last}}');
      assemble.cache.jons.jon.original.toString().should.equal('---\nlast: Schlinkert\n---\nHi this is {{first}} {{last}}');
      should.exist(assemble.cache.jons.jon.data.first);
      should.exist(assemble.cache.jons.jon.data.last);
      should.exist(assemble.layoutSettings['.hbs'].cache.jon);
    });

    it('should store template context in the context manager for the correct type.', function () {
      assemble.template('foo', {plural: 'foos', isLayout: true});
      assemble.foo({
        name: 'bar',
        data: {
          beep: 'boop',
          ext: '.hbs'
        },
        content: '---\nbang: baz\n---\nSome things {{beep}} {{bang}}.'
      });

      should.exist(assemble.context.ctx.foos);
      var context = assemble.context.get('foos');
      context.should.have.property('bar');
      context.bar.should.have.property('beep');
      context.bar.should.have.property('bang');
      context.bar.beep.should.equal('boop');
      context.bar.bang.should.equal('baz');
    });

  });
});




