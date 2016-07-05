---
title: assemblefile.js
category: subjects
---

**What is an `assemblefile.js`?**

When run via command line, Assemble will automatically search for an `assemblefile.js` in the current working directory.

This file may contain any JavaScript or assemble-specific code necessary for your project and, if found, assemble will execute the code in the file upon running `assemble` at the command line.

## Supported signatures

**Function or instance**

Your project's `assemblefile.js` must use one of the following signatures:

1. Export a function that can be called with an instance of `assemble`, or
1. Instantiate `assemble` and export your instance.

### Examples

**Export an instance of assemble**

```js
var assemble = require('assemble');
var app = assemble();

app.task('default', function(cb) {
  console.log('done!');
  cb();
});

/**
 * Expose the instance of `assemble`
 */

module.exports = app;
```

**Export a function**

The function should take an instance of assemble, `app`, as its first argument.

```js
module.exports = function(app) {
  // do stuff to `app`

  app.task('default', function(cb) {
    console.log('done!');
    cb();
  });
};
```
