




var dec = function (file) {
  return /[dec]/.test(file.data.date);
};

var jan = function (file) {
  return /[jan]/.test(file.data.date);
};

var feb = function (file) {
  return /[feb]/.test(file.data.date);
};


assemble.task('blog', function () {
  assemble.src('*.hbs')
    .pipe(filter('a', dec))
    .pipe(filter('b', jan))
    .pipe(filter('c', feb))
    .pipe(filter('c', require('./collection')))
    .pipe(sort())
    .pipe(assemble.dest('blog/posts'));
});