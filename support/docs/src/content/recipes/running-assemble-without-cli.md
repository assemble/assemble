---
title: Run assemble without the CLI
---

Assemble is just like any other node.js library. Add it to your project using node's `require()` system:

```js
var assemble = require('assemble');
```

Create an instance of assemble (your `app`):

```js
var app = assemble();
```

Then define any javascript code you need, and use the methods on assemble's API:

```js
app.task('default', function() {
  // do something, maybe something streamy
  console.log('running default task...');
});

app.build('default', function(err) {
  if (err) throw err;
});
```
