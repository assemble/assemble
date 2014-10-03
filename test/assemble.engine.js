/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('assemble engines', function () {
  describe('.engine()', function () {

    var site = null;
    beforeEach(function () {
      site = assemble.createInst();
    });

    it('should set an engine with the given extension', function () {
      var handlebars = require('../lib/engine/handlebars');
      site.engine('hbs', handlebars);
      should.exist(site.engines['.hbs']);
      should.exist(site.engines['.hbs'].renderFile);
      should.exist(site.engines['.hbs'].render);
    });

    it('should lazily set a layout engine when setting a template engine', function () {
      var handlebars = require('../lib/engine/handlebars');
      site.engine('hbs', handlebars);
      should.exist(site.layoutSettings['.hbs']);
    });
  });
});
