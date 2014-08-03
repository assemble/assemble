/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var should = require('should');
var assemble = require('..');

var addSpace = function(str) {
  return str.split('').map(function(letter) {
    return letter + ' ';
  }).join('');
};

var fixtures = __dirname + '/fixtures/parsers';
var dest = __dirname + '/actual';

describe('assemble parse', function () {
  beforeEach(function (done) {
    rimraf(dest, done);
  });
  afterEach(function (done) {
    rimraf(dest, done);
  });

  describe('.parse()', function () {
    it('should parse a file with the given parser.', function (done) {
      assemble.init();

      assemble.parser('a', function (file) {
        var str = file.contents.toString().toUpperCase();
        file.contents = new Buffer(str);
        return file;
      });

      // x #1
      assemble.parser('x', function (file) {
        var str = addSpace(file.contents.toString());
        file.contents = new Buffer(str);
        return file;
      });

      // x #2
      assemble.parser('x', function (file) {
        var str = file.contents.toString().toUpperCase();
        file.contents = new Buffer(str);
        return file;
      });

      var stream = assemble.src(fixtures + '/*.*');
      var outstream = assemble.dest(__dirname + '/actual');

      stream.pipe(outstream);
      outstream.on('error', done);
      outstream.on('data', function (file) {
        // data should be re-emitted correctly
        should.exist(file);
        should.exist(file.path);
        should.exist(file.contents);
      });

      outstream.on('end', function () {
        fs.readFile(__dirname + '/actual/a.a', function (err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('ABC');
        });
        fs.readFile(__dirname + '/actual/x.x', function (err, contents) {
          should.not.exist(err);
          should.exist(contents);
          String(contents).should.equal('X Y Z ');
        });
        done();
      });
    });
  });
});