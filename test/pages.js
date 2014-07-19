/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var fs = require('fs');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
var assemble = require('..');
var pages = require('../lib/plugins/pages')(assemble);
var vFile = require('../lib/utils');


function newFile(filename, contents) {
  var base = path.join(__dirname, 'fixtures');
  var filepath = path.join(base, filename);

  return new gutil.File({
    cwd: __dirname,
    base: base,
    path: filepath,
    contents: contents || fs.readFileSync(filepath)
  });
}


describe('assemble pages', function () {
  var options = {
    pages: [
      { filepath: 'one.hbs', data: { title: 'first'}, contents: '---\nmessage: from front matter\n---\n this is {{title}} {{message}}' },
      { filepath: 'two.hbs', data: { title: 'second'}, contents: '---\nmessage: from front matter\n---\n this is {{title}} {{message}}' },
      { filepath: 'three.hbs', data: { title: 'third'}, contents: '---\nmessage: from front matter\n---\n this is {{title}} {{message}}' }
    ]
  };

  afterEach(function() {
    assemble.clear();
  });

  beforeEach(function() {
    assemble.clear();
  });

  /*describe('.pages()', function () {
    assemble.option.set(options);
    xit("should generate pages from JSON.", function () {
      //
    });
  });*/
  describe('pages()', function () {
    it('should pass file when it isNull()', function (done) {
      var stream = pages();
      var emptyFile = {
        isNull: function () {
          return true;
        }
      };
      stream.on('data', function (data) {
        data.should.equal(emptyFile);
        done();
      });
      stream.write(emptyFile);
    });

    it('should emit error when file isStream()', function (done) {
      var stream = pages();
      var streamFile = {
        isNull: function () {
          return false;
        },
        isStream: function () {
          return true;
        }
      };
      stream.on('error', function (err) {
        err.message.should.equal('Streaming not supported');
        done();
      });
      stream.write(streamFile);
    });


    it('should process a file.', function (done) {
      var page = newFile('pages/home.hbs');
      var stream = pages();

      stream.on('data', function (newPage) {
        should.exist(newPage);
        should.exist(newPage.path);
        should.exist(newPage.relative);
        should.exist(newPage.contents);
        newPage.path.should.equal(path.join(__dirname, 'fixtures/pages', 'home.hbs'));
        done();
      });
      stream.write(page);
    });

  });
});