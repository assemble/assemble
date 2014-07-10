'use strict';


var assemble = require('..');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');
require('mocha');

assemble.enable('minimal config');
var outpath = join(__dirname, './out-fixtures');


describe('assemble output stream', function() {
  describe('dest()', function() {
    beforeEach(function (done) {
      rimraf(outpath, done);
    });
    afterEach(function (done) {
      rimraf(outpath, done);
    });

    it('should return a stream', function(done) {
      var stream = assemble.dest(join(__dirname, './fixtures/'));
      should.exist(stream);
      should.exist(stream.on);
      done();
    });

    it('should return an output stream that writes files', function(done) {
      var instream = assemble.src(join(__dirname, './fixtures/**/*.txt'));
      var outstream = assemble.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path,'').should.equal(join(outpath, './copy/example.txt'));
        String(file.contents).should.equal('this is a test');
      });
      outstream.on('end', function() {
        fs.readFile(join(outpath, 'copy', 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('this is a test');
          done();
        });
      });
    });

    it('should return an output stream that does not write non-read files', function(done) {
      var instream = assemble.src(join(__dirname, './fixtures/**/*.txt'), {read:false});
      var outstream = assemble.dest(outpath);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.not.exist(file.contents);
        join(file.path,'').should.equal(join(outpath, './copy/example.txt'));
      });

      outstream.on('end', function() {
        fs.readFile(join(outpath, 'copy', 'example.txt'), function(err, contents) {
          should.exist(err);
          should.not.exist(contents);
          done();
        });
      });
    });

    it('should return an output stream that writes streaming files', function(done) {
      var instream = assemble.src(join(__dirname, './fixtures/**/*.txt'), {buffer:false});
      var outstream = instream.pipe(assemble.dest(outpath));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        join(file.path,'').should.equal(join(outpath, './copy/example.txt'));
      });
      outstream.on('end', function() {
        fs.readFile(join(outpath, 'copy', 'example.txt'), function(err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('this is a test');
          done();
        });
      });
    });

    it('should return an output stream that writes streaming files to new directories', function(done) {
      testWriteDir({}, done);
    });

    it('should return an output stream that writes streaming files to new directories (buffer: false)', function(done) {
      testWriteDir({buffer: false}, done);
    });

    it('should return an output stream that writes streaming files to new directories (read: false)', function(done) {
      testWriteDir({read: false}, done);
    });

    it('should return an output stream that writes streaming files to new directories (read: false, buffer: false)', function(done) {
      testWriteDir({buffer: false, read: false}, done);
    });

    function testWriteDir(srcOptions, done) {
      var instream = assemble.src(join(__dirname, './fixtures/stuff'), srcOptions);
      var outstream = instream.pipe(assemble.dest(outpath));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted right
        should.exist(file);
        should.exist(file.path);
        join(file.path,'').should.equal(join(outpath, './stuff'));
      });
      outstream.on('end', function() {
        fs.exists(join(outpath, 'stuff'), function(exists) {
          /* stinks that ok is an expression instead of a function call */
          /* jshint expr: true */
          should(exists).be.ok;
          /* jshint expr: false */
          done();
        });
      });
    }

  });
});
