---
title: Middleware
engine: hbs
description: >
  Methods for defining and using middleware and routes
collection: docs
category: api
related:
  list: ['en-route']
reflinks: ['en-route']
---


## Overview

This document describes the various features, options and API router methods available on Templates.js.


# Middleware FAQ

**What is "middleware"?**

Middleware functions are functions that have access to:

- The `view` object (in assemble, a "view" is an instance of a [vinyl][] file), and
- A callback function, `next`, which represents the next middleware in the application’s build cycle

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the `view` object.
- Call the `next` middleware function in the stack.

[express]: http://expressjs.com/en/guide/using-middleware.html

**What is a "handler"?**

Middleware functions must be invoked by a middleware handler, which themselves are invoked at pre-determined points during runtime.

Handlers are assigned method names, like `.onLoad` and `preRender`, each of which is typically associated with a specific middleware method known as a "verb" that will only be invoked by that handler.

For example, the `.onLoad()` method is invoked by the `onLoad` handler when templates are loaded, and the `.preRender()` method is invoked by the `preRender` handler before templates are passed to the engine for rendering.

**What does the handler do?**

When a handler is invoked

**What is a middleware stack?**

A middleware stack is an array of middleware functions that are invoked by the Assemble routing layer, and sits in the middle between view creation and writing to the file system. We refer to these functions as the middleware stack since they are always invoked in the order they are added.

- Each file that passes through the [pipeline](./api-task.md#pipeline.md) has its own middleware stack, which may have zero or more middleware functions
- Middleware functions are always invoked in the order in which they are defined.

**Verbs**

> verbs determine **when to run**

- Special middleware methods known as "verbs" determine **when** middleware functions are run
- Each verb is invoked by a middleware _handler_ that is configured to run that specific verb, at a specic point during runtime. For example, the `onLoad` handler invokes all `.onLoad()` middleware when a template is loaded.

**Routes**

Given that "verbs" determine **when** a middleware function is called, "routes" determine which files to process.

**Routes**

> routes determine **which files to operate on**

- Routes are used to selectively match **which** files to operate on.

certain triggers

## API

### .use

### .route

### .all

### .onLoad

### .preRender`

### .postRender`

***

## Related topics

While plugins and middleware are both used to "extend" assemble, they serve very different purposes, are used in completely different ways, and have access to different objects at runtime.

## Middleware VERBS

### .onLoad

**Handles**

- partials
- layouts
- renderable templates


### .preRender

**Handles**

- renderable templates only


### .postRender

**Handles**

- renderable templates only


## Router methods

Router methods are similar to the router METHODS in [express][], but instead of representing [HTTP METHODS][verbs], the router methods here represent significant points or "stages" during the build.

**Summary**

- `onLoad`: Immediately after a view is loaded, as a last step just before adding the view to a collection.
- `onStream`: 
- `preRender`: Called before rendering a view.
- `preCompile`: Called before compiling a view.
- `preLayout`: Immediately before the first [layout][] in a [layout-stack][] is applied to a view.
- `postCompile`: Called after compiling a view.
- `postRender`: Called after rendering a view.
- `preWrite`: 
- `postWrite`: 

- `onLayout`: Called after each [layout][] in a [layout-stack][] is applied.
- `postLayout`: Called after all [layouts][] have been applied to a view.
- `onMerge`: Called directly before [partials][] collections are merged onto the [context][].


## Methods

### onLoad

Immediately after a view is loaded, as a last step just before adding the view to a collection.

**Example**

Parse [YAML Front Matter][yaml] and add the parsed data object to `view.data`:

```js
var matter = require('parser-front-matter');
app.onLoad(/\.hbs$/, function(view, next) {
  matter.parse(view, next);
});
```

### preLayout

Immediately before the first [layout][] in a [layout-stack][] is applied to a view.

```js
app.preLayout(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### onLayout

Called after each [layout][] in a [layout-stack][] is applied.

```js
app.onLayout(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### postLayout

Called after all [layouts][] have been applied to a view.

```js
app.postLayout(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### onMerge

Called directly before [partials][] collections are merged onto the [context][].

```js
app.onMerge(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### preCompile

Called before compiling a view.

```js
app.preCompile(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### postCompile

Called after compiling a view.

```js
app.postCompile(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### preRender

Called before rendering a view.

```js
app.preRender(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```

### postRender

Called after rendering a view.

```js
app.postRender(/\.hbs$/, function(view, next) {
  // do something with `view`
  next();
});
```


[yaml]: https://en.wikipedia.org/wiki/YAML
[verbs]: http://expressjs.com/api.html#router.METHOD

{%= reflinks(['express']) %}


