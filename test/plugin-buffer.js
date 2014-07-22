'use strict';

var assemble = require('..');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');
require('mocha');

var outpath = join(__dirname, './out-fixtures');


describe('assemble buffer', function() {

  before (function () {
    assemble.init();
  });

  describe('buffer()', function() {

    beforeEach(function (done) {
      rimraf(outpath, done);
    });
    afterEach(function (done) {
      rimraf(outpath, done);
    });

    describe('buffer files - disabled', function () {

      beforeEach(function () {
        assemble.disable('buffer files');
        assemble.set('ext', '.txt');
      });

      afterEach(function () {
        assemble.enable('buffer files');
        assemble.set('ext', '.html');
      });

      it('should have an empty `files` cache', function (done) {
        var instream = assemble.src(join(__dirname, './fixtures/**/*.txt'));
        var outstream = assemble.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, './copy/example.txt'));
          String(file.contents).should.equal('this is a test');
        });
        outstream.on('end', function () {
          assemble.files.length.should.equal(0);
          done();
        });
      });

    });

    describe('buffer files - enabled', function () {

      beforeEach(function () {
        assemble.set('ext', '.txt');
      });

      afterEach(function () {
        assemble.set('ext', '.html');
      });

      it('should have a `files` cache', function (done) {
        var instream = assemble.src(join(__dirname, './fixtures/**/*.txt'));
        var outstream = assemble.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, './copy/example.txt'));
          String(file.contents).should.equal('this is a test');
        });
        outstream.on('end', function () {
          assemble.files.length.should.equal(1);
          done();
        });
      });

    });

  });
});
