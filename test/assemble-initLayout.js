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

describe('assemble initLayout', function () {

  describe('.initLayout()', function () {
    it('should create a new instance of Layout', function () {
      assemble.init();
      var layout = assemble.initLayout();
      should.exist(layout);
      layout.should.be.instanceOf(Layout);
    });
  });

});