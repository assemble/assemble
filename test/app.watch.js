var assert = require('assert');
var touch = require('touch');

var assemble = require('../');
var app;

describe('app', function () {
  beforeEach(function () {
    app = assemble();
  });

  it('should run a task when a file changes', function (done) {
    var fn = function (cb) {
      console.log('touched');
      cb();
    };
    app.task('default', fn);
    app.watch('test/fixtures/watch/**/*.*', ['default']);
    touch.sync('test/fixtures/watch/test.txt');
  });
});
