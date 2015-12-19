/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var rimraf = require('rimraf');

var assemble = require('..');
var actual = __dirname + '/render-actual';

describe('assemble render', function () {
  var site = null;

  describe('assemble.render()', function () {
    beforeEach(function (done) {
      site = assemble.init();
      rimraf(actual, done);
    });

    afterEach(function(done) {
      rimraf(actual, done);
    });

    it('should render a file', function (done) {
      site.option('layout', 'default');
      site.option('renameKey', function (key) {
        return path.basename(key, path.extname(key));
      });

      site.partials(['test/fixtures/includes/*.hbs']);
      site.layouts(['test/fixtures/layouts/*.hbs']);
      site.data({
        posts: [
          { author: 'Brian Woodward', timestamp: '2014-11-01', summary: 'This is just a summary. First', content: 'Here\'s the real content. One' },
          { author: 'Brian Woodward', timestamp: '2014-11-02', summary: 'This is just a summary. Second', content: 'Here\'s the real content. Two' },
          { author: 'Jon Schlinkert', timestamp: '2014-11-03', summary: 'This is just a summary. Third', content: 'Here\'s the real content. Three' },
          { author: 'Jon Schlinkert', timestamp: '2014-11-04', summary: 'This is just a summary. Fourth', content: 'Here\'s the real content. Four' },
          { author: 'Brian Woodward', timestamp: '2014-11-05', summary: 'This is just a summary. Fifth', content: 'Here\'s the real content. Five' },
        ]
      });

      site.src('test/fixtures/pages/*.hbs')
        .pipe(site.dest(actual))
        .on('data', function (file) {
          file.options.layoutApplied.should.be.true;
          (file.path.indexOf('.html') > -1).should.be.true;
          (file.contents.toString().indexOf('doctype html') > -1).should.be.true;
        })
        .on('error', done)
        .on('end', done);

    });
  });
});
