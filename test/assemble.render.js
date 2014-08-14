/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var rimraf = require('rimraf');
var tap = require('gulp-tap');

var Assemble = require('..');
var actual = __dirname + '/render-actual';

describe('assemble render', function () {
  describe('assemble.render()', function () {
    var assemble = null;
    beforeEach(function (done) {
      assemble = Assemble.create();
      rimraf(actual, done);
    });

    afterEach(function(done) {
      rimraf(actual, done);
    });

    it('should render a file', function (done) {
      assemble.option({
        layout: 'default'
      });
      assemble.partials('test/fixtures/includes/*.hbs');
      assemble.layouts('test/fixtures/layouts/*.hbs');

      assemble.src('test/fixtures/pages/*.hbs')
        // .pipe(tap(function (file) {
        //   console.log('tap-file', file.contents.toString());
        //   console.log('tap-hasLayout', file.hasLayout);
        //   console.log();
        // }))
        .pipe(assemble.dest(actual))
        // .on('data', function (file) {
        //   console.log('file', file.contents.toString());
        //   console.log('hasLayout', file.hasLayout);
        //   console.log();
        // })
        // .on('error', function (err) {
        //   console.log('Error', err);
        //   done(err);
        // })
        .on('end', done);

    });
  });
});