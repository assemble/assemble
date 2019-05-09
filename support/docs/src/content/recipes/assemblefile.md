---
title: assemblefile.js
category: recipes
related: ['api/assemblefile']
---

_An `assemblefile.js` is not necessary if you're not using assemble's CLI._

When used by command line, assemble's CLI looks for an `assemblefile.js` in the root of your project and, if found, attempts to load it using node's `require()` system, and then executes the code in the file using any commands or flags that were passed.

More specifically, when the `assemble` command is run via command line:

* If `assemblefile.js` **does not exist**, an error message is displayed and the process is terminated
* If `assemblefile.js` does exist it must [export an instance](#export-an-instance) of `assemble`

**Example assemblefile.js**

```js
var assemble = require('assemble');
var app = module.exports = assemble();

app.task('default', function(cb) {
  // do stuff
  cb();
});
```

## Building

When the `assemble` command is run, assemble's CLI



```js
app.build('default', function(err) {
  if (err) throw err;
});
```


## It's just JavaScript!

Although many of the examples in the documentation make heavy use of the `task` API with `src` or `dest` often shown as the highlights of the examples, this is only because it's sometimes easier to write examples with tasks and file system methods.

With that in mind, remember that you can use any part of the assemble API in your `assemblefile.js`, or just regular JavaScript if that's what you need. Your `assemblefile.js` doesn't have to contain tasks, and _there is no requirement to use the file system API (`src` and `dest`)_.


