/**!
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var helper = require('../lib/engine/helpers');

describe('assemble helpers', function () {
  describe('helper()', function () {
    it('should load helpers from a string', function () {
      var options = {
        helpers: 'test/fixtures/helpers/one.js'
      };
      (typeof helper(options) === 'object').should.be.true;
      helper(options).should.have.property('one');
    });

    it('should load helpers from a function', function () {
      var options = {
        helpers: function () {
          return {
            foo: function () {
              return 'foo';
            },
            bar: function () {
              return 'bar';
            }
          };
        }
      };
      (typeof helper(options) === 'object').should.be.true;
      helper(options).should.have.property('foo');
      helper(options).should.have.property('bar');
    });

    it('should load helpers from an object', function () {
      var options = {
        helpers: require('./fixtures/helpers/one')()
      };
      (typeof helper(options) === 'object').should.be.true;
      helper(options).should.have.property('one');
    });

    it('should load helpers from a function', function () {
      var options = {
        helpers: require('./fixtures/helpers/two')
      };
      (typeof helper(options) === 'object').should.be.true;
      helper(options).should.have.property('two');
    });

    it('should load helpers from an object', function () {
      var options = {
        helpers: {
          foo: function () {
            return 'hi';
          }
        }
      };
      (typeof helper(options) === 'object').should.be.true;
      helper(options).should.have.property('foo');
    });

    it('should load different types of helpers from an array', function () {
      var options = {
        helpers: [
          'test/fixtures/helpers/two.js',
          {
            foo: function () {
              return 'hi';
            }
          },
          function () {
            return {
              foo: function () {
                return 'hi';
              }
            }
          },
          [
            'test/fixtures/helpers/three.js',
            {
              bar: function () {
                return 'hi';
              }
            },
            function () {
              return {
                bar: function () {
                  return 'hi';
                }
              }
            },
          ]
        ]
      };
      (typeof helper(options) === 'object').should.be.true;
      helper(options).should.have.property('two');
      helper(options).should.have.property('foo');
      helper(options).should.have.property('three');
      helper(options).should.have.property('bar');
    });
  });
});