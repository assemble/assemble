---
title: Generate HTML and precompile SASS
category: recipes
---
The following `assemblefile.js` shows you how to:

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
