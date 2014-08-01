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
var debug = require('debug')('test:Loader');

var Loader = require('../lib/loader.js');
var assemble = require('..');

describe('Loader', function () {
  beforeEach(function (cb) {
    assemble.init();
    cb();
  });

  describe('new Loader()', function () {
    it('should create a new instance of Loader', function () {
      var loader = new Loader();
      debug('loader', loader);
      should.exist(loader);
      loader.should.be.instanceOf(Loader);
    });
  });

  describe('assemble.loader()', function () {
    it('should create a new instance of Loader', function () {
      var loader = assemble.page();
      debug('loader', loader);
      should.exist(loader);
      loader.should.be.instanceOf(Loader);
    });
  });

  describe('.normalize()', function () {

    describe('string', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var loader = new Loader();
        var loaders = loader.normalize('test/fixtures/templates/no-helpers/*.hbs');
        debug('loaders', loaders);
        loaders.length.should.equal(4);
      });
    });

    describe('object with one file', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var loader = new Loader();
        var config = {
          filepath: 'foo.hbs',
          data: {
            name: 'Brian'
          },
          content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
        };
        debug('config', config);
        var loaders = loader.normalize(config);
        debug('loaders', loaders);
        loaders.length.should.equal(1);
        loaders[0].path.toLowerCase().should.equal(path.join(process.cwd(), 'foo.hbs').toLowerCase());
        loaders[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[0].data.should.eql({title: 'Foo', name: 'Brian'});
      });
    });

    describe('object with many files', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var loader = new Loader();
        var config = {
          'foo.hbs': {
            filepath: 'foo.hbs',
            data: {name: 'Brian'},
            content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
          },
          'bar.hbs': {
            filepath: 'bar.hbs',
            data: {name: 'Jon'},
            content: '---\ntitle: Bar\n---\nHi {{name}} from {{title}}\n'
          }
        };
        debug('config', config);
        var loaders = loader.normalize(config);
        debug('loaders', loaders);
        loaders.length.should.equal(2);
        loaders[0].path.toLowerCase().should.equal(path.join(process.cwd(), 'foo.hbs').toLowerCase());
        loaders[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[0].data.should.eql({title: 'Foo', name: 'Brian'});

        loaders[1].path.toLowerCase().should.equal(path.join(process.cwd(), 'bar.hbs').toLowerCase());
        loaders[1].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[1].data.should.eql({title: 'Bar', name: 'Jon'});

      });

    });

    describe('array', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var loader = new Loader();
        var config = [
          {
            filepath: 'foo.hbs',
            data: {name: 'Brian'},
            content: '---\ntitle: Foo\n---\nHi {{name}} from {{title}}\n'
          },
          {
            filepath: 'bar.hbs',
            data: {name: 'Jon'},
            content: '---\ntitle: Bar\n---\nHi {{name}} from {{title}}\n'
          }
        ];
        debug('config', config);
        var loaders = loader.normalize(config);
        debug('loaders', loaders);
        loaders.length.should.equal(2);
        loaders[0].path.toLowerCase().should.equal(path.join(process.cwd(), 'foo.hbs').toLowerCase());
        loaders[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[0].data.should.eql({title: 'Foo', name: 'Brian'});

        loaders[1].path.toLowerCase().should.equal(path.join(process.cwd(), 'bar.hbs').toLowerCase());
        loaders[1].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[1].data.should.eql({title: 'Bar', name: 'Jon'});

      });
    });

    describe('function', function () {
      it('should normalize files to a new vinyl file object.', function () {
        var loader = new Loader();
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
        var loaders = loader.normalize(config);
        debug('loaders', loaders);
        loaders.length.should.equal(2);
        loaders[0].path.toLowerCase().should.equal(path.join(process.cwd(), 'foo.hbs').toLowerCase());
        loaders[0].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[0].data.should.eql({title: 'Foo', name: 'Brian'});

        loaders[1].path.toLowerCase().should.equal(path.join(process.cwd(), 'bar.hbs').toLowerCase());
        loaders[1].contents.toString().should.equal('\nHi {{name}} from {{title}}\n');
        loaders[1].data.should.eql({title: 'Bar', name: 'Jon'});

      });
    });
  });
});