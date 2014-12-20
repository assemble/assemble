



## Examples

Chained plugin example, `assemble-abc.js`:

```js
var a = require('assemble-a');
var b = require('assemble-b');
var c = require('assemble-c');

module.exports = function(assemble) {
  return fs.src(patterns, options)
    .pipe(a())
    .pipe(b())
    .pipe(c());
};
```

Usage:

```js
var assemble = require('assemble');
var abc = require('assemble-abc');

assemble.task('abc', function () {
  assemble.src('test/*.js')
    .pipe(abc())
    .pipe(assemble.dest('dist'));
});

assemble.task('default', ['abc']);
```