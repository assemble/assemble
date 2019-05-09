---
draft: true

title: Engines
collection: docs
category: api
related: ['helpers', 'views']
description: > 
  Learn how to register, use and create template helpers.
---

## Engines API

All of the rendering in assemble is handled by template engines, or "rendering engines". Thus, before we can render anything with assemble, we'll need to register an engine using the `.engine` method. 

### .engine

Register engine `callback` function as `ext`. Instead of a callback, the second argument can alternatively be an object with a `.render` method.

```js
app.engine(ext, callback);
```

**Params**

* `ext` **{String}** Optionally a file extension to associate with the engine, or any arbirary name if you don't want assemble to auto-match engines to files.
* `callback` **{Function|Object}**: Engine's callback function or object with a `.render` method.
* `options` **{Object}**
* `returns` **{Object}**: Returns the assemble instance for chaining

**Example**

The most basic engine looks something like this:

```js
app.engine('txt', function(str, locals, cb) {
  // do stuff to `str`
  cb(null, str);
});
```

Or, require a published engine as a module dependency:

```js
app.engine('hbs', require('engine-handlebars'));
```

## Setting a default engine

Set the engine to use for rendering all views. 


```js
app.option('engine', 'txt');
```

This can be overridden at the collection or view or view level.

## How engines work

Template engines in Assemble are used to render the `content` property on [views](/api/views.md), wich can be any text or markup language.
