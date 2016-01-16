---
title: Views
draft: true
---

The `Views` class is used internally for creating collections. But it's also exposed so you can create collections directly if you need to.

```js
var posts = new Views();
```

**Example usage**

```js
var path = require('path');
var assemble = require('assemble');
var Views = assemble.Views;

var pages = new Views({
  renameKey: function(key) {
    return path.basename(key);
  }
});

pages.engine('text', require('engine-base'));

pages.addViews({
  'a': {content: 'a <%= title %> b', locals: {title: 'aaa'}},
  'b': {content: 'a <%= title %> b', locals: {title: 'bbb'}},
  'c': {content: 'a <%= title %> b', locals: {title: 'ccc'}}
});

var view = pages.compile('a');
console.log(view.fn({title: 'foo'}));
```