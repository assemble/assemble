'use strict';

var session = require('../lib/session');
var should = require('should');
var assemble = require('..');
var Q = require('q');
require('mocha');

describe('assemble tasks', function() {
  describe('task()', function() {
    it('should define a task', function(done) {
      var fn;
      fn = function() {};
      assemble.task('test', fn);
      should.exist(assemble.tasks.test);
      assemble.tasks.test.fn.should.equal(fn);
      assemble.reset();
      done();
    });
  });

  describe('run()', function() {
    it('should run multiple tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(assemble);
        ++a;
      };
      fn2 = function() {
        this.should.equal(assemble);
        ++a;
      };
      assemble.task('test', fn);
      assemble.task('test2', fn2);
      assemble.run('test', 'test2');
      a.should.equal(2);
      assemble.reset();
      done();
    });
    it('should run all tasks when call run() multiple times', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(assemble);
        ++a;
      };
      fn2 = function() {
        this.should.equal(assemble);
        ++a;
      };
      assemble.task('test', fn);
      assemble.task('test2', fn2);
      assemble.run('test');
      assemble.run('test2');
      a.should.equal(2);
      assemble.reset();
      done();
    });
    it('should run all async promise tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        var deferred = Q.defer();
        setTimeout(function() {
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      fn2 = function() {
        var deferred = Q.defer();
        setTimeout(function() {
          ++a;
          deferred.resolve();
        },1);
        return deferred.promise;
      };
      assemble.task('test', fn);
      assemble.task('test2', fn2);
      assemble.run('test');
      assemble.run('test2', function() {
        assemble.isRunning.should.equal(false);
        a.should.equal(2);
        assemble.reset();
        done();
      });
      assemble.isRunning.should.equal(true);
    });
    it('should run all async callback tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function(cb) {
        setTimeout(function() {
          ++a;
          cb(null);
        },1);
      };
      fn2 = function(cb) {
        setTimeout(function() {
          ++a;
          cb(null);
        },1);
      };
      assemble.task('test', fn);
      assemble.task('test2', fn2);
      assemble.run('test');
      assemble.run('test2', function() {
        assemble.isRunning.should.equal(false);
        a.should.equal(2);
        assemble.reset();
        done();
      });
      assemble.isRunning.should.equal(true);
    });
    it('should emit task_not_found and throw an error when task is not defined', function(done) {
      assemble.on('task_not_found', function(err) {
        should.exist(err);
        should.exist(err.task);
        err.task.should.equal('test');
        assemble.reset();
        done();
      });
      try {
        assemble.run('test');
      } catch (err) {
        should.exist(err);
      }
    });
    it('should run task scoped to assemble', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(assemble);
        ++a;
      };
      assemble.task('test', fn);
      assemble.run('test');
      a.should.equal(1);
      assemble.isRunning.should.equal(false);
      assemble.reset();
      done();
    });
    it('should run default task scoped to assemble', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(assemble);
        ++a;
      };
      assemble.task('default', fn);
      assemble.run();
      a.should.equal(1);
      assemble.isRunning.should.equal(false);
      assemble.reset();
      done();
    });
    it('should set the task name on the session', function (done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        ++a;
        this.should.equal(assemble);
        session.get('task name').should.equal('test');
      };
      fn2 = function() {
        ++a;
        this.should.equal(assemble);
        session.get('task name').should.equal('test2');
      };
      assemble.task('test', fn);
      assemble.task('test2', fn2);
      assemble.run('test', 'test2');
      a.should.equal(2);
      assemble.reset();
      done();
    })
  });
});
