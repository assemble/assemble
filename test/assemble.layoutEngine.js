/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var Layouts = require('layouts');
var assemble = require('..');


describe('assemble layout engines', function () {
  describe('.layoutEngine()', function () {

    var site = null;
    beforeEach(function () {
      site = assemble.create();
    });

    it('should set a layout engine with the given extension', function () {
      var engine = new Layouts();
      site.layoutEngine('hbs', engine);
      should.exist(site.layoutSettings['.hbs']);
      should.exist(site.layoutSettings['.hbs'].inject);
    });

    it('should set a layout engine using options', function () {
      site.layoutEngine('md', {layoutDelims: ['{%', '%}']});
      should.exist(site.layoutSettings['.md']);
      should.exist(site.layoutSettings['.md'].inject);
      site.layoutSettings['.md'].cache.delims.should.eql(['{%', '%}']);
    });

    it('should set a layout engine when setting a template engine', function () {
      var handlebars = require('../lib/engine/handlebars');
      site.engine('hbs', handlebars);
      should.exist(site.layoutSettings['.hbs']);
    });
  });
});
