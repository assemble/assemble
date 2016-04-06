---
title: View
collection: docs
category: api
description: >
  This document explains what a "view" is, and how views are used in Assemble.
related: ['collections', 'view-types']
---

## Overview

The `View` class is used to add "views" to "view collections" in assemble. Pages, posts, layouts, partials and includes are all examples of view collections you can create. A "page" would represent a single view in a "pages" (view) collection.

## What is a view?

Created by the [View](/api/View.api.md) constructor, a `view` can be thought of as a "template object". For this reason the terms "view" and "template" are used interchangeably throughout the documentation.

Views are also instances of [vinyl][] files, so they have all of properties and features you would expect a vinyl file to have, with the addition of the following properties that are introduced by [templates][] (The library that powers template and collections functionality in assemble):

- `view.key` **String**: Used as the object key when a view is added to a collection, and also used for lookups. See [app.getView][] and [app.find][]
- `view.content` **String**: View contents
- `view.options`
- `view.data`

See the [vinyl][] docs for more details.

## View API

### View

Create a new `View` with the given object.

**Params**

* `view` **{Object}**

**Example**

```js
var view = new View({
  path: 'foo.html',
  content: 'this is content...'
});
```

### .context

Creates a context object from front-matter data, `view.locals` and the given `locals` object.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}**: Returns the context object.

**Example**

```js
var ctx = page.context({foo: 'bar'});
```

### .compile

Synchronously compile a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
var view = page.compile();
view.fn({title: 'A'});
view.fn({title: 'B'});
view.fn({title: 'C'});
```

### .render

Asynchronously render a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
view.render({title: 'Home'}, function(err, res) {
  //=> view object with rendered `content`
});
```

### .isType

Return true if the view is the given view `type`. Since types are assigned by collections, views that are "collection-less" will not have a type, and thus will always return `false` (as expected).

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
view.isType('partial');
```
