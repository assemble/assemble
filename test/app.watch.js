'use strict';

// require('time-require')

var assert = require('assert');
var fs = require('fs');
var App = require('..');
var app;

describe('watch()', function () {
  beforeEach(function () {
    app = new App({runtimes: false});
  });

  it('should watch files and run a task when files change', function (done) {
    var count = 0, watch;
    app.task('default', function (cb) {
      count++;
      cb();
    });

    app.task('close', function (cb) {
      watch.close();
      app.emit('close');
      cb();
    });

    app.task('watch', function (cb) {
      watch = app.watch('test/fixtures/watch/*.txt', ['default', 'close']);
      fs.writeFile('test/fixtures/watch/test.txt', 'test', function (err) {
        if (err) return cb(err);
        app.on('close', cb);
      });
    });

    app.run(['watch'], function (err) {
      if (err) return done(err);
      assert.equal(count, 1);
      done();
    });
  });
});
