/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var fs = require('graceful-fs');
var path = require('path');
var should = require('should');
var File = require('vinyl');
var rimraf = require('rimraf');
var assemble = require('..');


var actual = __dirname + '/partials-actual';


describe('assemble partials', function () {
  beforeEach(function (done) {
    assemble.init();
    rimraf(actual, done);
  });

  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.partials()', function () {
    it('should return an empty list of partials.', function () {
      assemble.partials.should.be.empty;
    });

    it('should return partials based on a glob pattern.', function () {
      var fixture = __dirname + '/fixtures/partials/wrapped.js';
      var partials = assemble.partials(fixture);
      partials.should.have.property('wrapped');
      partials['wrapped'].should.be.a.function;
    });
  });

  describe('assemble.partial():', function () {
    it('should register partials and use them in templates.', function (done) {
      assemble.partial({upper: function (str) {return str.toUpperCase();}});

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partial/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.partials()', function () {
    it('should register partials and use them in templates.', function (done) {
      assemble.partials({
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partials/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.set()', function () {
    it('should register partials and use them in templates.', function (done) {
      assemble.option.set({
        partials: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partials/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.partials', function () {
    it('should register partials and use them in templates.', function (done) {
      assemble.options.partials = {
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      };

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partials/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.src("", {partials:[]})', function () {
    it('should register partials on the `src` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-partials/*.hbs');
      var instream = assemble.src(srcPath, {
        partials: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.dest("", {partials:[]})', function () {
    it('should register partials on the `dest` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-partials/*.hbs');
      var instream = assemble.src(srcPath);
      var outstream = assemble.dest(actual, {
        partials: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });
});
