
var assemble = require('./');
assemble.engine('hbs', require('engine-handlebars'));
var tap = require('gulp-tap');

var src = assemble.src('./test/fixtures/templates/no-helpers/*.hbs');
src.on('error', function (err) {
  console.log('src error', err);
  console.log();
});

var dest = assemble.dest('_test_b');
dest.on('error', function (err) {
  console.log('dest', err);
  console.log();
});

var peek = tap(function (file) {
  // console.log('tap', file.contents.toString());
});

src.pipe(peek).pipe(dest).on('error', function (err) {
  console.log('pipeline error', err);
  console.log();
});


// setTimeout(function () {
//   console.log(assemble.cache.pages);
// }, 1000);