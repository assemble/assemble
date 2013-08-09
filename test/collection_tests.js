/*global require:true */
var expect = require('chai').expect;
var util = require('../lib/util');
var _ = require('lodash');
var grunt = require('grunt');
var path = require('path');

var getCollection = function(file) {
  return grunt.file.readJSON(path.join('.', 'test', 'fixtures', 'data', 'collections', file));
};

var fakeCollection = getCollection('fakeCollection.json');

describe('Collections', function() {

  describe('Sorts', function() {

    it("by item name asc", function(done) {
      var expected = getCollection('expected-sortby-item-asc.json');
      var col = _.cloneDeep(fakeCollection);
      var actual = util.collection.sort(col);
      console.log(require('util').inspect(actual, null, 10));
      expect(actual).to.deep.equal(expected);
      done();
    });

    it("by item name desc", function(done) {
      var expected = getCollection('expected-sortby-item-desc.json');
      var col = _.cloneDeep(fakeCollection);
      col.sortorder = 'DESC';
      var actual = util.collection.sort(col);
      console.log(require('util').inspect(actual, null, 10));
      expect(actual).to.deep.equal(expected);
      done();
    });

    it("by page property asc", function(done) {
      var expected = getCollection('expected-sortby-page-property-asc.json');
      var col = _.cloneDeep(fakeCollection);
      col.sortby = 'title';
      var actual = util.collection.sort(col);
      console.log(require('util').inspect(actual, null, 10));
      expect(actual).to.deep.equal(expected);
      done();
    });

    it("by page property desc", function(done) {
      var expected = getCollection('expected-sortby-page-property-desc.json');
      var col = _.cloneDeep(fakeCollection);
      col.sortorder = 'DESC';
      col.sortby = 'title';
      var actual = util.collection.sort(col);
      console.log(require('util').inspect(actual, null, 10));
      expect(actual).to.deep.equal(expected);
      done();
    });

  });

});

