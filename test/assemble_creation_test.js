/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var assemble = require('../');

describe('assemble', function() {

  describe('App instances', function() {

    it('should create an instance of App', function() {
      var actual = assemble();
      expect(actual).to.be.an.instanceof(assemble);
    });

    it('should create two instances of App that are different', function() {
      var expected = assemble();
      var actual = assemble();
      expect(expected).to.not.eql(actual);
    });

  });

});
