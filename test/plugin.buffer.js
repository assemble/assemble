'use strict';

var assemble = require('..');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');
require('mocha');

var outpath = join(__dirname, './out-fixtures');


describe('assemble buffer', function() {
  var site = null;
  before (function () {
    site = assemble.createInst();
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
        site.disable('buffer plugin');
        site.set('ext', '.txt');
      });

      afterEach(function () {
        site.enable('buffer plugin');
        site.set('ext', '.html');
      });

      xit('should have an empty `files` cache', function (done) {
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'));
        var outstream = site.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, 'example.txt'));
          String(file.contents).should.equal('this is a test');
        });

        outstream.on('end', function () {
          site.files.length.should.equal(0);
          done();
        });
      });
    });


    describe('buffer files - enabled', function () {
      beforeEach(function () {
        site.set('ext', '.txt');
      });

      afterEach(function () {
        site.set('ext', '.html');
      });

      xit('should have a `files` cache', function (done) {
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'));
        var outstream = site.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, 'example.txt'));
          String(file.contents).should.equal('this is a test');
        });
        outstream.on('end', function () {
          site.files.length.should.equal(1);
          done();
        });
      });
    });

  });
});
