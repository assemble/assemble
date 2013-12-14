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

    it('should create a named instance of Assemble and store it in the instanceCache', function() {
        var actual = assemble('test');
        expect(assemble.instanceCache).to.have.property('test');
    });

    it('should create an instance of Assemble and be able to retrieve the same instance from instanceCache', function() {
      var expected = assemble('test2');
      var actual = assemble('test2');
      expect(expected).to.eql(actual);
    });

    it('should create two instances of Assemble that are different', function() {
      var expected = assemble('test3');
      var actual = assemble('test4');
      expect(expected).to.not.eql(actual);
    });

  });

});