/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var path = require('path');
var debug = require('debug')('test:Page');

var Loader = require('../lib/loader.js');
var assemble = require('..');

describe('Page', function () {
  beforeEach(function (cb) {
    assemble.init();
    cb();
  });

  describe('new Loader()', function () {
    it('should create a new instance of Loader', function () {
      var page = new Loader();
      debug('page', page);
      should.exist(page);
      page.should.be.instanceOf(Loader);
    });
  });

  describe('assemble.page()', function () {
    it('should create a new instance of Page', function () {
      var page = assemble.page();
      debug('page', page);
      should.exist(page);
      page.should.be.instanceOf(Loader);
    });
  });

  describe('.normalize()', function () {

    describe('string', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var page = new Loader();
        var pages = page.normalize('test/fixtures/templates/no-helpers/*.hbs');
        debug('pages', pages);
        pages.length.should.equal(4);
      });
    });

    describe('object with one file', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var page = new Loader();
        var config = {
          filepath: 'foo.hbs',
          data: {
            name: 'Brian'
          },
          content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
        };
        debug('config', config);
        var pages = page.normalize(config);
        debug('pages', pages);
        pages.length.should.equal(1);
        pages[0].path.should.equal(path.join(process.cwd(), 'foo.hbs'));
        pages[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[0].data.should.eql({title: 'Foo', name: 'Brian'});
      });
    });

    describe('object with many files', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var page = new Loader();
        var config = {
          'foo.hbs': {
            filepath: 'foo.hbs',
            data: {
              name: 'Brian'
            },
            content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
          },
          'bar.hbs': {
            filepath: 'bar.hbs',
            data: {
              name: 'Jon'
            },
            content: '---\ntitle: Bar\n---\nHi {{name}} from {{title}}\n'
          }
        };
        debug('config', config);
        var pages = page.normalize(config);
        debug('pages', pages);
        pages.length.should.equal(2);
        pages[0].path.should.equal(path.join(process.cwd(), 'foo.hbs'));
        pages[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[0].data.should.eql({title: 'Foo', name: 'Brian'});

        pages[1].path.should.equal(path.join(process.cwd(), 'bar.hbs'));
        pages[1].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[1].data.should.eql({title: 'Bar', name: 'Jon'});

      });

    });

    describe('array', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var page = new Loader();
        var config = [
          {
            filepath: 'foo.hbs',
            data: {
              name: 'Brian'
            },
            content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
          },
          {
            filepath: 'bar.hbs',
            data: {
              name: 'Jon'
            },
            content: '---\ntitle: Bar\n---\nHi {{name}} from {{title}}\n'
          }
        ];
        debug('config', config);
        var pages = page.normalize(config);
        debug('pages', pages);
        pages.length.should.equal(2);
        pages[0].path.should.equal(path.join(process.cwd(), 'foo.hbs'));
        pages[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[0].data.should.eql({title: 'Foo', name: 'Brian'});

        pages[1].path.should.equal(path.join(process.cwd(), 'bar.hbs'));
        pages[1].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[1].data.should.eql({title: 'Bar', name: 'Jon'});

      });
    });

    describe('function', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var page = new Loader();
        var config = function () {
          return [
            {
              filepath: 'foo.hbs',
              data: {
                name: 'Brian'
              },
              content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
            },
            {
              filepath: 'bar.hbs',
              data: {
                name: 'Jon'
              },
              content: '---\ntitle: Bar\n---\nHi {{name}} from {{title}}\n'
            }
          ];
        };
        debug('config', config);
        var pages = page.normalize(config);
        debug('pages', pages);
        pages.length.should.equal(2);
        pages[0].path.should.equal(path.join(process.cwd(), 'foo.hbs'));
        pages[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[0].data.should.eql({title: 'Foo', name: 'Brian'});

        pages[1].path.should.equal(path.join(process.cwd(), 'bar.hbs'));
        pages[1].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        pages[1].data.should.eql({title: 'Bar', name: 'Jon'});

      });
    });


  });
});