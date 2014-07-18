/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var expect = require('expect');
var helper = require('../lib/utils/helper');

var one = require('./fixtures/helpers/one')();
var two = require('./fixtures/helpers/two');
var three = require('./fixtures/helpers/three');

describe('assemble helpers', function () {
  describe('helper()', function () {

    it('should load helpers from a string', function () {
        var options = {
          helpers: 'test/fixtures/helpers/one.js'
        };
        var actual = helper(options);
        // console.log('actual');
    });

    it('should load helpers from a function', function () {
        var options = {
          helpers: function () {
            return {
              foo: function () { return 'hi'; }
            };
          }
        };
        var actual = helper(options);
        // console.log('actual');
    });

    it('should load helpers from an object', function () {
        var options = {
          helpers: {
            foo: function () { return 'hi'; }
          }
        };
        var actual = helper(options);
        // console.log('actual');
    });

    it('should load helpers from an array', function () {
        var options = {
          helpers: [
            'test/fixtures/helpers/two.js',
            { foo: function () { return 'hi'; }},
            function () { return { foo: function () { return 'hi'; }}},
            [
              'test/fixtures/helpers/three.js',
              { bar: function () { return 'hi'; }},
              function () { return { bar: function () { return 'hi'; }}},
            ]
          ]
        };
        var actual = helper(options);
        // console.log('actual');
    });

  });
});