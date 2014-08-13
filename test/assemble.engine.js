/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('assemble engines', function () {
  describe('.engine()', function () {

    beforeEach(function () {
      assemble.init();
    });

    it('should set an engine with the given extension', function () {
      var handlebars = require('../lib/engine/handlebars');
      assemble.engine('hbs', handlebars);
      should.exist(assemble.engines['.hbs']);
      should.exist(assemble.engines['.hbs'].renderFile);
      should.exist(assemble.engines['.hbs'].render);
    });

    it('should set a lazy layout engine when setting an engine', function () {
      var handlebars = require('../lib/engine/handlebars');
      assemble.engine('hbs', handlebars);
      should.exist(assemble.layoutSettings['.hbs']);
    });
  });
});
