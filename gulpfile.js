'use strict';

var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var through = require('through2');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var git = require('gulp-git');
var del = require('rimraf');

var lint = ['index.js', 'lib/*.js'];
function url(repo) {
  return 'https://github.com/' + repo;
}
var repo = url('jonschlinkert/templates');


gulp.task('coverage', function () {
  return gulp.src(lint)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['coverage'], function () {
  return gulp.src(['spec/*.js'])
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.writeReports({
      reporters: [ 'text' ],
      reportOpts: {dir: 'coverage', file: 'summary.txt'}
    }));
});

gulp.task('lint', function () {
  return gulp.src(lint)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('clone', ['clean'], function(cb) {
  git.clone(repo, {args: '_temp'}, function (err) {
    if (err) return cb(err);

    gulp.src('_temp/test/**')
      .pipe(gulp.dest('spec'))
      .on('end', function() {
        del('_temp', cb);
      });
  });
});

gulp.task('clean', function (cb) {
  del(argv.del || 'spec', cb);
});

gulp.task('default', ['test', 'lint']);
