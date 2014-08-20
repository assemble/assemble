/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var matter = require('gray-matter');
var should = require('should');
var utils = require('../lib/utils');

describe('utils', function() {

  describe('.noop()', function () {
    it('should return the same value passed in', function () {
      utils.noop('foo').should.eql('foo');
    });
  });

  describe('.noopStream()', function () {
    it('should return a passthrough stream', function () {
      var stream = utils.noopStream();
      should.exist(stream);
      should.exist(stream.on);
    });
  });

  describe('.fixPath()', function () {
    it('should fix a path with a lowercase drive letter', function () {
      utils.fixPath('c:\\', 'some', 'file', 'path')[0].should.equal('C');
    });
  });

  describe('.typeOf()', function () {
    it('should get typeof String', function () {
      utils.typeOf('foo').should.equal('string');
    });
    it('should get typeof Object', function () {
      utils.typeOf({foo: 'bar'}).should.equal('object');
    });
    it('should get typeof Array', function () {
      utils.typeOf(['foo', 'bar']).should.equal('array');
    });
    it('should get typeof Function', function () {
      utils.typeOf(function () { return 'foo'; }).should.equal('function');
    });
  });

  describe('.formatExt()', function () {
    it('should prepend a . to the extension', function () {
      utils.formatExt('hbs').should.equal('.hbs');
    });
    it('should keep the extension', function () {
      utils.formatExt('.hbs').should.equal('.hbs');
    });
  });

  describe('.stripExtDot()', function () {
    it('should remove the . from the extension', function () {
      utils.stripExtDot('.hbs').should.equal('hbs');
    });
    it('should keep the extension', function () {
      utils.stripExtDot('hbs').should.equal('hbs');
    });
  });

  describe('.engineDelims()', function () {
    it('should return the correct delimiters when extension contains a dot', function () {
      utils.engineDelims('.hbs').should.eql(['{{', '}}']);
      utils.engineDelims('.handlebars').should.eql(['{{', '}}']);
    });
    it('should return the correct delimiters when extension does not contain a dot', function () {
      utils.engineDelims('hbs').should.eql(['{{', '}}']);
      utils.engineDelims('handlebars').should.eql(['{{', '}}']);
    });
  });

});
