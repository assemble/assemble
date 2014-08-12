'use strict';

var path = require('path');
var fs = require('graceful-fs');
var should = require('should');
var rimraf = require('rimraf');
var Assemble = require('..');

var assemble = null;
var actual = __dirname + '/dynamic-actual';

describe('assemble dynamic plugin', function() {
  before (function () {
    assemble = Assemble.create();
  });

  describe('dynamic()', function() {
    beforeEach(function (done) {
      rimraf(actual, done);
    });
    afterEach(function (done) {
      rimraf(actual, done);
    });

    describe('when `assets` is defined on options:', function () {
      it('should set the correct `assets` property on the file.', function (done) {
        assemble.set('assets', actual + '/assets');
        var instream = assemble.src(path.join(__dirname, 'fixtures/dynamic/*.hbs'));
        var outstream = assemble.dest(actual);
        instream.pipe(outstream);

        outstream.on('error', done);
        outstream.on('data', function (file) {
          should.exist(file);
          should.exist(file.path);
          should.exist(file.contents);
          should.exist(file.assets);
          console.log('file.assets', file.assets);
          console.log('file.dest', file.dest);
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
