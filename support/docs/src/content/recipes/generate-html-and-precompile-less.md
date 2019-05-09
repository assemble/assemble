---
title: Generate HTML and precompile LESS
category: recipes
---
The following `assemblefile.js` shows you how to:

1. Generate `.html` files from `.hbs` ([handlebars][]) templates using [engine-handlebars][]
1. Generate `.css` stylesheets from `.less`, using [gulp-less][]

```js
var assemble = require('assemble');
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
