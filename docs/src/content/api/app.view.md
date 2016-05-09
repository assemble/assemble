---
title: app.view
collection: docs
category: api
description: >
  This document describes the `app.view` method.
related:
  docs:
    - view-collections
    - collection.view
    - class.View
    -
      title: View API # custom title
      key: class.View # may use `key`, `name`, or `url`
---

Create an un-cached [view](View.md) that will not be added to the collection.

**Example**

To create an un-cached "page":

```js
var assemble = require('assemble');
var app = assemble();

// create an un-cached "view"
var view = app.view('home', {content: 'This is a random view'});
// do stuff with "view"
```
