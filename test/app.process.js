require('mocha');
require('should');
var through = require('through2');
var assert = require('assert');
var App = require('../');
var View = App.View;
var app;

describe('app', function () {
  beforeEach(function () {
    app = new App();
  });

  describe('errors', function () {
    it('should throw an error when file is not an object:', function () {
      (function () {
        app.process();
      }).should.throw('process expects file to be an object.');
    });

    it('should throw an error when dest is not defined:', function () {
      var view = new View({path: 'test/fixtures/pages/a.hbs', data: {}});
      (function () {
        app.process(view);
      }).should.throw('process expects file to have a dest defined.');
    });
  });

  describe('dest', function () {
    it('should use `dest` from app.options:', function (done) {
      app.option('dest', 'test/actual/process');
      var view = new View({
        path: 'test/fixtures/pages/a.hbs'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });

    it('should use `dest` from file:', function (done) {
      var view = new View({
        path: 'test/fixtures/pages/a.hbs',
        dest: 'test/actual/process'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });
  });

  describe('src', function () {
    it('should use `src`:', function (done) {
      var view = new View({
        src: 'test/fixtures/pages/a.hbs',
        dest: 'test/actual/process'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });

    it('should use `path` as the src:', function (done) {
      var view = new View({
        path: 'test/fixtures/pages/a.hbs',
        dest: 'test/actual/process'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });

    it('should work with a glob:', function (done) {
      var view = new View({
        path: 'test/fixtures/pages/*.hbs',
        dest: 'test/actual/process'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });

    it('should not work with an array of globs:', function () {
      (function () {
        var view = new View({
          path: ['test/fixtures/pages/*.hbs'],
          dest: 'test/actual/process'
        });
      }).should.throw('path should be string');
    });
  });

  describe('cwd', function () {
    it('should use `cwd` from app.options:', function (done) {
      app.option('cwd', 'test/fixtures/pages');
      var view = new View({
        path: 'a.hbs',
        dest: 'test/actual/process'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });

    it('should use `cwd` from view:', function (done) {
      var view = new View({
        cwd: 'test/fixtures/pages',
        path: 'a.hbs',
        dest: 'test/actual/process'
      });

      app.process(view)
        .on('error', done)
        .on('end', done);
    });
  });

  describe('rendering', function () {
    it('should use render templates:', function (done) {
      var view = new View({
        data: {title: 'View Title'},
        src: 'test/fixtures/pages/a.hbs',
        dest: 'test/actual/process'
      });

      assert(view.data.title === 'View Title');

      app.process(view)
        .on('error', done)
        .on('data', function (data) {
          console.log(data.contents.toString())
        })
        .on('end', done);
    });

    it('should use `path` as the src:', function (done) {
      var view = new View({
        path: 'test/fixtures/pages/a.hbs',
        dest: 'test/actual/process'
      });
      app.process(view)
        .on('error', done)
        .on('end', done);
    });
  });
});
