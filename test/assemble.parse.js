/**
 * Assemble <http://site.io>
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
  var site = null;
  beforeEach(function (done) {
    site = assemble.create();
    rimraf(dest, done);
  });
  afterEach(function (done) {
    rimraf(dest, done);
  });

  describe('.parse()', function () {
    it('should parse a file with the given parser.', function (done) {
      site.init();

      site.parser('a', function (file) {
        var str = file.contents.toString().toUpperCase();
        file.contents = new Buffer(str);
        return file;
      });

      // x #1
      site.parser('x', function (file) {
        var str = addSpace(file.contents.toString());
        file.contents = new Buffer(str);
        return file;
      });

      // x #2
      site.parser('x', function (file) {
        var str = file.contents.toString().toUpperCase();
        file.contents = new Buffer(str);
        return file;
      });

      var stream = site.src(fixtures + '/*.*');
      var outstream = site.dest(__dirname + '/actual');

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