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

describe('metadata', function() {

  var metadata = null;
  var contents = 'These are my contents';

  before(function() {
    metadata = new assemble.models.Metadata();
  });

  it('should store a file', function(done) {
    metadata.setFile('test', contents, done);
  });

  it('should retreive a file', function(done) {
    metadata.getFile('test', function(err, actual) {
      expect(actual.component).to.equal(contents);
      done();
    });
  });

});
