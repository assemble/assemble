---
title: Rename view keys
description: >
  This recipe shows how to customize the key this is used for storing and looking up views.
category: recipes
---

```js
var path = require('path');
var assemble = require('assemble');
var app = assemble();

app.option('renameKey', function(key) {
  return path.basename(key, path.extname(key));
});

app.create('pages');

app.pages('a/b/c/d.hbs', {content: 'foo'});
app.pages('a/b/c/e.hbs', {content: 'foo'});
app.pages('a/b/c/f.hbs', {content: 'foo'});
console.log(app.views.pages);

// { d: <Page "a/b/c/d.hbs" <Buffer 66 6f 6f>>,
//   e: <Page "a/b/c/e.hbs" <Buffer 66 6f 6f>>,
//   f: <Page "a/b/c/f.hbs" <Buffer 66 6f 6f>> }
```
