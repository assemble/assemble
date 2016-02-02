---
title: View
collection: docs
category: api
description: >
  This document explains what a "view" is, and how views are used in Assemble. 
related: 
  - { title: collections, url: collections.md }
  - { title: view-types, url: view-types.md }
---

## Summary

The `View` class is used to add "views" to "view collections" in assemble. Pages, posts, layouts, partials and includes are all examples of view collections you can create. A "page" would represent a single view in a "pages" (view) collection.

## What is a view?

Created by the [View](/api/View.api.md) constructor, a `view` can be thought of as a "template object". For this reason the terms "view" and "template" are used interchangeably throughout the documentation.

Views are also instances of [vinyl][] files, so they have all of properties and features you would expect a vinyl file to have, with the addition of the following properties that are introduced by [templates][] (The library that powers template and collections functionality in assemble):

- `view.key` **String**: Used as the object key when a view is added to a collection, and also used for lookups. See [app.getView][] and [app.find][]
- `view.content` **String**: View contents
- `view.options`
- `view.data`

See the [vinyl][] docs for more details.

## .setView

Set a view on the collection. This is identical to [addView](#addView) except `setView` does not emit an event for each view.

```js
collection.setView('foo', {content: 'bar'});
```

## .addView

Add a view to a collection. 

```js
collection.addView('foo', {content: 'bar'});
```


## Related

* [View API](/api/view.api.md)