var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
require('jshint-stylish');

var lint = ['index.js', 'lib/utils.js', 'test/*.js'];

gulp.task('coverage', function () {
  return gulp.src(lint)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('mocha', ['coverage'], function () {
  return gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports());
});

gulp.task('jshint', function () {
  return gulp.src(lint)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('default', ['mocha', 'jshint'], function (cb) {
  console.log('Finished "default"');

  // force the process to end since `verb.watch`
  // holds it open in the tests
  process.exit();
  cb();
});
