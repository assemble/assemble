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

describe('assemble.files', function() {
  describe('outside a task', function() {
    beforeEach(function () {
      app = assemble.init();
    });

    it('should get files from the `pages` collection', function(done) {
      app.pages('home', { path: 'home.hbs', content: 'This is home.' });
      Object.keys(app.views.pages).length.should.equal(1);
      Object.keys(app.files).length.should.equal(1);
      app.views.pages.should.have.property('home');
      app.files.should.have.property('home');
      app.files.should.eql(app.views.pages);
      done();
    });
  });

  describe('inside tasks', function () {
    it('should get files for the correct task', function (done) {
      app.task('test-a', function () {
        var stream = app.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          Object.keys(app.views['test-as']).length.should.equal(3);
          Object.keys(app.files).length.should.equal(3);
          app.views['test-as'].should.have.properties(['a', 'b', 'c']);
          app.files.should.have.properties(['a', 'b', 'c']);
          app.files.should.eql(app.views['test-as']);
          app.views['test-as'].should.not.eql(app.views['test-bs']);
          app.files.should.not.eql(app.views['test-bs']);
        });
        return stream;
      });

      app.task('test-b', function () {
        var stream = app.src('test/fixtures/templates/partials/*.hbs');
        stream.on('end', function () {
          Object.keys(app.views['test-bs']).length.should.equal(3);
          Object.keys(app.files).length.should.equal(3);
          app.views['test-bs'].should.have.properties(['a', 'b', 'c']);
          app.files.should.have.properties(['a', 'b', 'c']);
          app.files.should.eql(app.views['test-bs']);
          app.views['test-as'].should.not.eql(app.views['test-bs']);
          app.files.should.not.eql(app.views['test-as']);
        });
        return stream;
      });

      app.task('default', ['test-a', 'test-b'], function () { done(); });
      app.run('default');
    });
  });
});
