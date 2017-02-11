---
title: Template engines
category: recipes
---

An **engine** is a function that takes a string, options and a callback.

```js
function engine(str, options, cb) {
  // do stuff to str
  cb(null, str);
}
```

Assemble supports [handlebars][] by default (via [engine-handlebars][]), but you use any engine supported by [consolidate][], or [create your own](#authoring-engines).

## Registering engines

Engines are registered using `app.engine()`:

```js
// render handlebars templates in `.hbs` files
app.engine('hbs', require('engine-handlebars'));
```

When rendering, if the name of a registered engine matches the file extension of the file being rendered, assemble will use that engine for rendering, unless you explicitly [specify a different engine](#specify-an-engine) to use.


## Specify an engine

Explicitly specify an engine to use for rendering, regardless of file extensions:

```js
app.engine('foo', require('engine-foo'));
app.option('engine', 'foo'); //<= tell assemble to render everything with engine-foo
```

## Authoring engines

You can add support for any engine using the following format:

```js
var foo = require('your-custom-engine');

function customEngine(str, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  // if "foo" isn't async, use a try/catch
  // to ensure engine errors are bubbled
  try {
    cb(null, foo(str, options));
  } catch (err) {
    cb(err);
  }
}
```
