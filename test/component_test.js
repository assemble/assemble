/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var expect = require('chai').expect;
var assemble = require('../');

describe('component', function() {
  describe('model', function() {

    it('should create a new component model', function() {
      var actual = new assemble.models.Component();
      expect(actual).to.be.an.instanceof(assemble.models.Component);
    });

    it('should have default properties', function() {
      var actual = new assemble.models.Component();
      expect(actual).to.have.property('content');
    });

    it('should initialize given options', function() {
      var options = {
        foo: 'bar'
      };
      var actual = new assemble.models.Component(options);
      expect(actual).to.have.property('foo');
    });

  });
});
