'use strict';

var verb = require('verb');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

verb.data('package.json');

verb.task('mocha', ['jshint'], function () {
  verb.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}));
});

verb.task('jshint', function() {
  verb.src(['*.js', 'lib/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

verb.task('readme', function () {
  verb.src('.verb*.md')
    .pipe(verb.dest('./'));
});

verb.task('default', ['readme']);
