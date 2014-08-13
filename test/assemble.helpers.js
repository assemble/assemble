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


var actual = __dirname + '/helpers-actual';


describe('assemble helpers', function () {
  beforeEach(function (done) {
    assemble.init();
    rimraf(actual, done);
  });

  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.helpers()', function () {
    it('should return an empty list of helpers.', function () {
      assemble.cache.helpers.should.be.empty;
    });

    it('should return helpers based on a glob pattern.', function () {
      var fixture = __dirname + '/fixtures/helpers/wrapped.js';
      assemble.helpers(fixture);

      assemble.cache.helpers.should.have.property('wrapped');
      assemble.cache.helpers['wrapped'].should.be.a.function;
    });

    it('should register helpers and use them in templates.', function (done) {
      assemble.helpers({
        upper: function (str) {
          return str.toUpperCase();
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-helper/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.registerHelpers():', function () {
    it('should register helpers and use them in templates.', function (done) {
      assemble.registerHelpers({
        upper: function (str) {
          return str.toUpperCase();
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-helper/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.helpers()', function () {
    it('should register helpers and use them in templates.', function (done) {
      assemble.registerHelpers({
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.set()', function () {
    it('should register helpers and use them in templates.', function (done) {
      assemble.option({
        helpers: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.helpers', function () {
    it('should register helpers and use them in templates.', function (done) {
      assemble.options.helpers = {
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      };

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.src("", {helpers:[]})', function () {
    it('should register helpers on the `src` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs');
      var instream = assemble.src(srcPath, {
        helpers: {
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
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.dest("", {helpers:[]})', function () {
    it('should register helpers on the `dest` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs');
      var instream = assemble.src(srcPath);
      var outstream = assemble.dest(actual, {
        helpers: {
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
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });
});
