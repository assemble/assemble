/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var through = require('through2');
var rimraf = require('rimraf');
var app;

var assemble = require('..');
var actual = __dirname + '/render-actual';

describe('assemble render', function () {

  describe('assemble.render()', function () {
    beforeEach(function (done) {
      app = assemble.init();
      rimraf(actual, done);
    });

    afterEach(function(done) {
      rimraf(actual, done);
    });

    it('should render a file', function (done) {
      app.option('layout', 'default.hbs');
      app.option('renameKey', function (key) {
        return path.basename(key, path.extname(key));
      });

      app.partials(['test/fixtures/pages/includes/*.hbs']);
      app.layouts(['test/fixtures/pages/layouts/*.hbs']);
      app.data({
        posts: [
          { author: 'Brian Woodward', timestamp: '2014-11-01', summary: 'This is just a summary. First', content: 'Here\'s the real content. One' },
          { author: 'Brian Woodward', timestamp: '2014-11-02', summary: 'This is just a summary. Second', content: 'Here\'s the real content. Two' },
          { author: 'Jon Schlinkert', timestamp: '2014-11-03', summary: 'This is just a summary. Third', content: 'Here\'s the real content. Three' },
          { author: 'Jon Schlinkert', timestamp: '2014-11-04', summary: 'This is just a summary. Fourth', content: 'Here\'s the real content. Four' },
          { author: 'Brian Woodward', timestamp: '2014-11-05', summary: 'This is just a summary. Fifth', content: 'Here\'s the real content. Five' },
        ]
      });

      var i = 0;
      app.src('test/fixtures/pages/a.hbs')
        .pipe(through.obj(function(file, enc, next) {
          file.data.layout = 'default';
          next(null, file);
        }))
        .pipe(app.dest(actual))
        .on('data', function (file) {
          i++;
          file.options.layoutApplied.should.be.true;
          (file.path.indexOf('.hbs') > -1).should.be.true;
          (file.contents.toString().toLowerCase().indexOf('doctype html') > -1).should.be.true;
        })
        .on('error', done)
        .on('end', function () {
          i.should.equal(1);
          done();
        });
    });
  });
});
