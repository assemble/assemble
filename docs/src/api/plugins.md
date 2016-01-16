---
draft: true

title: Plugins
description: >
  This document describes instance plugins, how they work, how to use them and how to author them.
---

## Overview

Instance plugins may be used to either add new features, methods, or functionality, or to modify existing functionality. 

For example, plugins can be used to add features like:

- Generating [permalinks](https://github.com/assemble/assemble-permalinks)
- To enable [loading templates](https://github.com/assemble/assemble-loader) directly onto collections using glob patterns
- Pushing templates and collections to [streams](https://github.com/assemble/assemble-streams)

## How plugins work

* Plugins are functions that are registered with the `.use` method
* Plugins are invoked immediately upon instantiation in the order in which they were defined
* If a plugin _returns a function_, it can be called later by the `.run` method.
* If a plugin does NOT return a function, it will only be called once.
* Plugins can be used on:
  - `app`: an instance of assemble
  - `collection`: an instance of [Collection][], [List][], [Group][]
  - `view`: an 

## API

**app plugins**

- [app.use](#appuse)
- [app.run](#apprun)

**collection plugins**

- [collection.use](#collectionuse)
- [collection.run](#collectionrun)

**view plugins**

- [view.use](#viewuse)
- [view.run](#viewrun)

### app.use

Use a plugin on the application instance. 

```js
app.use(fn);
```

* `fn` **{Function}**: Plugin function to be called with an instance of `app`. 

**Example**

The simplest plugin looks something like the following:

```js
var app = assemble()
  .use(function(app) {
    // do something to `app`
  });
```

### collection.use

**Example**

```js
collection.use(function(views) {
  // do stuff to `views` 
});
```

As with `app`, when a collection plugin retuns a function, the returned function will be called on each `view` created by the collection.

```js
collection.use(function(views) {
  return function(view) {
    // do stuff to each `view`
  };
});
```

### view.use

**Example**

```js
view.use(function(view) {
});
```


Plugin functions are called immediately upon instantiation in the order in which they were defined. The only parameter exposed to the plugin is the assemble instance, or `app`.

Also, if a plugin returns a function, the function will be pushed onto the `fns` array, allowing the plugin to be called at a later point, elsewhere in the application.

**Params**

* `fn` **{Function}**: plugin function to call
* `returns` **{Object}**: Returns the item instance for chaining.

**Example**

```js
// define a plugin
function foo(app) {
  // do stuff
}

// register plugins
var app = new Base()
  .use(foo)
  .use(bar)
  .use(baz)
```

### .run

Run all plugins in the `app.fns` array on the given `value`.

```js
// this WILL NOT be called by `run` 
app.use(function(app) {
  app.foo = 'bar';
});

// this WILL be called by `run` 
app.use(function(app) {
  return function() {
    app.foo = 'bar';
  };
});

var config = {};
app.run(config);
```

**Params**

* `value` **{Object}**: Object to be modified by plugins.
* `returns` **{Object}**: Returns the item instance for chaining.

**Example**



[Collection]: /api/Collection.md
[Group]: /api/Group.md
[List]: /api/List.md
