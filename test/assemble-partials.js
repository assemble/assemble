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

  // afterEach(function (done) {
  //   rimraf(actual, done);
  // });

  describe('.partial()', function () {
    it('should return an empty list of partials.', function () {
      assemble.partials.should.be.empty;
    });

    it('should cache a partial defined as an object.', function () {
      assemble.partial({
        name: 'test-partial-a',
        data: {title: 'test-partial-a'},
        content: 'Test partial A content'
      });

      var partials = assemble.cache.partials;
      partials.should.have.property('test-partial-a');
    });
  });

  describe('.partials()', function () {
    it('should return an empty list of partials.', function () {
      assemble.partials.should.be.empty;
    });

    it('should cache an array of partials defined as objects.', function () {
      assemble.partials([
        {
          name: 'test-partial-a',
          data: {title: 'test-partial-a'},
          content: 'Test partial A content'
        },
        {
          name: 'test-partial-b',
          data: {title: 'test-partial-b'},
          content: 'Test partial B content'
        },
        {
          name: 'test-partial-c',
          data: {title: 'test-partial-c'},
          content: 'Test partial C content'
        }
      ]);

      var partials = assemble.cache.partials;
      partials.should.have.property('test-partial-a');
      partials.should.have.property('test-partial-b');
      partials.should.have.property('test-partial-c');
    });

    it('should cache an object of partials defined as objects.', function () {
      assemble.partials({
        'test-partial-a': {
          data: {title: 'test-partial-a'},
          content: 'Test partial A content'
        },
        'test-partial-b': {
          data: {title: 'test-partial-b'},
          content: 'Test partial B content'
        },
        'test-partial-c': {
          data: {title: 'test-partial-c'},
          content: 'Test partial C content'
        }
      });

      var partials = assemble.cache.partials;
      partials.should.have.property('test-partial-a');
      partials.should.have.property('test-partial-b');
      partials.should.have.property('test-partial-c');
    });

    it('should cache an object of partials defined as a string of glob patterns.', function () {

      var partialPath = path.join.bind(path, __dirname, 'fixtures/templates/partials/');
      // assemble.option.set({
      //   nameFn: function (argument) {
      //     // body...
      //   }
      // });
      assemble.partials('test/fixtures/templates/partials/*.hbs', {
        // nameFn: function (argument) {
        //   // body...
        // }
      });

      var partials = assemble.cache.partials;
      partials.should.have.property(partialPath('a.hbs'));
      partials.should.have.property(partialPath('b.hbs'));
      partials.should.have.property(partialPath('c.hbs'));
    });

    xit('should cache an object of partials defined as an array of glob patterns.', function () {
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

  // describe('assemble.partials()', function () {
  //   it('should register partials and use them in templates.', function (done) {
  //     assemble.partials({
  //       upper: function (str) {
  //         return str.toUpperCase();
  //       },
  //       foo: function (str) {
  //         return 'foo' + str;
  //       }
  //     });

  //     var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partials/*.hbs'));
  //     var outstream = assemble.dest(actual);
  //     instream.pipe(outstream);

  //     outstream.on('error', done);
  //     outstream.on('data', function (file) {
  //       should.exist(file);
  //       should.exist(file.path);
  //       should.exist(file.contents);
  //       /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
  //       /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
  //       /foo[abcd]/.test(String(file.contents)).should.be.true;
  //       assemble.files.length.should.equal(4);
  //     });

  //     outstream.on('end', function () {
  //       done();
  //     });
  //   });
  // });

  // describe('options.set()', function () {
  //   it('should register partials and use them in templates.', function (done) {
  //     assemble.option.set({
  //       partials: {
  //         upper: function (str) {
  //           return str.toUpperCase();
  //         },
  //         foo: function (str) {
  //           return 'foo' + str;
  //         }
  //       }
  //     });

  //     var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partials/*.hbs'));
  //     var outstream = assemble.dest(actual);
  //     instream.pipe(outstream);

  //     outstream.on('error', done);
  //     outstream.on('data', function (file) {
  //       should.exist(file);
  //       should.exist(file.path);
  //       should.exist(file.contents);
  //       /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
  //       /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
  //       /foo[abcd]/.test(String(file.contents)).should.be.true;
  //       assemble.files.length.should.equal(4);
  //     });

  //     outstream.on('end', function () {
  //       done();
  //     });
  //   });
  // });

  // describe('options.partials', function () {
  //   it('should register partials and use them in templates.', function (done) {
  //     assemble.options.partials = {
  //       upper: function (str) {
  //         return str.toUpperCase();
  //       },
  //       foo: function (str) {
  //         return 'foo' + str;
  //       }
  //     };

  //     var instream = assemble.src(path.join(__dirname, 'fixtures/templates/with-partials/*.hbs'));
  //     var outstream = assemble.dest(actual);
  //     instream.pipe(outstream);

  //     outstream.on('error', done);
  //     outstream.on('data', function (file) {
  //       should.exist(file);
  //       should.exist(file.path);
  //       should.exist(file.contents);
  //       /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
  //       /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
  //       /foo[abcd]/.test(String(file.contents)).should.be.true;
  //       assemble.files.length.should.equal(4);
  //     });

  //     outstream.on('end', function () {
  //       done();
  //     });
  //   });
  // });

  // describe('assemble.src("", {partials:[]})', function () {
  //   it('should register partials on the `src` and use them in templates.', function (done) {
  //     var srcPath = path.join(__dirname, 'fixtures/templates/with-partials/*.hbs');
  //     var instream = assemble.src(srcPath, {
  //       partials: {
  //         upper: function (str) {
  //           return str.toUpperCase();
  //         },
  //         foo: function (str) {
  //           return 'foo' + str;
  //         }
  //       }
  //     });
  //     var outstream = assemble.dest(actual);
  //     instream.pipe(outstream);

  //     outstream.on('error', done);
  //     outstream.on('data', function (file) {
  //       should.exist(file);
  //       should.exist(file.path);
  //       should.exist(file.contents);
  //       /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
  //       /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
  //       /foo[abcd]/.test(String(file.contents)).should.be.true;
  //       assemble.files.length.should.equal(4);
  //     });

  //     outstream.on('end', function () {
  //       done();
  //     });
  //   });
  // });

  // describe('assemble.dest("", {partials:[]})', function () {
  //   it('should register partials on the `dest` and use them in templates.', function (done) {
  //     var srcPath = path.join(__dirname, 'fixtures/templates/with-partials/*.hbs');
  //     var instream = assemble.src(srcPath);
  //     var outstream = assemble.dest(actual, {
  //       partials: {
  //         upper: function (str) {
  //           return str.toUpperCase();
  //         },
  //         foo: function (str) {
  //           return 'foo' + str;
  //         }
  //       }
  //     });
  //     instream.pipe(outstream);

  //     outstream.on('error', done);
  //     outstream.on('data', function (file) {
  //       should.exist(file);
  //       should.exist(file.path);
  //       should.exist(file.contents);
  //       /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
  //       /partial:\s+[ABCD]/.test(String(file.contents)).should.be.true;
  //       /foo[abcd]/.test(String(file.contents)).should.be.true;
  //       assemble.files.length.should.equal(4);
  //     });

  //     outstream.on('end', function () {
  //       done();
  //     });
  //   });
  // });
});
