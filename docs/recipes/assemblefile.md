# assemblefile.js 

You might also be interested in reading the [assemblefile.js API docs](/api/assemblefile.md).

### Copy files

The following `assemblefile.js` has a task defined that will copy all of the `.js` files from the root of your project to the `assets/js` folder.

```js
var assemble = require('assemble');
var app = assemble();

app.task('default', function() {
  return app.src('*.js')
    .pipe(app.dest('site/assets/js'))
});
```

### HTML and SASS

The following `assemblefile.js` will:

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
  return app.src('templates/*.hbs')
    .pipe(app.renderFile())
    .pipe(extname('.html'))
    .pipe(htmlmin())
    .pipe(app.dest('dist/'));
});

app.task('css', function () {
  return app.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(app.dest('./css'));
});

app.task('default', ['html', 'css']);
```

### HTML and LESS

The following `assemblefile.js` will:

1. Generate `.html` files from `.hbs` ([handlebars][]) templates using [engine-handlebars][]
1. Generate `.css` stylesheets from `.sass`, using [gulp-sass][]

```js
var app = require('assemble');
var less = require('gulp-less');

app.task('html', function() {
  return app.src('templates/*.hbs')
    .pipe(app.dest('dist/'));
});

app.task('css', function () {
  return app.src('styles/*.less')
    .pipe(less())
    .pipe(app.dest('dist/assets/css'));
});

app.task('default', ['html', 'css']);
```
