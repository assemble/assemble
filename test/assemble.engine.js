/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
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
      site = assemble.init();
    });

    it('should register an engine to the given extension', function () {
      site.engine('hbs', consolidate.handlebars);
      site.engines['.hbs'].should.exist;
      should.exist(site.engines['.hbs'].renderSync);
      should.exist(site.engines['.hbs'].render);
    });
  });
});
