require('mocha');
var path = require('path');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var App = require('..');
var app;

var outpath = path.join(__dirname, './out-fixtures');

describe('app output stream', function() {
  describe('dest()', function() {
    beforeEach(function (done) {
      rimraf(outpath, done);
    });
    afterEach(function (done) {
      rimraf(outpath, done);
    });

    describe('minimal config - enabled', function () {
      beforeEach(function () {
        app = new App();
      });

      it('should return a stream', function (done) {
        var stream = app.dest(path.join(__dirname, 'fixtures/'));
        should.exist(stream);
        should.exist(stream.on);
        done();
      });

      it('should return an output stream that writes files', function (done) {
        var instream = app.src(path.join(__dirname, 'fixtures/copy/*.txt'));
        var outstream = app.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          path.join(file.path, '').should.equal(path.join(outpath, 'example.txt'));
          String(file.contents).should.equal('this is a test');
        });
        outstream.on('end', function () {
          fs.readFile(path.join(outpath, 'example.txt'), function (err, contents) {
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal('this is a test');
            done();
          });
        });
      });

      it('should return an output stream that does not write non-read files', function (done) {
        var instream = app.src(path.join(__dirname, 'fixtures/copy/*.txt'), {read: false});
        var outstream = app.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          path.join(file.path, '').should.equal(path.join(outpath, 'example.txt'));
        });

        outstream.on('end', function () {
          fs.readFile(path.join(outpath, 'example.txt'), function (err, contents) {
            should.exist(err);
            should.not.exist(contents);
            done();
          });
        });
      });

      it('should return an output stream that writes streaming files', function (done) {
        var instream = app.src(path.join(__dirname, 'fixtures/copy/*.txt'), {buffer: false});
        var outstream = instream.pipe(app.dest(outpath));

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          path.join(file.path, '').should.equal(path.join(outpath, 'example.txt'));
        });
        outstream.on('end', function () {
          fs.readFile(path.join(outpath, 'example.txt'), function (err, contents) {
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
        app = new App();
        app.set('ext', '.txt');
      });

      afterEach(function () {
        app.set('ext', '.html');
      });

      it('should return a stream', function (done) {
        var stream = app.dest(path.join(__dirname, 'fixtures/'));
        should.exist(stream);
        should.exist(stream.on);
        done();
      });

      it('should return an output stream that writes files', function (done) {
        var instream = app.src(path.join(__dirname, 'fixtures/copy/*.txt'));
        var outstream = app.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          path.join(file.path, '').should.equal(path.join(outpath, 'example.txt'));
          String(file.contents).should.equal('this is a test');
        });
        outstream.on('end', function () {
          fs.readFile(path.join(outpath, 'example.txt'), function (err, contents) {
            should.not.exist(err);
            should.exist(contents);
            String(contents).should.equal('this is a test');
            done();
          });
        });
      });

      it('should return an output stream that does not write non-read files', function (done) {
        var instream = app.src(path.join(__dirname, 'fixtures/copy/*.txt'), {read: false});
        var outstream = app.dest(outpath);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          // data should be re-emitted correctly
          should.exist(file);
          should.exist(file.path);
          should.not.exist(file.contents);
          path.join(file.path, '').should.equal(path.join(outpath, 'example.txt'));
        });

        outstream.on('end', function () {
          fs.readFile(path.join(outpath, 'example.txt'), function (err, contents) {
            should.exist(err);
            should.not.exist(contents);
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

    function testWriteDir(srcOptions, done) {
      var instream = app.src(path.join(__dirname, 'fixtures/generic'), srcOptions);
      var outstream = instream.pipe(app.dest(outpath));

      outstream.on('error', done);
      outstream.on('data', function(file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        path.join(file.path,'').should.equal(path.join(outpath, './generic'));
      });

      outstream.on('end', function() {
        fs.exists(path.join(outpath, 'generic'), function(exists) {
          /* jshint expr: true */
          should(exists).be.ok;
          /* jshint expr: false */
          done();
        });
      });
    }
  });
});
