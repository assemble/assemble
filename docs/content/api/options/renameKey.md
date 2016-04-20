---
title: "Option: renameKey"
category: api
---

The `renameKey` option takes a function that allows you to customize the keys of views in a collection.

**Type**: `function`

**Default**: `undefined`

**Params**:

- `key` **{String}**: The property key used for setting the view on the `views` object
- `view` **{Object|undefined}**: The same `renameKey` function is used for both getting and setting a view. When setting a view, `renameKey` exposes the `view` as the second parameter. When getting a view, the second parameter will be undefined.

**Examples**

```js
var path = require('path');

app.option('renameKey', function(key) {
  return view ? view.basename : path.basename(key);
});

app.create('pages');
app.pages('a/b/c/d.md', {content: 'this is d...'});
app.pages('a/b/c/e.md', {content: 'this is e...'});
app.pages('a/b/c/f.md', {content: 'this is f...'});

console.log(Object.keys(app.views.pages));
//=> ['d.md', 'e.md', 'f.md']
```

## Details

* The `view.key` property is used as a view's object key when adding the view to a collection
* `options.renameKey` must be defined **before** views are created
* If a custom `renameKey` function is _not defined by the user_, `view.key` is set to the same value as `view.path`.
* A `renameKey` function may be passed on the options of the collection, or to rename all keys in all collections, you may pass a `renameKey` function on the `app` options.
