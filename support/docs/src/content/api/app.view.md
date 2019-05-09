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

Create an un-cached [view](View.md) that is directly returned and is not added to a collection.

**Example**

```js
var assemble = require('assemble');
var app = assemble();

var view = app.view('home', {content: 'This is a random view'});
console.log(view);
```
