/**
 * assemble <https://github.com/assemble/assemble>
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
      { filepath: 'one.hbs', data: { title: 'first'}, content: '---\nmessage: from front matter\n---\n this is {{title}} {{message}}' },
      { filepath: 'two.hbs', data: { title: 'second'}, content: '---\nmessage: from front matter\n---\n this is {{title}} {{message}}' },
      { filepath: 'three.hbs', data: { title: 'third'}, content: '---\nmessage: from front matter\n---\n this is {{title}} {{message}}' }
    ]
  };

  var site = null;
  beforeEach(function() {
    site = assemble.createInst();
  });

  /*describe('.pages()', function () {
    site.option.set(options);
    xit("should generate pages from JSON.", function () {
      //
    });
  });*/
  describe('pages()', function () {
    xit('should create new files from array', function (done) {
      var stream = pages(options.pages, options);
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

    xit('should create new files from object', function (done) {
      var stream = pages(options.pages, options);
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
      stream.on('data', function () {
        done();
      })
      stream.write(streamFile);
    });


    xit('should create new files from string', function () {
      var stream = pages(options.pages, options);
    });

  });
});