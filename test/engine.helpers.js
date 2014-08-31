/**!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var loader = require('load-helpers');

describe('helper loader', function () {
  it('should load helpers from a file path', function () {
    var helpers = loader();

    var str = __dirname + '/fixtures/helpers/wrapped.js';
    var actual = helpers.load(__dirname + '/fixtures/helpers/wrapped.js');

    actual.cache.should.have.property('wrapped');
    assert.equal(typeof actual.cache.wrapped, 'function');
  });

  it('should load helpers from a function', function () {
    var helpers = loader();

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

    var actual = helpers.load(fn);

    actual.cache.should.have.property('foo');
    actual.cache.should.have.property('bar');
    // assert.equal(typeof actual.cache.wrapped, 'object');
  });

  describe('helper.object()', function () {
    it('should load helpers from an object', function () {
      var helpers = loader();

      var obj = require('./fixtures/helpers/wrapped');
      var actual = helpers.load(obj);

      actual.cache.should.have.property('wrapped');
      var wrapped = helpers.get('wrapped');
      assert.equal(typeof wrapped, 'function');
    });
  });

  describe('helper.array()', function () {
    it('should load different types of helpers from an array', function () {
      var helpers = loader();

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
          };
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
            };
          }
        ]
      ];

      var actual = helpers._array(arr);
      actual.cache.should.have.property('two');
      actual.cache.should.have.property('foo');
      actual.cache.should.have.property('three');
      actual.cache.should.have.property('bar');

      assert.equal(typeof actual.cache.two, 'function');
      assert.equal(typeof actual.cache.three, 'function');
      assert.equal(typeof actual.cache.foo, 'function');
      assert.equal(typeof actual.cache.bar, 'function');
    });
  });

  describe('.load()', function () {
    it('should load helpers from a string', function () {
      var helpers = loader();

      var str = __dirname + '/fixtures/helpers/wrapped.js';
      var actual = helpers.load(str);

      actual.cache.should.have.property('wrapped');
      assert.equal(typeof actual.cache.wrapped, 'function');
    });

    it('should load helpers from a function', function () {
      var helpers = loader();

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
      var actual = helpers.load(fn);

      actual.cache.should.have.property('foo');
      actual.cache.should.have.property('bar');
      assert.equal(typeof actual.cache.foo, 'function');
      assert.equal(typeof actual.cache.bar, 'function');
    });

    it('should load helpers from an object', function () {
      var helpers = loader();

      var obj = require('./fixtures/helpers/wrapped')();
      var actual = helpers.load(obj);

      actual.cache.should.have.property('wrapped');
      assert.equal(typeof actual.cache.wrapped, 'function');
    });

    it('should load helpers from a function', function () {
      var helpers = loader();

      var fn = require('./fixtures/helpers/two');
      var actual = helpers.load(fn);
      actual.cache.should.have.property('two');
      assert.equal(typeof actual.cache.two, 'function');
    });

    it('should load helpers from an object', function () {
      var helpers = loader();

      var obj = {
        foo: function () {
          return 'hi';
        }
      };
      var actual = helpers.load(obj);

      actual.cache.should.have.property('foo');
      assert.equal(typeof actual.cache.foo, 'function');
    });

    it('should load different types of helpers from an array', function () {
      var helpers = loader();

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
          };
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
            };
          }
        ]
      ];

      var actual = helpers.load(arr);

      actual.cache.should.have.property('two');
      actual.cache.should.have.property('foo');
      actual.cache.should.have.property('three');
      actual.cache.should.have.property('bar');

      assert.equal(typeof actual.cache.foo, 'function');
      assert.equal(typeof actual.cache.bar, 'function');
      assert.equal(typeof actual.cache.two, 'function');
      assert.equal(typeof actual.cache.three, 'function');
    });
  });
});
