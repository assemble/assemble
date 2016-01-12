# assemblefile.js

**It's just JavaScript!**

Although most of the following examples will show tasks being defined and `src` or `dest` being used, this is only because it's easy to write examples with tasks. 

You can use any part of the assemble API in your `assemblefile.js`, or just regular JavaScript if that's what you need. Your `assemblefile.js` doesn't have to contain tasks, and _there is no requirement to use the file system API (`src` and `dest`)_.

## CLI

When run via CLI, assemble attempts to automatically detect an `assemblefile.js` in the root of your project.

* If `assemblefile.js` **does not exist**, an error message is displayed and the process is terminated
* If `assemblefile.js` exists, it must do one of the following:
  - export an instance of `assemble`
  - export a function that takes an instance of assemble

## API

If you're not using assemble's CLI, you can use the `.build` method to run tasks.

```js
var assemble = require('assemble');
var app = assemble();

app.task('default', function() {
  // do something, maybe something streamy
  console.log('running default task...');
});

app.build('default', function(err) {
  if (err) throw err;
  console.log('done!');
});
```

