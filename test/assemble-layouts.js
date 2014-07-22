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

describe('assemble layouts', function () {
  beforeEach(function () {
    assemble.init();
  });

  describe('.layouts()', function () {

    it('should return an empty list of layouts.', function () {
      assemble.layouts.should.be.empty;
    });

    it('should return cached layouts based on a glob pattern.', function () {
      var layoutPath = 'test/fixtures/layouts/post.hbs';
      var filename = path.join(process.cwd(), layoutPath);
      assemble.option.set('layouts', [layoutPath]);
      assemble.layouts.should.have.property(filename);
    });

    it('should return layouts as instances of a Vinyl File', function () {
      var layoutPath = 'test/fixtures/layouts/post.hbs';
      var filename = path.join(process.cwd(), layoutPath);
      assemble.option.set('layouts', [layoutPath]);
      assemble.layouts[filename].should.be.instanceOf(File);
    });

  });
});