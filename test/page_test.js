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

describe('page', function() {
  describe('model', function() {

    it('should create a new page model', function() {
      var actual = new assemble.models.Page();
      expect(actual).to.be.an.instanceof(assemble.models.Page);
    });

    it('should have default properties', function() {
      var actual = new assemble.models.Page();
      expect(actual).to.have.property('src');
    });

    it('should initialize given options', function() {
      var options = {
        foo: 'bar'
      };
      var actual = new assemble.models.Page(options);
      expect(actual).to.have.property('foo');
    });

  });
});