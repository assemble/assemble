---
title: Assemble instance
category: recipes
related: ['assemblefile']
---

The main export of the `assemble` library is the `Assemble` constructor function. To use assemble, you must first create an instance (your `app`):

**Example**

```js
var assemble = require('assemble');

// create an instance
var app = assemble();
```

This pattern is useful for when you need to create more than one instance:

```js
// instance of assemble for `blog`
var blog = assemble();

// instance of assemble for `site`
var site = assemble();
```

