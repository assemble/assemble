  /**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var _ = require('lodash');

var assemble = require('../lib/assemble');

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
      name: 'minxins-test-1',
      source: 'Some Template',
      metadata: {
        mixins: mixins
      }
    };

    assemble(options).build(function (err) {
      if (err) {
        console.log('Error:', err);
      }
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

  it('should load mixins into a fn namespace on lodash', function (done) {
    var options = {
      name: 'mixins-test-2',
      source: 'Some Template',
      metadata: {
        mixins: mixins,
        noconflict: true
      }
    };

    assemble(options).build(function (err) {
      if (err) {
        console.log('Error:', err);
      }
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


  it('should load mixins into a custom namespace on lodash', function (done) {
    var options = {
      name: 'mixins-test-3',
      source: 'Some Template',
      metadata: {
        mixins: mixins,
        noconflict: 'custom'
      }
    };

    assemble(options).build(function (err) {
      if (err) {
        console.log('Error:', err);
      }
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