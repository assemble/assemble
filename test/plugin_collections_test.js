
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
var assemble = require('../');

describe('plugins collections', function() {

  var testid = 1;
  var name = function () {
    return 'plugins-collections-test-' + (testid++);
  };

  it('should create a collections object on assemble', function (done) {
    var assembleOpts = {
      name: name(),
      metadata: {
        collections: [
          {
            name: 'tag',
            plural: 'tags'
          }
        ]
      }
    };
    assemble(assembleOpts).build(function(err, results) {
      if (err) {
        console.log('Error', err);
        return done(err);
      }
      expect(results).to.have.property('collections');
      expect(results.collections).to.have.property('tags');
      done();
    });

  });

});
