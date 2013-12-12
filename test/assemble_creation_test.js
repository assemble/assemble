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
var inspect = require('util').inspect;

var assemble = require('../lib/assemble');

describe('assemble', function() {

  describe('Assemble instances', function() {
  
    it('should create an instance of Assemble', function() {
      var actual = assemble();
      expect(actual).to.be.an.instanceof(assemble.Assemble);
    });

    it('should create an instance of Assemble and store it in the instanceCache', function() {
      var actual = assemble();
      expect(assemble.instanceCache).to.have.property('default');
    });
  
  });

});