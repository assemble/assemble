var path = require('path');
var fs = require('fs');

var fixture = path.join(__dirname, 'fixtures/watch');
var App = require('../');
var app;

describe('app', function () {
  beforeEach(function () {
    app = new App({runtimes: false});
  });

  it('should run a task when a file changes', function (done) {
    var fn = function () {
      done();
    };
    app.task('watch-test', fn);
    app.watch(fixture + '/**/*.*', ['watch-test']);
    setImmediate(function () {
      fs.writeFileSync(path.join(fixture, 'test.txt'), 'test');
    });
  });
});
