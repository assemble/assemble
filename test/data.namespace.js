/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');


describe('assemble data', function () {
  describe('.namespace()', function() {
    it('should namespace data using the `:basename` of the file.', function() {
      assemble.namespace(':basename', 'test/fixtures/data/alert.json');
      assemble.get('data').should.have.property('alert');
    })

    it('should namespace the data using the `:basename` of each file in a glob.', function() {
      assemble.namespace(':basename', 'test/fixtures/data/*.json');
      assemble.get('data').should.have.property('alert');
      assemble.get('data').should.have.property('test');

      // `data` property should be flattened by `assemble.root()`
      assemble.get('data').should.not.have.property('data');
    });

    it('should namespace the data using the `:basename` of each file in an array of globs.', function() {
      assemble.namespace(':basename', ['test/fixtures/data/*.json']);
      assemble.get('data').should.have.property('alert');
      assemble.get('data').should.have.property('test');

      // `data` property should be flattened by `assemble.root()`
      assemble.get('data').should.not.have.property('data');
    });

    it('should namespace the data using the `:propstring`.', function() {
      assemble.namespace(':basename', 'test/fixtures/data/data.json');
      assemble.get('data').should.have.property('root');
      assemble.get('data').should.not.have.property('data');
    });

    it('should namespace the data using the `:propstring`.', function() {
      assemble.namespace(':foo', 'test/fixtures/data/data.json', {foo: 'bar'});
      assemble.get('data').should.have.property('bar');
    });

    it('should namespace the data using the specified value.', function() {
      assemble.namespace('site', 'test/fixtures/data/data.json');
      assemble.get('data').should.have.property('site');
    });
  });
});