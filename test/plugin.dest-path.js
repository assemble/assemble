'use strict';

var path = require('path');
var tap = require('gulp-tap');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var Assemble = require('..');

var assemble = null;
var actual = __dirname + '/dest-path-actual';

describe('assemble dest-path plugin', function() {
  before (function () {
    assemble = Assemble.create();
  });

  describe('destPath()', function() {
    beforeEach(function (done) {
      rimraf(actual, done);
    });
    afterEach(function (done) {
      rimraf(actual, done);
    });

    describe('when files are run through the pipe', function () {
      it('should keep dest the same before the dest path plugin is run.', function (done) {
        assemble.set('assets', actual + '/assets');
        var instream = assemble.src(path.join(__dirname, 'fixtures/dest-path/*.hbs'));
        var outstream = assemble.dest(actual);

        instream
          .pipe(tap(function (file) {
            should.exist(file);
            should.exist(file.path);
            should.exist(file.contents);
            file.dest.ext.should.equal('.hbs');
            /fixtures[\/\\]dest-path[\/\\][cd]\.hbs/.test(file.dest.path).should.be.true;
          }))
          .pipe(outstream);

        outstream.on('error', done);
        outstream.on('end', function () {
          done();
        });

      });

      it('should calculate the correct `assets` property on the file when the dest changes.', function (done) {
        assemble.set('assets', actual + '/assets');
        var instream = assemble.src(path.join(__dirname, 'fixtures/dest-path/*.hbs'));
        var outstream = assemble.dest(actual);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
            should.exist(file);
            should.exist(file.path);
            should.exist(file.contents);
            file.dest.ext.should.equal('.html');
            /dest-path-actual[\/\\][cd]\.html/.test(file.dest.path).should.be.true;
        });

        outstream.on('end', function () {
          done();
        });
      });
    });
  });
});
