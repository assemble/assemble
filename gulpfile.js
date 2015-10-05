'use strict';

var gulp = require('gulp');
var async = require('async');
var argv = require('minimist')(process.argv.slice(2));
var through = require('through2');
var expand = require('expand-files');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var git = require('gulp-git');
var del = require('rimraf');

var deps = {
  'jonschlinkert/templates': {}
}

var files = {
  test: ['test/_spec/test/*.js', 'test/*.js'],
  lint: ['index.js', 'lib/*.js']
};

function url(repo) {
  return 'https://github.com/' + repo;
}
var repo = url('jonschlinkert/templates');


gulp.task('coverage', function () {
  return gulp.src(files.lint)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['clone', 'coverage'], function () {
  return gulp.src(files.test)
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.writeReports({
      reporters: [ 'text' ],
      reportOpts: {dir: 'coverage', file: 'summary.txt'}
    }));
});

gulp.task('lint', function () {
  return gulp.src(files.lint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('clone', ['clean'], function(cb) {
  git.clone(repo, {args: 'test/_spec'}, cb);
  // git.clone(repo, {args: 'test/_spec'}, function (err) {
  //   if (err) return cb(err);

  //   gulp.src('test/_temp/test/**')
  //     .pipe(gulp.dest('test/spec'))
  //     .on('end', function() {
  //       del('test/_temp', cb);
  //     });
  // });
});

gulp.task('clean', function (cb) {
  del(argv.del || 'test/_spec', cb);
});

gulp.task('default', ['test', 'lint']);
