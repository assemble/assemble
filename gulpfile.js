var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('jshint', function() {
  return gulp.src(['index.js', 'lib/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', ['jshint'], function (cb) {
  gulp.src(['index.js', 'lib/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('default', ['test']);
