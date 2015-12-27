# assemblefile.js examples

**Freedom to create**

Although most of the following examples will show tasks being defined, this only because it's easy to write examples with tasks. But your `assemblefile.js` does not need to have tasks, or require that you use the file system API (`src` and `dest`).

You can use any part of the Assemble API in your `assemblefile.js`, or just regular JavaScript if that's what you need.

## Basic

The following `assemblefile.js` has a task defined that will copy all of the `.js` files from the root of your project to the `tmp` folder.

```js
var assemble = require('assemble');

var app = assemble();

app.task('default', function() {

});
```

## HTML and CSS

The following assemblefile will:

1. Generate `.html` files from `.hbs` ([handlebars][]) templates using [engine-handlebars][]
1. Generate `.css` stylesheets from `.sass`, using [gulp-sass][]
1. Minify `.html` files with [gulp-htmlmin][]

```js
var sass = require('gulp-sass');
var extname = require('gulp-extname');
var htmlmin = require('gulp-htmlmin');
var assemble = require('assemble');
var app = assemble();

app.task('html', function() {
  app.src('templates/*.hbs')
    .pipe(app.renderFile())
    .pipe(extname('.html'))
    .pipe(htmlmin())
    .pipe(app.dest('dist/'));
});

gulp.task('css', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

app.task('default', ['html', 'css']);
```

