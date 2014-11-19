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
      site = assemble.createInst();
    });

    it('should set a layout engine when setting a template engine', function () {
      var handlebars = require('consolidate').handlebars;
      site.engine('hbs', handlebars);
      should.exist(site.layoutSettings['.hbs']);
    });
  });
});
