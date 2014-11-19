/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');
var consolidate = require('consolidate');


describe('assemble engines', function () {
  describe('.engine()', function () {

    var site = null;
    beforeEach(function () {
      site = assemble.createInst();
    });

    it('should set an engine with the given extension', function () {
      site.engine('hbs', consolidate.handlebars);
      should.exist(site.engines['.hbs']);
      should.exist(site.engines['.hbs'].renderSync);
      should.exist(site.engines['.hbs'].render);
    });
  });
});
