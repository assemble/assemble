/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var path = require('path');
var File = require('gulp-util').File;
var assemble = require('..');

xdescribe('assemble helpers', function () {
  beforeEach(function () {
    assemble.init();
  });

  describe('.helpers()', function () {
    it('should return an empty list of helpers.', function () {
      assemble.helpers().should.be.empty;
    });

    it('should return helpers based on a glob pattern.', function () {
      var fixture = __dirname + '/fixtures/helpers/wrapped.js';
      var helpers = assemble.helpers(fixture);
      helpers.should.have.property('wrapped');
      helpers['wrapped'].should.be.function;
    });
  });
});