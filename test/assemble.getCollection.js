/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');
var app;

describe('.getCollection', function () {

  describe('when a collection name is specified.', function () {
    beforeEach(function () {
      app = assemble.init();
    });

    it('should get the specified collection:', function (cb) {
      app.page('foo', 'this is foo...');
      app.page('bar', 'this is bar...');
      app.page('baz', 'this is baz...');

      var pages = app.getCollection('pages');
      pages.should.have.properties(['foo', 'bar', 'baz']);
      cb();
    });
  });

  describe('when a task is running.', function () {
    beforeEach(function () {
      app = assemble.init();
    });

    it('should get files from the specified task collection', function (cb) {
      app.task('test_one', function () {
        var stream = app.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          var collection = app.getCollection();
          assert(Object.keys(collection).length === 3);
          assert(Object.keys(app.files).length === 3);
          collection.should.have.properties(['a', 'b', 'c']);
          app.files.should.have.properties(['a', 'b', 'c']);
          app.files.should.equal(collection);
        });
        return stream;
      });
      app.task('default', ['test_one'], function () { cb(); });
      app.run('default');
    });

    it('should get files from another task:', function (cb) {
      app.task('test_one', function () {
        var stream = app.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          var collection = app.getCollection();
          assert(Object.keys(collection).length === 3);
          assert(Object.keys(app.files).length === 3);
          collection.should.have.properties(['a', 'b', 'c']);
          app.files.should.have.properties(['a', 'b', 'c']);
          app.files.should.equal(collection);
        });
        return stream;
      });

      app.task('test_two', function () {
        var stream = app.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          var collection = app.getCollection();
          assert(Object.keys(collection).length === 3);
          assert(Object.keys(app.files).length === 3);
          collection.should.have.properties(['a', 'b', 'c']);
          app.files.should.have.properties(['a', 'b', 'c']);
          app.files.should.equal(collection);
        });
        return stream;
      });

      app.task('default', ['test_one', 'test_two'], function () { cb(); });
      app.run('default');
    });
  });
});
