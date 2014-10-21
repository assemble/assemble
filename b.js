
var assemble = require('./');
var tap = require('gulp-tap');

assemble.src('./test/fixtures/templates/no-helpers/*.hbs')
  .pipe(tap(function (file) {
    console.log('file', file);
  }))
  .pipe(assemble.dest('_test_b'));