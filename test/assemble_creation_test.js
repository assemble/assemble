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
var assemble = require('../lib/assemble');

describe('assemble', function() {

  describe('Line instances', function() {
  
    it('should create an instance of Line', function() {
      var actual = assemble();
      expect(actual).to.be.an.instanceof(assemble.Line);
    });

    it('should create an instance of Line and store it in the instanceCache', function() {
      assemble();
      expect(assemble.instanceCache).to.have.property('default');
    });

    it('should create a named instance of Line and store it in the instanceCache', function() {
        assemble('test');
        expect(assemble.instanceCache).to.have.property('test');
    });

    it('should create an instance of Line and be able to retrieve the same instance from instanceCache', function() {
      var expected = assemble('test2');
      var actual = assemble('test2');
      expect(expected).to.eql(actual);
    });

    it('should create two instances of Line that are different', function() {
      var expected = assemble('test3');
      var actual = assemble('test4');
      expect(expected).to.not.eql(actual);
    });

  });

});