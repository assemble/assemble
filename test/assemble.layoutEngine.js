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
      should.exist(site.layoutEngines['.hbs']);
      should.exist(site.layoutEngines['.hbs'].render);
    });

    it('should set a layout engine using options', function () {
      site.layoutEngine('md', {layoutDelims: ['{%', '%}']});
      should.exist(site.layoutEngines['.md']);
      should.exist(site.layoutEngines['.md'].render);
      site.layoutEngines['.md'].cache.delims.should.eql(['{%', '%}']);
    });

    it('should set a layout engine when setting a template engine', function () {
      var handlebars = require('../lib/engine/handlebars');
      site.engine('hbs', handlebars);
      should.exist(site.layoutEngines['.hbs']);
    });
  });
});
