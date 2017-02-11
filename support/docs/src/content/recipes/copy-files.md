---
title: Copy files
category: recipes
---

Easily copy any assets or other static files in your project.

```js
var assemble = require('assemble');
var app = assemble();

app.task('copy', function() {
  return app.copy('src/assets/**/*', 'site/assets');
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
    .pipe(extname('.html'))
    .pipe(app.renderFile())
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
1. Generate `.css` stylesheets from `.less`, using [gulp-less][]

```js
var assemble = require('assemble');
var less = require('gulp-less');

app.task('html', function() {
  return app.src('templates/*.hbs')
    .pipe(app.renderFile())
    .pipe(app.dest('dist/'));
});

app.task('css', function () {
  return app.src('styles/*.less')
    .pipe(less())
    .pipe(app.dest('dist/assets/css'));
});

app.task('default', ['html', 'css']);
```
