---
title: ES2015 generators
category: recipes
description: Using es2015 javascript generators in assemble tasks
---

Assemble is now able to directly take a generator function as a task function. This removes the need for a callback when running synchronous code inside tasks.

**From**

```js
app.task('load', function(cb) {
  app.layouts(['src/layouts/**/*.hbs']);
  app.partials(['src/partials/**/*.hbs']);
  app.pages(['src/pages/**/*.hbs']);
  cb();
});
```

**To**

```js
app.task('load', function*() {
  app.layouts(['src/layouts/**/*.hbs']);
  app.partials(['src/partials/**/*.hbs']);
  app.pages(['src/pages/**/*.hbs']);
});
```

This also allows using generator features like `yield`.

> assemblefile.js

```js
'use strict';

var assemble = require('assemble');
var thunk = require('thunkify');
var fs = require('fs');
var app = assemble();

var readFile = thunk(fs.readFile);

app.task('read', function*() {
  var contents = yield readFile('./package.json', 'utf8');
  console.log(contents);
});

app.task('default', ['read']);

module.exports = app;
```

> output

![image](https://cloud.githubusercontent.com/assets/995160/13847098/c4b8953e-ec21-11e5-8ccd-7978c9845462.png)
