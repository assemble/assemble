/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var _ = require('lodash');

var utils = require('./lib/utils');
var assemble = require('../');

var mixins = [
  {
    a: function (str) { return 'a: ' + str; },
    b: function (str) { return 'b: ' + str; },
    c: function (str) { return 'c: ' + str; }
  }
];

describe('mixins', function () {

  it('should load mixins into lodash', function (done) {
    var options = {
      src: 'Some Template',
      mixins: mixins
    };

    assemble(options).build(function (err) {
      if (err) {
        console.log('Error:', err);
      }
      utils.normalizeStack(function () {
        expect(_).to.have.property('a');
        expect(_).to.have.property('b');
        expect(_).to.have.property('c');

        delete _.a;
        delete _.prototype.a;
        delete _.b;
        delete _.prototype.b;
        delete _.c;
        delete _.prototype.c;
        done();
      });
    });
  });

  it('should load mixins into a fn namespace on lodash', function (done) {
    var options = {
      src: 'Some Template',
      mixins: mixins,
      noconflict: true
    };

    assemble(options).build(function (err) {
      if (err) {
        console.log('Error:', err);
      }
      utils.normalizeStack(function () {
        expect(_).to.have.property('fn');
        expect(_.fn).to.have.property('a');
        expect(_.fn).to.have.property('b');
        expect(_.fn).to.have.property('c');

        delete _.fn.a;
        delete _.fn.prototype.a;
        delete _.fn.b;
        delete _.fn.prototype.b;
        delete _.fn.c;
        delete _.fn.prototype.c;

        delete _.fn;
        done();
      });
    });
  });


  it('should load mixins into a custom namespace on lodash', function (done) {
    var options = {
      src: 'Some Template',
      mixins: mixins,
      noconflict: 'custom'
    };

    assemble(options).build(function (err) {
      if (err) {
        console.log('Error:', err);
      }
      utils.normalizeStack(function () {
        expect(_).to.have.property('custom');
        expect(_.custom).to.have.property('a');
        expect(_.custom).to.have.property('b');
        expect(_.custom).to.have.property('c');

        delete _.custom.a;
        delete _.custom.prototype.a;
        delete _.custom.b;
        delete _.custom.prototype.b;
        delete _.custom.c;
        delete _.custom.prototype.c;

        delete _.custom;
        done();
      });
    });
  });

});
