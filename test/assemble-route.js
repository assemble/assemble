'use strict';

var assemble = require('..');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');
require('mocha');

var outpath = join(__dirname, './out-fixtures');


describe('assemble route', function() {
  before (function () {
    assemble.init();
  });

  describe('route()', function() {
    beforeEach(function (done) {
      rimraf(outpath, done);
    });
    afterEach(function (done) {
      rimraf(outpath, done);
    });

    it('should set route for all text files', function (done) {
      assemble.route(/\.txt/, function (file, next) {
        file.contents = new Buffer(file.contents.toString().toUpperCase());
        next();
      });

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
        String(file.contents).should.equal('THIS IS A TEST');
      });

      outstream.on('end', function () {
        done();
      });
    });


    it('should set routes with custom router', function (done) {
      var foo = assemble.router();
      foo.route(/\.txt/, function (file, next) {
        file.contents = new Buffer('foo: ' + file.contents.toString().toUpperCase());
        next();
      });

      var instream = assemble.src(join(__dirname, './fixtures/**/*.txt'));
      var outstream = assemble.dest(outpath);

      instream
        .pipe(foo())
        .pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path, '').should.equal(join(outpath, './copy/example.txt'));
        String(file.contents).should.equal('foo: THIS IS A TEST');
      });

      outstream.on('end', function () {
        done();
      });
    });

  });
});
