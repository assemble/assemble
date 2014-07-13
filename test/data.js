/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble data', function() {
  beforeEach(function() {
    assemble.clearCache();
  });

  // it("should set properties on the `data` object.", function() {
  //   assemble.set('data.foo', 'bar');
  //   assemble.get('data').foo.should.equal('bar');
  //   assemble.get('data.foo').should.equal('bar');
  // });

  // it("should read files and merge data onto `cache.data`", function() {
  //   assemble.data('package.json').cache.name.should.equal('assemble');
  // });

  // it("should read files and merge data onto `cache.data`", function() {
  //   assemble.data('package.json').cache.name.should.equal('assemble');
  // });


  describe('config templates', function() {
    describe('when functions are defined on the config', function() {
      assemble.data({upper: function(foo) {
        return (foo + '-boom-pow!').toUpperCase();
      }});

      it("should allow them to be used in config templates", function() {
        assemble.data({fez: 'bang', aaa: 'bbb'});
        assemble.data({whistle: '<%= upper(fez) %>'});

        // console.log(assemble)
        assemble.get('data.whistle').should.equal('BANG-BOOM-POW!');
      });
    });
  });
});
