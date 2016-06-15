---
title: Register helpers
category: recipes
---
All examples below assume we're starting with the following code:

```js
var assemble = require('assemble');
var app = assemble();
```

## .helper

Register a helper:

**Example**

```js
app.helper('upper', function(str) {
  return str.toUpperCase();
});
```

**Usage**

```handlebars
---
title: home page
---

<h1>\{{upper title}}</h1>
```

**Results in**:

```html
<h1>HOME PAGE</h1>
```


## .asyncHelper

Register an async helper:

**Example**

```js
app.asyncHelper('upper', function(str) {
  next(null, str.toUpperCase());
});
```

**Usage**

Async helper usage is identical to sync helper usage.

```handlebars
---
title: home page
---

<h1>\{{upper title}}</h1>
```

**Results in**:

```html
<h1>HOME PAGE</h1>
```

