---
title: collection.view
collection: docs
category: api
description: >
  This document describes the `collection.view` method.
related:
  - view-collections
  - app.view
  -
    title: View API
    key: class.View
---

All view collections expose a `.view` method that can be used for creating an un-cached [view](View.md). In other words, a view that will not be added to the collection.

**Example**

To create a collection-less (un-cached) "page":

```js
var assemble = require('assemble');
var app = assemble();

// create a view collection
app.create('pages');

// create an un-cached "page"
var home = app.pages.view('home', {content: 'This is the home page'});
// do stuff with the "home" page
```

**Caching views**

To cache views (by adding them to a collection) you would use `.addView` or `.setView`. See the [view-collection docs](view-collections.md) for more details.
