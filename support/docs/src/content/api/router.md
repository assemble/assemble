---
title: Router
collection: docs
category: api
---

## Overview

This document describes the various features, options and API router methods available on Templates.js.

## Router methods

Router methods are similar to the router METHODS in [express][], but instead of representing [HTTP METHODS][verbs], the router methods here represent significant points or "stages" during the build cycle. 

**Summary**

- `onLoad`: Immediately after a view is loaded, after the `load` event is emitted, and before adding the view to a collection.
- `preLayout`: Immediately before the first [layout][] in a [layout-stack][] is applied to a view.
- `onLayout`: Called after each [layout][] in a [layout-stack][] is applied.
- `postLayout`: Called after all [layouts][] have been applied to a view.
- `onMerge`: Called directly before [partials][] collections are merged onto the [context][].
- `preCompile`: Called before compiling a view.
- `postCompile`: Called after compiling a view.
- `preRender`: Called before rendering a view.
- `postRender`: Called after rendering a view.


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
