---
title: Merging context
description: >
  This recipe shows different strategies for merging the context object before rendering, based on which data should be given preferential treatment.
category: recipes
---
Learn more about [context](./terminology#context)

## Middleware

If you need control over how context is merged on a view-by-view basis, one solution is to create a custom `preRender` middleware.

**Example**

Let's say you have a view (any template, such as a partial, page, layout, and so on) with the following contents:

```hbs
---
title: Foo
---

This is {{title}}
```

**Pre-render middleware**

In the following example:

- `app.cache.data` is the "global" data object, populated using the `app.data()` method
- `view.data` is view-specific data, typically from front-matter, but can also be from any other custom source

```js
var merge = require('mixin-deep');
var app = assemble();

// add data to `app.cache.data`
app.data({title: 'Site'});

// pre-render middleware
app.preRender(/\.hbs$/, function(view, next) {
  // app.cache.data => { title: 'Site' }
  // view.data => { title: 'Foo' }
  view.data = merge({}, app.cache.data, view.data);
  next();
});
```

**Make it re-usable**

We can make a slight abstraction to the above example to create a middleware that is more re-usable:

```js
function mergeContext(app, locals) {
  return function(view, next) {
    file.data = merge({}, app.cache.data, file.data, locals);
    next();
  };
}

// usage
app.preRender(/\.hbs$/, mergeContext(app, {title: 'Foo'}));
app.preRender(/\.txt$/, mergeContext(app, {title: 'Bar'}));
app.preRender(/\.ejs$/, mergeContext(app, {title: 'Baz'}));
```
