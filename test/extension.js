/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');

var extension = require('../lib/extensions');

function inspect (obj) {
  return require('util').inspect(obj, null, 10);
}

describe('extension', function () {

  var Assemble = function () {
    var args = arguments;
    Assemble.constructorStack.forEach(function (constructor) {
      constructor.apply(this, args);
    }, this);
  }

  describe('.extend(Assemble)', function () {
    it('should add extension method to assemble object', function () {
      extension.extend(Assemble);
      Assemble.should.have.property('extension');
      Assemble.prototype.should.have.property('extension');
    });
  });

  describe('init(Assemble)', function () {
    it('should add extension method and default extensions to assemble object', function () {
      var extensions = [
        __dirname + '/fixtures/extensions/foo-class',
        __dirname + '/fixtures/extensions/foo-function',
        __dirname + '/fixtures/extensions/foo-object'
      ];
      extension.extend(Assemble);
      extension.init(Assemble, extensions);
      var assemble = new Assemble();

      Assemble.prototype.should.have.property('fooClass');
      assemble.should.have.property('foo-class');
      assemble['foo-class'].should.equal('bar-class');
      assemble.fooClass().should.equal('boop-class');

      Assemble.prototype.should.have.property('fooFunction');
      Assemble.prototype.should.have.property('foo-function');
      Assemble.prototype['foo-function'].should.equal('bar-function');
      assemble.fooFunction().should.equal('boop-function');

      Assemble.prototype.should.have.property('fooObject');
      Assemble.prototype.should.have.property('foo-object');
      Assemble.prototype['foo-object'].should.equal('bar-object');
      assemble.fooObject().should.equal('boop-object');

    });
  });

  describe('.extension', function () {
    it('should create a new method when calling from a Class', function () {
      extension.extend(Assemble);
      Assemble.extension(require(__dirname + '/fixtures/extensions/foo-assemble-class'));
      Assemble.prototype.should.have.property('fooAssembleClass');
      var assemble = new Assemble();
      assemble.should.have.property('foo-assemble-class');
      assemble['foo-assemble-class'].should.equal('bar-assemble-class');
      assemble.fooAssembleClass().should.equal('boop-assemble-class');
    });
    it('should create a new method when calling from an instance', function () {
      extension.extend(Assemble);
      var assemble = new Assemble();
      assemble.extension(require(__dirname + '/fixtures/extensions/foo-assemble-instance'));
      Assemble.prototype.should.have.property('fooAssembleInstance');
      assemble.should.have.property('foo-assemble-instance');
      assemble['foo-assemble-instance'].should.equal('bar-assemble-instance');
      assemble.fooAssembleInstance().should.equal('boop-assemble-instance');
    });
  });

  describe('.foo', function () {
    it('should add a `foo` method and call it.', function () {
      var aExtension = function (a) {
        a.prototype.foo = function (bar) {
          return bar + ' baz';
        };
      }
      extension.extend(Assemble);
      Assemble.extension(aExtension);
      Assemble.prototype.should.have.property('foo');
      var assemble = new Assemble();
      assemble.foo('hello').should.equal('hello baz');
    });
  });

});