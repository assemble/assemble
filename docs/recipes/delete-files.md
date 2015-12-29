# Deleting files

```js
var assemble = require('assemble');
var del = require('delete');
var app = assemble();

app.task('default', function(cb) {
  del(['foo/*.js', 'bar/*.js']).then( function() {
  	cb();
  });
});
```