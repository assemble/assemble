---
title: assemblefile.js
category: api
---
You might also be interested in reading the [assemblefile.js recipe](/recipes/assemblefile.md).

**What's an assemblefile.js?**

When used via command line, assemble looks for an `assemblefile.js` in the root of your project, and attempts to run the code in the file using any commands or flags that might have been passed.

_If you are only using assemble's API, an `assemblefile.js` is not necessary._

## CLI

When run via CLI, assemble attempts to automatically detect an `assemblefile.js` in the root of your project.

* If `assemblefile.js` **does not exist**, an error message is displayed and the process is terminated
* If `assemblefile.js` exists, it must do one of the following:
  - export an instance of `assemble`
  - export a function that takes an instance of assemble

## API

If you need to run tasks programmatically, use the `.build` method to run tasks.

```js
var assemble = require('assemble');
var app = assemble();

app.task('default', function() {
  // do something, maybe something streamy
  console.log('running default task...');
});

app.build('default', function(err) {
  if (err) throw err;
});
```

## It's just JavaScript!

Although many of the examples in the documentation make heavy use of the `task` API with `src` or `dest` often shown as the highlights of the examples, this is only because it's sometimes easier to write examples with tasks and file system methods.

With that in mind, remember that you can use any part of the assemble API in your `assemblefile.js`, or just regular JavaScript if that's what you need. Your `assemblefile.js` doesn't have to contain tasks, and _there is no requirement to use the file system API (`src` and `dest`)_.
