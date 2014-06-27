'use strict';

var verb = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('verb tasks', function() {
  describe('task()', function() {
    it('should define a task', function(done) {
      var fn;
      fn = function() {};
      verb.task('test', fn);
      should.exist(verb.tasks.test);
      verb.tasks.test.fn.should.equal(fn);
      verb.reset();
      done();
    });
  });

  describe('run()', function() {
    it('should run multiple tasks', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(verb);
        ++a;
      };
      fn2 = function() {
        this.should.equal(verb);
        ++a;
      };
      verb.task('test', fn);
      verb.task('test2', fn2);
      verb.run('test', 'test2');
      a.should.equal(2);
      verb.reset();
      done();
    });
    it('should run all tasks when call run() multiple times', function(done) {
      var a, fn, fn2;
      a = 0;
      fn = function() {
        this.should.equal(verb);
        ++a;
      };
      fn2 = function() {
        this.should.equal(verb);
        ++a;
      };
      verb.task('test', fn);
      verb.task('test2', fn2);
      verb.run('test');
      verb.run('test2');
      a.should.equal(2);
      verb.reset();
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
      verb.task('test', fn);
      verb.task('test2', fn2);
      verb.run('test');
      verb.run('test2', function() {
        verb.isRunning.should.equal(false);
        a.should.equal(2);
        verb.reset();
        done();
      });
      verb.isRunning.should.equal(true);
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
      verb.task('test', fn);
      verb.task('test2', fn2);
      verb.run('test');
      verb.run('test2', function() {
        verb.isRunning.should.equal(false);
        a.should.equal(2);
        verb.reset();
        done();
      });
      verb.isRunning.should.equal(true);
    });
    it('should emit task_not_found and throw an error when task is not defined', function(done) {
      verb.on('task_not_found', function(err) {
        should.exist(err);
        should.exist(err.task);
        err.task.should.equal('test');
        verb.reset();
        done();
      });
      try {
        verb.run('test');
      } catch (err) {
        should.exist(err);
      }
    });
    it('should run task scoped to verb', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(verb);
        ++a;
      };
      verb.task('test', fn);
      verb.run('test');
      a.should.equal(1);
      verb.isRunning.should.equal(false);
      verb.reset();
      done();
    });
    it('should run default task scoped to verb', function(done) {
      var a, fn;
      a = 0;
      fn = function() {
        this.should.equal(verb);
        ++a;
      };
      verb.task('default', fn);
      verb.run();
      a.should.equal(1);
      verb.isRunning.should.equal(false);
      verb.reset();
      done();
    });
  });
});
