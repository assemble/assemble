'use strict';

var clean = require('gulp-clean');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var verb = require('gulp-verb');

gulp.task('default', ['test']);

gulp.task('lint', function () {
  gulp.src(['lib/*.js', 'test/*.js', '*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
});

gulp.task('clean', function () {
  gulp.src(['test/actual'], {read: false})
    .pipe(clean());
});

gulp.task('test', ['clean', 'lint'], function () {
  gulp.src(['test/*_test.js'])
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('verb', function () {
  gulp.src(['.verbrc.md'])
    .pipe(verb({dest: 'README.md'}))
    .pipe(gulp.dest('./'));
});