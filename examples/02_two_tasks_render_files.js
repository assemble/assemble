
var assemble = require('../');

// tap is used to update the file.data during the build
var tap = require('gulp-tap');

assemble.task('foo', function () {
  assemble.src(__dirname + '/../test/fixtures/templates/no-helpers/*.hbs')
    .pipe(tap(function (file) {
      file.data.title = (file.data.title || 'no title found').toUpperCase();
      file.contents = new Buffer(file.contents.toString() + ' - additional info from tap.');
    }))
    .pipe(assemble.dest(__dirname + '/dist/02_foo'));
});

assemble.task('bar', function () {
  assemble.src(__dirname + '/../test/fixtures/templates/no-helpers/a.hbs')
    .pipe(tap(function (file) {
      // console.log('tap', file.contents.toString());
    }))
    .pipe(assemble.dest(__dirname + '/dist/02_bar'));
});

assemble.run(['foo', 'bar']);
