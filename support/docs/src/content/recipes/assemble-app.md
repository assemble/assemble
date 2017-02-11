---
title: Creating your assemble app
category: recipes
related: ['assemblefile']
---

The main export of `assemble` is a constructor function that must be called to create your "app":

```js
var assemble = require('assemble');
var app = assemble();
```

This allows you to create multiple instances if necessary:

```js
// instance of assemble for `blog`
var blog = assemble();

// instance of assemble for `site`
var site = assemble();
```

