/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');
var tap = require('gulp-tap');
var path = require('path');
var rimraf = require('rimraf');

var outpath = path.join(__dirname, './out-fixtures');

describe('assemble use', function () {
  describe('assemble.use()', function () {
    var site = null;
    beforeEach(function (done) {
      site = assemble.createInst();
      rimraf(outpath, done);
    });
    afterEach(function (done) {
      rimraf(outpath, done);
    });

    it('should use a middleware', function (done) {
      var actualCounter = 1;
      site.use(function (file, next) {
        file.data.counter = actualCounter++;
        next();
      });

      var expectedCounter = 1;
      site.src(path.join(__dirname, 'fixtures/templates/no-helpers/*.hbs'))
        .pipe(tap(function (file) {
          file.data.counter.should.equal(expectedCounter++);
        }))
        .pipe(site.dest(outpath))
        .on('end', done);
    });
  });
});
