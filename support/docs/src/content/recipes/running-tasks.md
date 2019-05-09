---
title: Running tasks
---


Create an `assemblefile.js` and add tasks to run:

```js
var assemble = require('assemble');
var htmlmin = require('gulp-htmlmin');
var app = assemble();

app.page('a.hbs', {content: '...'});
app.page('b.hbs', {content: '...'});
app.page('c.hbs', {content: '...'});

app.task('default', function() {
  return app.toStream('pages') //<= push "pages" collection into stream
    .pipe(app.renderFile()) //<= render pages with default engine (hbs)
    .pipe(htmlmin()) //<= gulp plugin for minifying html
    .pipe(app.dest('site')); //<= write files to the "./site" directory
});

// expose your instance of assemble to assemble's CLI
module.exports = app;
```

## Test drive

**Example assemblefile.js**

To see how it works, [install assemble]() and add the following code to `assemblefile.js`:

```js
var assemble = require('assemble');
var app = assemble();

app.task('default', function(cb) {
  console.log('it worked!');
  cb();
});
```
