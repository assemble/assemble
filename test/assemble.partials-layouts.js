/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var fs = require('graceful-fs');
var path = require('path');
var should = require('should');
var File = require('vinyl');
var rimraf = require('rimraf');
var assemble = require('..');
var site = null;

var actual = __dirname + '/layouts-actual';

describe('assemble partials-layouts', function () {
  beforeEach(function (done) {
    site = new assemble.createInst();
    rimraf(actual, done);
  });
  afterEach(function (done) {
    rimraf(actual, done);
  });


  it('should use layouts defined in partials', function (done) {
    site.layouts({
      'default': {
        path: 'default',
        locals: {title: 'Default Layout'},
        content: 'LAYOUT A {{body}} LAYOUT A'
      },
      'slide': {
        path: 'slide',
        locals: {title: 'Slide Layout', layout: 'default'},
        content: 'SLIDE A {{body}} SLIDE A'
      },
      'LAAA': {
        path: 'LAAA',
        locals: {title: 'Layout AAA', layout: 'LAAA'},
        content: 'LAYOUT A {{body}} LAYOUT A'
      },
      'LBBB': {
        path: 'LBBB',
        locals: {title: 'Layout BBB', layout: 'LBBB'},
        content: 'LAYOUT B {{body}} LAYOUT B'
      },
      'LCCC': {
        path: 'LCCC',
        locals: {title: 'Layout CCC', layout: 'default'},
        content: 'LAYOUT C {{body}} LAYOUT C'
      }
    });

    var layouts = site.views.layouts;
    layouts.should.have.property('LAAA');
    layouts.should.have.property('LBBB');
    layouts.should.have.property('LCCC');

    site.partials({
      'P111': {
        path: 'P111',
        locals: {title: 'P111', layout: 'slide'},
        content: 'Partial 111 content'
      },
      'P222': {
        path: 'P222',
        locals: {title: 'P222', layout: 'slide'},
        content: 'Partial 222 content'
      },
      'P333': {
        path: 'P333',
        locals: {title: 'P333', layout: 'slide'},
        content: 'Partial 333 content'
      }
    });

    var partials = site.views.partials;
    partials.should.have.property('P111');
    partials.should.have.property('P222');
    partials.should.have.property('P333');

    site.pages({
      'PAGE111': {
        path: 'PAGE111',
        locals: {title: 'PAGE111', layout: 'LAAA'},
        content: 'Partial 111 content'
      },
      'PAGE222': {
        path: 'PAGE222',
        locals: {title: 'PAGE222', layout: 'LAAA'},
        content: 'Partial 222 content'
      },
      'PAGE333': {
        path: 'PAGE333',
        locals: {title: 'PAGE333', layout: 'LAAA'},
        content: 'Partial 333 content'
      }
    });

    var pages = site.views.pages;
    pages.should.have.property('PAGE111');
    pages.should.have.property('PAGE222');
    pages.should.have.property('PAGE333');

    done();

    // var instream = site.src(path.join(__dirname, 'fixtures/templates/with-helpers/*.hbs'));
    // var outstream = site.dest(actual);
    // instream.pipe(outstream);

    // outstream.on('error', done);
    // outstream.on('data', function (file) {
    //   should.exist(file);
    //   should.exist(file.path);
    //   should.exist(file.contents);
    //   /none:\s+([abcd])/.test(String(file.contents)).should.be.true;
    //   /helper:\s+[ABCD]/.test(String(file.contents)).should.be.true;
    //   /foo[abcd]/.test(String(file.contents)).should.be.true;
    // });

    // outstream.on('end', function () {
    //   done();
    // });
  });
});
