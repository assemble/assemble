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
