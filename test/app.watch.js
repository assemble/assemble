var assert = require('assert');
var fs = require('fs');

var assemble = require('../');
var app;

describe('app', function () {
  beforeEach(function () {
    app = assemble();
  });

  it('should run a task when a file changes', function (done) {
    var fn = function () {
      done();
    };
    app.task('watch-test', fn);
    app.watch(['./test/fixtures/watch/**/*.*'], ['watch-test']);
    setImmediate(function () {
      fs.writeFileSync('test/fixtures/watch/test.txt', 'test');
    });
  });
});
