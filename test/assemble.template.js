/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('assemble.template', function () {
  describe('.init()', function () {
    var site = null;
    beforeEach(function () {
      site = assemble.init();
    });

    it('should create new template type methods on Assemble.prototype.', function () {
      site.create('monkey', 'monkies');
      should.exist(site.monkey);
      should.exist(site.monkies);
      should.exist(site.views.monkies);
    });

    it('should create new template type methods on Assemble.prototype for layout types.', function () {
      site.create('lion', 'lions', {isLayout: true});
      should.exist(site.lion);
      should.exist(site.lions);
      should.exist(site.views.lions);
    });

    it('should load new templates add store them on the cache for the custom template type.', function () {
      site.create('doowb', 'doowbs');
      site.doowb({path: 'brian', data: {first: 'Brian'}, content: '---\nlast: Woodward\n---\nHi this is {{first}} {{last}}'});

      should.exist(site.views.doowbs.brian);
      site.views.doowbs.brian.content.should.equal('Hi this is {{first}} {{last}}');
      site.views.doowbs.brian.orig.should.equal('---\nlast: Woodward\n---\nHi this is {{first}} {{last}}');
      should.exist(site.views.doowbs.brian.data.first);
      should.exist(site.views.doowbs.brian.data.last);
    });

    it('should load new templates add store them on the cache for the custom template type as layouts.', function () {
      site.create('jon', 'jons', {isLayout: true, ext: '.hbs'});
      site.jon({path: 'jon', data: {first: 'Jon'}, options: {ext: '.hbs'}, content: '---\nlast: Schlinkert\n---\nHi this is {{first}} {{last}}'});

      should.exist(site.views.jons.jon);
      site.views.jons.jon.content.should.equal('Hi this is {{first}} {{last}}');
      site.views.jons.jon.orig.should.equal('---\nlast: Schlinkert\n---\nHi this is {{first}} {{last}}');
      should.exist(site.views.jons.jon.data.first);
      should.exist(site.views.jons.jon.data.last);
    });
  });
});
