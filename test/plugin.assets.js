'use strict';

var path = require('path');
var tap = require('gulp-tap');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var assemble = require('..');

var site = null;
var actual = __dirname + '/assets-actual';

describe('assemble assets plugin', function() {
  before (function () {
    site = assemble.createInst();
  });

  describe('assets()', function() {
    beforeEach(function (done) {
      rimraf(actual, done);
    });
    afterEach(function (done) {
      rimraf(actual, done);
    });

    describe('when `assets` is defined on options:', function () {
      it('should calculate the correct `assets` property on the file.', function (done) {
        site.set('assets', actual + '/assets');
        var instream = site.src(path.join(__dirname, 'fixtures/assets/*.hbs'));
        var outstream = site.dest(actual);

        instream
          .pipe(tap(function (file) {
            should.exist(file);
            should.exist(file.path);
            should.exist(file.contents);
            should.exist(file.data.assets);
            file.data.assets.should.equal('../../assets-actual/assets');
          }))
          .pipe(outstream);

        outstream.on('error', done);
        outstream.on('end', function () {
          done();
        });

      });

      it('should calculate the correct `assets` property on the file when the dest changes.', function (done) {
        site.set('assets', actual + '/assets');
        var instream = site.src(path.join(__dirname, 'fixtures/assets/*.hbs'));
        var outstream = site.dest(actual);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          should.exist(file.data.assets);
          file.data.assets.should.equal('assets');
          /assets/.test(String(file.contents)).should.be.true;
        });

        outstream.on('end', function () {
          done();
        });
      });
    });
  });
});
