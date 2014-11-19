'use strict';

var path = require('path');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var assemble = require('..');

var site = null;
var actual = __dirname + '/drafts-actual';

describe('assemble drafts plugin', function() {
  before (function () {
    site = assemble.createInst();
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
          /[ab]\.html$/.test(String(file.path)).should.be.false;
          /[cd]\.html$/.test(String(file.path)).should.be.true;
          /[CD]/.test(String(file.contents)).should.be.true;
          Object.keys(site.views.pages).length.should.equal(4);
        });

        outstream.on('end', function () {
          done();
        });
      });
    });
  });
});
