/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// Node.js
var inspect = require('util').inspect;

// node_modules
var file = require('fs-utils');
var expect = require('chai').expect;

// Local libs
var assemble = require('../lib/assemble');

describe('data', function() {

  describe('db', function() {
    var data = null;

    before(function(done) {
      assemble.utils.data.destroyDatastore('test', function() {
        data = assemble.utils.data.loadDatastore('test');
        done();
      });
    });

    after(function(done) {
      assemble.utils.data.destroyDatastore('test', done);
    });

    it('should insert', function(done) {
      var expected = {foo: 'bar'};
      data.insert(expected, function(err, obj) {
        if(err) {
          console.log('Error:');
          console.log(inspect(err, null, 10));
        }
        expect(obj).to.eql(expected);
        done();
      });
    });

    it('should find', function(done) {
      var obj = {foo: 'bar'};
      data.find(obj, function(err, results) {
        if(err) {
          console.log('Error');
          console.log(inspect(err, null, 10));
        }
        expect(results.length).to.eql(1);
        done();
      });
    });

    it('should findOne', function(done) {
      var expected = {foo: 'bar'};
      data.findOne(expected, function(err, results) {
        if(err) {
          console.log('Error');
          console.log(inspect(err, null, 10));
        }
        expect(results).to.have.property('foo');
        done();
      });
    });

    it('should update', function(done) {
      var expected = {foo: 'baz'};
      data.update({foo: 'bar'}, expected, {}, function(err, results) {
        if(err) {
          console.log('Error');
          console.log(inspect(err, null, 10));
        }
        expect(results).to.eql(1);
        done();
      });
    });

  });

  describe('process', function() {

    it('should expand lodash templates', function() {
      var obj = {
        a: 1,
        b: 2,
        c: {
          d: [3, 4, 5, 'bar => <%= a %>'],
          e: [
            { foo: '<%= c.d %>' },
            {f: 6},
            {g: 7}
          ]
        },
        fn: '<%= _.extend({z: 0}, {z: 42}, {z: c.d}, 1, "a", \'a\') %>'
      };

      var expected = {
        a: 1,
        b: 2,
        c: {
          d: [3, 4, 5, 'bar => 1'],
          e: [
            { foo: [3, 4, 5, 'bar => 1'] },
            {f: 6},
            {g: 7}
          ]
        },
        fn: {
          z: [3, 4, 5, 'bar => 1']
        }
      };

      var actual = assemble.utils.data.process(obj);
      //console.log(inspect(actual, null, 10));
      expect(actual).to.eql(expected);
    });

  });

  describe('readOptions', function() {

    // var assembleDataFile = './test/fixtures/data/assemble.json';
    // var emptyDataFile = './test/fixtures/data/empty.yml';
    // var helpersDataFile = './test/fixtures/data/helpers.json';
    // var metadataDataFile = './test/fixtures/data/metadata.json';
    var oneDataFile = './test/fixtures/data/one.json';
    // var threeDataFile = './test/fixtures/data/three.json';
    // var twoDataFile = './test/fixtures/data/two.yml';

    it('should read files', function() {
      var data = file.expandDataFiles([oneDataFile]);
      expect(data).to.not.eql(null);
    });

  });
});
