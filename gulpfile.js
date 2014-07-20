'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');


gulp.task('mocha', ['jshint'], function () {
  gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('jshint', function() {
  gulp.src(['*.js', 'lib/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['mocha']);