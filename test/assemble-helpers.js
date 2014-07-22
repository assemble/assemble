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

describe('assemble helpers', function () {
  beforeEach(function () {
      assemble.init();
  });

  describe('.helpers()', function () {
    it('should return an empty list of helpers.', function () {
      assemble.helpers().should.be.empty;
    });

    it('should return helpers based on a glob pattern.', function () {
      var helpersPath = 'test/fixtures/helpers/one.js';
      var filename = path.join(process.cwd(), helpersPath);
      var helpers = assemble.helpers([helpersPath]);
      helpers.should.have.property('one');
      helpers['one'].should.be.function;
    });

  });
});