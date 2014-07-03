var gulp = require('gulp');
var themes = require('assemble-themes');

gulp.task('scripts', function () {
  gulp.src('foo/**/index.less')
    .pipe(themes()) // adds theme variables to the context for rte
    .pipe(gulp.dest(':dest/:css/:theme.css'))
});