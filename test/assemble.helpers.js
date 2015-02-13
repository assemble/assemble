/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var should = require('should');
var rimraf = require('rimraf');
var assemble = require('..');

var actual = __dirname + '/helpers-actual';

describe('assemble helpers', function () {
  var app = null;
  beforeEach(function (done) {
    app = assemble.init();
    rimraf(actual, done);
  });

  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.helpers()', function () {
    it('should return an empty list of helpers.', function () {
      _.forOwn(app.engines, function (engine) {
        engine.helpers.should.be.empty;
      });
    });

    it('should return helpers based on a glob pattern.', function () {
      var fixture = __dirname + '/fixtures/helpers/wrapped.js';
      app.helpers(fixture);

      app._.helpers.should.have.property('wrapped');
      app._.helpers['wrapped'].should.be.a.function;
    });

    it('should add helpers and use them in templates.', function (done) {
      app.helpers({
        upper: function (str) {
          return str.toUpperCase();
        }
      });

      var instream = app.src(path.join(__dirname, 'fixtures/templates/with-helper/*.hbs'));
      var outstream = app.dest(actual);
      var output = instream.pipe(outstream);

      output.on('error', done);
      output.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        Object.keys(app.views.pages).length.should.equal(4);
      });

      output.on('end', function () {
        done();
      });
    });
  });

  describe('app.helpers():', function () {
    it('should add helpers and use them in templates.', function (done) {
      app.helpers({
        upper: function (str) {
          return str.toUpperCase();
        }
      });

      var instream = app.src(path.join(__dirname, 'fixtures/templates/with-helper/*.hbs'));
      var outstream = app.dest(actual);
      var output = instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        Object.keys(app.views.pages).length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('app.helpers()', function () {
    it('should add helpers and use them in templates.', function (done) {
      app.helpers({
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      });

      var instream = app.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        Object.keys(app.views.pages).length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.set()', function () {
    it('should add helpers and use them in templates.', function (done) {
      app.option({
        helpers: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });

      var instream = app.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        Object.keys(app.views.pages).length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.helpers', function () {
    it('should add helpers and use them in templates.', function (done) {
      app.options.helpers = {
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      };

      var instream = app.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        Object.keys(app.views.pages).length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('app.src("", {helpers:[]})', function () {
    it('should add helpers on the `src` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs');
      var instream = app.src(srcPath, {
        helpers: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });
      var outstream = app.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        Object.keys(app.views.pages).length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('app.dest("", {helpers:[]})', function () {
    it('should add helpers on the `dest` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs');
      var instream = app.src(srcPath);
      var outstream = app.dest(actual, {
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
        Object.keys(app.views.pages).length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });
});
