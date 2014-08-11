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

var actual = __dirname + '/layouts-actual';


describe('assemble layouts', function () {
  beforeEach(function (done) {
    assemble.init();
    rimraf(actual, done);
  });
  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('.layout()', function () {
    it('should be a method on assemble.', function () {
      assemble.layout.should.be.a.function;
    });

    it('should cache a layout defined as an object.', function () {
      assemble.layout({
        name: 'test-layout-a',
        data: {title: 'test-layout-a'},
        content: 'Test layout A content'
      });

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('test-layout-a');
    });
  });

  describe('.layouts()', function () {
    it('should be a method on assemble.', function () {
      assemble.layouts.should.be.a.function;
    });

    it('should return an empty array..', function () {
      assemble.layouts().should.be.empty;
    });

    it('should cache an array of layouts defined as objects.', function () {
      assemble.layouts([
        {
          name: 'test-layout-a',
          data: {title: 'test-layout-a'},
          content: 'Test layout A content'
        },
        {
          name: 'test-layout-b',
          data: {title: 'test-layout-b'},
          content: 'Test layout B content'
        },
        {
          name: 'test-layout-c',
          data: {title: 'test-layout-c'},
          content: 'Test layout C content'
        }
      ]);

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as objects.', function () {
      assemble.layouts({
        'test-layout-a': {
          data: {title: 'test-layout-a'},
          content: 'Test layout A content'
        },
        'test-layout-b': {
          data: {title: 'test-layout-b'},
          content: 'Test layout B content'
        },
        'test-layout-c': {
          data: {title: 'test-layout-c'},
          content: 'Test layout C content'
        }
      });

      var layouts = assemble.cache.layouts;
      layouts.should.have.property('test-layout-a');
      layouts.should.have.property('test-layout-b');
      layouts.should.have.property('test-layout-c');
    });

    it('should cache an object of layouts defined as a string of glob patterns.', function () {

      var layoutPath = path.join.bind(path, __dirname, 'fixtures/templates/layouts/');
      // assemble.option.set({
      //   nameFn: function (argument) {
      //     // body...
      //   }
      // });
      assemble.layouts('test/fixtures/templates/layouts/*.hbs', {
        // nameFn: function (argument) {
        //   // body...
        // }
      });

      var layouts = assemble.cache.layouts;
      layouts.should.have.property(layoutPath('a.hbs'));
      layouts.should.have.property(layoutPath('b.hbs'));
      layouts.should.have.property(layoutPath('c.hbs'));
    });

    it('should cache an object of layouts defined as an array of glob patterns.', function (done) {
      assemble.layout({upper: function (str) {return str.toUpperCase();}});

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-layout/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /layout:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.layouts()', function () {
    it('should register layouts and use them in templates.', function (done) {
      assemble.layouts({
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-layouts/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /layout:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.set()', function () {
    it('should register layouts and use them in templates.', function (done) {
      assemble.option.set({
        layouts: {
          upper: function (str) {
            return str.toUpperCase();
          },
          foo: function (str) {
            return 'foo' + str;
          }
        }
      });

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-layouts/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /layout:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('options.layouts', function () {
    it('should register layouts and use them in templates.', function (done) {
      assemble.options.layouts = {
        upper: function (str) {
          return str.toUpperCase();
        },
        foo: function (str) {
          return 'foo' + str;
        }
      };

      var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-layouts/*.hbs'));
      var outstream = assemble.dest(actual);
      instream.pipe(outstream);

      outstream.on('error', done);
      outstream.on('data', function (file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
        /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
        /layout:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.src("", {layouts:[]})', function () {
    it('should register layouts on the `src` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-layouts/*.hbs');
      var instream = assemble.src(srcPath, {
        layouts: {
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
        /layout:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });

  describe('assemble.dest("", {layouts:[]})', function () {
    it('should register layouts on the `dest` and use them in templates.', function (done) {
      var srcPath = path.join(__dirname, 'fixtures/templates/with-layouts/*.hbs');
      var instream = assemble.src(srcPath);
      var outstream = assemble.dest(actual, {
        layouts: {
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
        /layout:\s+[ABCD]/.test(String(file.contents)).should.be.true;
        /foo[abcd]/.test(String(file.contents)).should.be.true;
        assemble.files.length.should.equal(4);
      });

      outstream.on('end', function () {
        done();
      });
    });
  });
});
