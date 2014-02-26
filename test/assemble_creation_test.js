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

  describe('App instances', function() {

    it('should create an instance of App', function() {
      var actual = assemble();
      expect(actual).to.be.an.instanceof(assemble.App);
    });

    it('should create an instance of App and store it in the instanceCache', function() {
      assemble();
      var actual = assemble.instanceCache.get('default');
      expect(actual).to.not.equal(undefined);
    });

    it('should create a named instance of App and store it in the instanceCache', function() {
        assemble({name:'test'});
        var actual = assemble.instanceCache.get('test');
        expect(actual).to.not.equal(undefined);
    });

    it('should create an instance of App and be able to retrieve the same instance from instanceCache', function() {
      var expected = assemble({name:'test2'});
      var actual = assemble({name:'test2'});
      expect(expected).to.eql(actual);
    });

    it('should create two instances of App that are different', function() {
      var expected = assemble({name:'test3'});
      var actual = assemble({name:'test4'});
      expect(expected).to.not.eql(actual);
    });

    it('should not have an instance of a fake name', function () {
      var actual = assemble.instanceCache.get('not-a-real-assemble-instance');
      expect(actual).to.eql(null);
    });

  });

});