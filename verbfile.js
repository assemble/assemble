var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var verb = require('verb');

verb.task('readme', function () {
  verb.src('.verb.md')
    .pipe(verb.dest('./'));
});

verb.task('apidocs', function () {
  verb.src('docs/_verb/*.md')
    .pipe(verb.dest('docs'));
});

verb.task('lint', function() {
  /* deps:jshint-stylish */
  verb.src(['index.js', 'lib/**/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

verb.task('test', function (cb) {
  verb.src(['index.js', 'lib/**/*.js', 'bin/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      verb.src('test/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});

verb.task('default', ['test', 'lint', 'readme', 'apidocs']);
