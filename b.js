
var assemble = require('./');
var tap = require('gulp-tap');

var log = function () {
  console.log.apply(console, arguments);
  console.log();
}

assemble.task('foo', function () {
  var src = assemble.src('./test/fixtures/templates/no-helpers/*.hbs');
  src.on('error', function (err) {
    log('src error', err);
  });

  var dest = assemble.dest('_test_b');
  dest.on('error', function (err) {
    log('dest', err);
  });

  var peek = tap(function (file) {
    file.data.title = (file.data.title || 'no title found').toUpperCase();
    var contents = file.contents.toString();
    contents += ' - additional info from tap.';
    file.contents = new Buffer(contents);
    console.log('tap', file.contents.toString());
  });

  src.pipe(peek).pipe(dest).on('error', function (err) {
    log('pipeline error', err);
  });
});

assemble.task('bar', function () {
  var src = assemble.src('./test/fixtures/templates/no-helpers/a.hbs');
  src.on('error', function (err) {
    log('src error', err);
  });

  var dest = assemble.dest('_test_bar');
  dest.on('error', function (err) {
    log('dest', err);
  });

  var peek = tap(function (file) {
    log('tap', file.contents.toString());
  });

  src.pipe(peek).pipe(dest).on('error', function (err) {
    log('pipeline', err);
  });
});

assemble.run(['foo', 'bar']);


// setTimeout(function () {
//   console.log(assemble.cache.pages);
// }, 1000);