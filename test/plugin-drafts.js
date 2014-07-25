'use strict';

var path = require('path');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var assemble = require('..');
require('mocha');

var drafts = require('../lib/plugins/drafts')(assemble);
var actual = __dirname + '/drafts-actual';


describe('assemble drafts plugin', function() {
  before (function () {
    assemble.init();
  });

  describe('drafts()', function() {
    beforeEach(function (done) {
      rimraf(actual, done);
    });
    afterEach(function (done) {
      rimraf(actual, done);
    });

    describe('drafts', function () {
      it('should have an empty `files` cache', function (done) {
        var instream = assemble.src(path.join(__dirname, 'fixtures/drafts/*.hbs'));
        var outstream = assemble.dest(actual);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          /[ab]\.html$/.test(String(file.path)).should.be.false;
          /[cd]\.html$/.test(String(file.path)).should.be.true;
          /[CD]/.test(String(file.contents)).should.be.true;
          assemble.files.length.should.equal(4);
        });

        outstream.on('end', function () {
          done();
        });
      });
    });

  });
});
