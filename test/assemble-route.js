'use strict';

var assemble = require('..');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var path = require('path');
require('mocha');

var outpath = join(__dirname, './out-fixtures');


describe('assemble route', function() {

  describe('route()', function() {
    beforeEach(function (done) {
      assemble.init();
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

      var instream = assemble.src(join(__dirname, './fixtures/routes/*.txt'));
      var outstream = assemble.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path, '').should.equal(join(outpath, 'example.txt'));
        String(file.contents).should.equal('THIS IS A TEST');
      });

      outstream.on('end', function () {
        done();
      });
    });


    it('should set multiple routes on different files', function (done) {

      assemble.route(/\.txt/, function (file, next) {
        file.contents = new Buffer(file.contents.toString().toUpperCase());
        next();
      });

      assemble.route(/\.hbs/, function (file, next) {
        file.path = join(path.dirname(file.path), path.basename(file.path, path.extname(file.path)) + '.html');
        next();
      });

      var instream = assemble.src(join(__dirname, './fixtures/routes/*.*'));
      var outstream = assemble.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        // join(file.path, '').should.equal(join(outpath, 'example.html'));
        // String(file.contents).should.equal('THIS IS A TEST');
      });

      outstream.on('end', function () {
        done();
      });
    });

    it('should set multiple routes on same file', function (done) {

      assemble.route(/\.txt/, function (file, next) {
        file.contents = new Buffer(file.contents.toString().toUpperCase());
        next();
      });

      assemble.route(/example/, function (file, next) {
        file.ext = '.html';
        next();
      });

      var instream = assemble.src(join(__dirname, './fixtures/routes/*.txt'));
      var outstream = assemble.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path, '').should.equal(join(outpath, 'example.html'));
        String(file.contents).should.equal('THIS IS A TEST');
      });

      outstream.on('end', function () {
        done();
      });
    });

    it('should handle errors', function (done) {

      assemble.route(/\.hbs/, function (file, next) {
        throw new Error('This is an error');
        next();
      }, function (err, file, next) {
        should.exist(err);
        err.message.should.equal('This is an error');
        next();
      });

      var instream = assemble.src(join(__dirname, './fixtures/routes/*.*'));
      var outstream = assemble.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        // join(file.path, '').should.equal(join(outpath, 'example.txt'));
        // String(file.contents).should.equal('THIS IS A TEST');
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

      var instream = assemble.src(join(__dirname, './fixtures/routes/*.txt'));
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
        join(file.path, '').should.equal(join(outpath, 'example.txt'));
        String(file.contents).should.equal('foo: THIS IS A TEST');
      });

      outstream.on('end', function () {
        done();
      });
    });

  });
});
