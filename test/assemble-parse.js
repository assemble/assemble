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

var dest = __dirname + '/fixtures/parsers';

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

      assemble.parser('a', function (file, options, encoding) {
        file.contents = new Buffer(file.contents.toString().toUpperCase());
        return file;
      });

      assemble.parser('x', function (file, options, encoding) {
        file.contents = new Buffer(addSpace(file.contents.toString()));
        return file;
      });

      var stream = assemble.src(dest + '/*.*');
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
          String(contents).should.equal('x y z ');
        });
        done();
      });
    });
  });
});