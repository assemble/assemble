---
title: Listening for views
category: recipes
---

When a view is created by a collection, an `view` event is emitted, and a event with the _singular name of the collection_ is emitted. In other words, the `pages` collection will emit a `page` event when a view is created.

**Examples**

```js
var assemble = require('assemble');
var app = assemble();

app.create('pages');
app.create('partials', { viewType: 'partial' });

app.on('view', function(view) {
  // will listen for both "pages" and "partials"
});

app.on('page', function(page) {
  // will listen for "page"
});

app.on('partial', function(partial) {
  // will listen for "partial"
});
```
