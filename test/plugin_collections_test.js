
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

  it('should create a collection object', function() {
    var actual = new assemble.models.Collection({
      name: name()
    });
    expect(actual).to.be.an.instanceof(assemble.models.Collection);
  });

  it('should create collection objects from assemble.options.collections', function () {
  });

  it('should add pages to collections objects', function (){
  });

  it('should sort pages in a collection by page name/src', function () {
  });

  it('should sort pages in a collection by a property in the page yfm', function () {
  });

  it('should sort pages in a collection by a custom sort function', function () {
  });

  it('should retrieve pages from a collection by collection key', function () {
  });

  it('should retrieve pages from a collection filtered by a page yfm property', function () {
  });

  it('should retrieve pages from a collection filtered by a custom function', function () {
  });

});
