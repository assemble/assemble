'use strict';

var path = require('path');
var should = require('should');
var rimraf = require('rimraf');
var assemble = require('..');

var site = null;
var actual = __dirname + '/drafts-actual';

describe('assemble drafts plugin', function() {
  before (function () {
    site = assemble.init();
  });

  describe('drafts()', function() {
    beforeEach(function (done) {
      rimraf(actual, done);
    });
    afterEach(function (done) {
      rimraf(actual, done);
    });

    describe('when `draft: true` is defined in front matter:', function () {
      it('should not generate pages.', function (done) {
        var instream = site.src(path.join(__dirname, 'fixtures/drafts/*.hbs'));
        var outstream = site.dest(actual);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          String(file.path).should.match(/[ab]\.html$/);
          String(file.path).should.match(/[cd]\.html$/);
          String(file.contents).should.match(/[CD]/);
          Object.keys(site.views.pages).length.should.equal(4);
        });

        outstream.on('end', function () {
          done();
        });
      });
    });
  });
});
