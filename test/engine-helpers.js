/**!
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var helpers = require('../lib/engine/helpers');


describe('assemble helpers', function () {

  describe('helper.fromPath()', function () {
    it('should load helpers from a string', function () {
      var str = __dirname + '/fixtures/helpers/wrapped.js'
      var actual = helpers.fromPath(str);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('wrapped');
    });
  });

  describe('helper.fromFn()', function () {
    it('should load helpers from a function', function () {
      var fn = function () {
        return {
          foo: function () {
            return 'foo';
          },
          bar: function () {
            return 'bar';
          }
        };
      };
      var actual = helpers.fromFn(fn);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('foo');
      actual.should.have.property('bar');
    });
  });

  describe('helper.fromObj()', function () {
    it('should load helpers from an object', function () {
      var obj = require('./fixtures/helpers/wrapped')()
      var actual = helpers.fromObj(obj);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('wrapped');
    });
  });

  describe('helper.fromArr()', function () {
    it('should load different types of helpers from an array', function () {
      var arr = [
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
      ];

      var actual = helpers.fromArr(arr);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('two');
      actual.should.have.property('foo');
      actual.should.have.property('three');
      actual.should.have.property('bar');
    });
  });

  describe('helper()', function () {
    it('should load helpers from a string', function () {
      var str = __dirname + '/fixtures/helpers/wrapped.js'
      var actual = helpers(str);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('wrapped');
    });

    it('should load helpers from a function', function () {
      var fn = function () {
        return {
          foo: function () {
            return 'foo';
          },
          bar: function () {
            return 'bar';
          }
        };
      };
      var actual = helpers(fn);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('foo');
      actual.should.have.property('bar');
    });

    it('should load helpers from an object', function () {
      var obj = require('./fixtures/helpers/wrapped')()
      var actual = helpers(obj);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('wrapped');
    });

    it('should load helpers from a function', function () {
      var fn = require('./fixtures/helpers/two');
      var actual = helpers(fn);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('two');
    });

    it('should load helpers from an object', function () {
      var obj = {
        foo: function () {
          return 'hi';
        }
      };
      var actual = helpers(obj);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('foo');
    });

    it('should load different types of helpers from an array', function () {
      var arr = [
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
      ];

      var actual = helpers(arr);
      (typeof actual === 'object').should.be.true;
      actual.should.have.property('two');
      actual.should.have.property('foo');
      actual.should.have.property('three');
      actual.should.have.property('bar');
    });
  });
});