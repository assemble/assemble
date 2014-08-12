'use strict';

var path = require('path');
var tap = require('gulp-tap');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var Assemble = require('..');

var assemble = null;
var actual = __dirname + '/dynamic-actual';

describe('assemble dynamic plugin', function() {
  before (function () {
    assemble = Assemble.create();
  });

  describe('dynamic()', function() {
    beforeEach(function (done) {
      rimraf(actual, done);
    });
    afterEach(function (done) {
      rimraf(actual, done);
    });

    describe('when `assets` is defined on options:', function () {
      it('should calculate the correct `assets` property on the file.', function (done) {
        assemble.set('assets', actual + '/assets');
        var instream = assemble.src(path.join(__dirname, 'fixtures/dynamic/*.hbs'));
        var outstream = assemble.dest(actual);

        instream
          .pipe(tap(function (file) {
            should.exist(file);
            should.exist(file.path);
            should.exist(file.contents);
            should.exist(file.assets);
            file.assets.should.equal('../../dynamic-actual/assets');
          }))
          .pipe(outstream);

        outstream.on('error', done);
        outstream.on('end', function () {
          done();
        });

      });

      it('should calculate the correct `assets` property on the file when the dest changes.', function (done) {
        assemble.set('assets', actual + '/assets');
        var instream = assemble.src(path.join(__dirname, 'fixtures/dynamic/*.hbs'));
        var outstream = assemble.dest(actual);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          should.exist(file.assets);
          file.assets.should.equal('assets');
        });

        outstream.on('end', function () {
          done();
        });
      });
    });
  });
});
