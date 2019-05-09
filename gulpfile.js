'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');
var unused = require('gulp-unused');

gulp.task('coverage', function() {
  return gulp.src(['index.js', 'lib/**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});

gulp.task('mocha', ['coverage'], function() {
  return gulp.src('test/*.js')
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});

gulp.task('eslint', function() {
  return gulp.src(['*.js', 'lib/**/*.js', 'test/*.js', 'bin/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('unused', function() {
  return gulp.src(['index.js', 'lib/**/*.js', 'bin/*.js'])
    .pipe(unused({keys: Object.keys(require('./lib/utils.js'))}))
});

gulp.task('default', ['mocha', 'eslint']);
