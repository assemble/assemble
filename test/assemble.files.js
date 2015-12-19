/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');
var inst = null;

describe('assemble.files', function() {
  describe('outside a task', function() {
    beforeEach(function () {
      inst = assemble.init();
    });

    it('should get files from the `pages` collection', function(done) {
      inst.pages('home', { path: 'home.hbs', content: 'This is home.' });
      Object.keys(inst.views.pages).length.should.eql(1);
      Object.keys(inst.files).length.should.eql(1);
      inst.views.pages.should.have.property('home');
      inst.files.should.have.property('home');
      inst.files.should.eql(inst.views.pages);
      done();
    });
  });

  describe('inside tasks', function () {
    beforeEach(function () {
      inst = assemble.init();
    });

    it('should get files from the task specific collection', function (done) {
      inst.task('test', function () {
        var stream = inst.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          Object.keys(inst.views['__task__tests']).length.should.eql(3);
          Object.keys(inst.files).length.should.eql(3);
          inst.views['__task__tests'].should.have.properties(['a', 'b', 'c']);
          inst.files.should.have.properties(['a', 'b', 'c']);
          inst.files.should.eql(inst.views['__task__tests']);
        });
        return stream;
      });
      inst.task('default', ['test'], function () { done(); });
      inst.run('default');
    });

    it('should get files for the correct task', function (done) {
      inst.task('test-a', function () {
        var stream = inst.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          Object.keys(inst.views['__task__test-as']).length.should.eql(3);
          Object.keys(inst.files).length.should.eql(3);
          inst.views['__task__test-as'].should.have.properties(['a', 'b', 'c']);
          inst.files.should.have.properties(['a', 'b', 'c']);
          inst.files.should.eql(inst.views['__task__test-as']);
          inst.views['__task__test-as'].should.not.eql(inst.views['__task__test-bs']);
          inst.files.should.not.eql(inst.views['__task__test-bs']);
        });
        return stream;
      });

      inst.task('test-b', function () {
        var stream = inst.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          Object.keys(inst.views['__task__test-bs']).length.should.eql(3);
          Object.keys(inst.files).length.should.eql(3);
          inst.views['__task__test-bs'].should.have.properties(['a', 'b', 'c']);
          inst.files.should.have.properties(['a', 'b', 'c']);
          inst.files.should.eql(inst.views['__task__test-bs']);
          inst.views['__task__test-as'].should.not.eql(inst.views['__task__test-bs']);
          inst.files.should.not.eql(inst.views['__task__test-as']);
        });
        return stream;
      });

      inst.task('default', ['test-a', 'test-b'], function () { done(); });
      inst.run('default');
    });
  });
});
