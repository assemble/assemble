'use strict';

var assemble = require('..');
var should = require('should');
var join = require('path').join;
var rimraf = require('rimraf');
var fs = require('graceful-fs');
require('mocha');

var outpath = join(__dirname, './out-fixtures');


describe('assemble output stream', function() {

  describe('dest()', function() {

    var site = null;
    beforeEach(function (done) {
      rimraf(outpath, done);
    });
    afterEach(function (done) {
      rimraf(outpath, done);
    });

    describe('minimal config - enabled', function () {

      beforeEach(function () {
        site = assemble.createInst();
        site.enable('minimal config');
      });
      afterEach(function () {
        site.disable('minimal config');
      });

      it('should return a stream', function (done) {
        var stream = site.dest(join(__dirname, 'fixtures/'));
        should.exist(stream);
        should.exist(stream.on);
        done();
      });

      it('should return an output stream that writes files', function (done) {
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
          fs.readFile(join(outpath, 'example.txt'), function (err, contents) {
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal('this is a test');
            done();
          });
        });
      });

      it('should return an output stream that does not write non-read files', function (done) {
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'), {read: false});
        var outstream = site.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, 'example.txt'));
        });

        outstream.on('end', function () {
          fs.readFile(join(outpath, 'example.txt'), function (err, contents) {
            should.exist(err);
            should.not.exist(contents);
            done();
          });
        });
      });

      it('should return an output stream that writes streaming files', function (done) {
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'), {buffer: false});
        var outstream = instream.pipe(site.dest(outpath));

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, 'example.txt'));
        });
        outstream.on('end', function () {
          fs.readFile(join(outpath, 'example.txt'), function (err, contents) {
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal('this is a test');
            done();
          });
        });
      });

      it('should return an output stream that writes streaming files to new directories', function (done) {
        testWriteDir({}, done);
      });

      it('should return an output stream that writes streaming files to new directories (buffer: false)', function (done) {
        testWriteDir({buffer: false}, done);
      });

      it('should return an output stream that writes streaming files to new directories (read: false)', function (done) {
        testWriteDir({read: false}, done);
      });

      it('should return an output stream that writes streaming files to new directories (read: false, buffer: false)', function (done) {
        testWriteDir({buffer: false, read: false}, done);
      });

    });

    describe('minimal config - disabled', function () {

      beforeEach(function () {
        site = assemble.createInst();
        site.set('ext', '.txt');
      });

      afterEach(function () {
        site.set('ext', '.html');
      });

      it('should return a stream', function (done) {
        var stream = site.dest(join(__dirname, 'fixtures/'));
        should.exist(stream);
        should.exist(stream.on);
        done();
      });

      it('should return an output stream that writes files', function (done) {
        // site.disable('render plugin');
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'));
        var outstream = site.dest(outpath, {ext: '.txt'});
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
          fs.readFile(join(outpath, 'example.txt'), function (err, contents) {
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal('this is a test');
            done();
          });
        });
      });

      it('should return an output stream that does not write non-read files', function (done) {
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'), {read: false});
        var outstream = site.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          join(file.path, '').should.equal(join(outpath, 'example.txt'));
        });

        outstream.on('end', function () {
          fs.readFile(join(outpath, 'example.txt'), function (err, contents) {
            should.exist(err);
            should.not.exist(contents);
            done();
          });
        });
      });

      xit('should throw an error when trying to write streaming files', function (done) {
        var instream = site.src(join(__dirname, 'fixtures/copy/*.txt'), {buffer: false});
        var outstream = site.dest(outpath);
        var output = instream.pipe(outstream);

        instream.on('error', function (err) {
          console.log('error in instream', err);
          // this.end();
          // done();
        });
        instream.on('data', function () {
          // this.end();
          // done(new Error('should have thrown an error'));
        });

        outstream.on('error', function (err) {
          console.log('error in outstream', err);
          // this.end();
          // done();
        });
        outstream.on('data', function () {
          // this.end();
          // done(new Error('should have thrown an error'));
        });

        output.on('error', function (err) {
          console.log('error in output', err);
          // this.end(); 
          // done();         
        });
        output.on('data', function () {
          // this.end();
          // done(new Error('should have thrown an error'));
        });
        output.on('end', done);
      });

      xit('should return an output stream that writes streaming files to new directories', function (done) {
        testWriteDir({}, done);
      });

      xit('should return an output stream that writes streaming files to new directories (buffer: false)', function (done) {
        testWriteDir({buffer: false}, done);
      });

      xit('should return an output stream that writes streaming files to new directories (read: false)', function (done) {
        testWriteDir({read: false}, done);
      });

      xit('should return an output stream that writes streaming files to new directories (read: false, buffer: false)', function (done) {
        testWriteDir({buffer: false, read: false}, done);
      });

    });

    function testWriteDir(srcOptions, done) {
      var instream = site.src(join(__dirname, 'fixtures/generic'), srcOptions);
      var outstream = instream.pipe(site.dest(outpath));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        join(file.path,'').should.equal(join(outpath, './generic'));
      });
      outstream.on('end', function() {
        fs.exists(join(outpath, 'generic'), function(exists) {
          /* jshint expr: true */
          should(exists).be.ok;
          /* jshint expr: false */
          done();
        });
      });
    }

  });
});
