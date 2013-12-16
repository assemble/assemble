/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var inspect = require('util').inspect;

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
      data.insert({foo: 'bar'}, function(err, obj) {
        if(err) {
          console.log('Error:');
          console.log(inspect(err, null, 10));
        }
        done();
      });
    });

    it('should find', function(done) {
      data.find({foo: 'bar'}, function(err, results) {
        if(err) {
          console.log('Error');
          console.log(inspect(err, null, 10));
        }
        done();
      });
    });

    it('should findOne', function(done) {
      data.findOne({foo: 'bar'}, function(err, results) {
        if(err) {
          console.log('Error');
          console.log(inspect(err, null, 10));
        }
        done();
      });
    });

    it('should update', function(done) {
      data.update({foo: 'bar'}, {foo: 'baz'}, {}, function(err, results) {
        if(err) {
          console.log('Error');
          console.log(inspect(err, null, 10));
        }
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
        fn: '<% _.extend({z: 0}, {z: 42}, {z: c.d}, 1, "a", \'a\') %>'
      };

      var actual = assemble.utils.data.process(obj);
      //console.log(inspect(actual, null, 10));

    });
  
  });

  describe('readOptions', function() {

    var assembleDataFile = './test/fixtures/data/assemble.json';
    var emptyDataFile = './test/fixtures/data/empty.yml';
    var helpersDataFile = './test/fixtures/data/helpers.json';
    var metadataDataFile = './test/fixtures/data/metadata.json';
    var oneDataFile = './test/fixtures/data/one.json';
    var threeDataFile = './test/fixtures/data/three.json';
    var twoDataFile = './test/fixtures/data/two.yml';
  
    it('should read files', function() {
      var data = assemble.utils.data.readOptions(['./test/fixtures/data/**/*.*']);
    });
  
  });
});
