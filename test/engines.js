/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');
var Layout = require('../lib/view/layout');


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

    it('should set a layout engine when setting an engine', function () {
      var handlebars = require('../lib/engine/handlebars');
      assemble.engine('hbs', handlebars);

      var layout = new Layout(assemble);
      should.exist(layout._layouts['.hbs']);
      should.exist(layout._layouts['.hbs']._bodyRe);
    });

  });
});