---
title: Assemble Plugins
description: >
  This document tells you how to use and author plugins with Assemble.
category: subjects
related:
  - api/middleware
  - api/helpers
---

Assemble's first-class plugin system makes it super easy to add custom features and functionality.

## Plugin types

- [instance plugins](#instance-plugins)
- [pipeline plugins](#pipeline-plugins)

## Instance plugins

There are three kinds of instance plugins:

- [app](#app-instance-plugins) plugins
- [collection](#collection-instance-plugins) plugins
- [view](#view-instance-plugins) plugins

### Application instance plugins

**App plugins** are defined with the `.use()` method and are called immediately when an instance of Assemble is created.

- The `.use()` method takes a function that exposes the application instance as its only parameter.
- The instance is also available as `this` inside the plugin function.


**Examples**

```js
var app = assemble()
  .use(function() {
    // `this` is the current instance, e.g. `app`
    this.addFoo = function(str) {
      return str + 'foo';
    };
  })

app.addFoo('whatever');
//=> whateverfoo
```

**Chainable**

App plugins are also chainable, so the following is possible:

```js
var app = assemble()
  .use(function(app) {})
  .use(function(app) {})
  .use(function(app) {})
```

### Collection instance plugins

**Collection plugins** are identical to [app plugins](#app-instance-plugins), except they are used on a specific view collection, rather than the application instance.

**Example**

```js
var app = assemble();

app.create('pages')
  .use(function() {
    // `this` is the collection
    this.addFoo = function(str) {
      return str + 'foo';
    };
  });

app.pages.addFoo('whatever');
//=> whateverfoo
```

### View instance plugins

**View plugins** are identical to [app plugins](#app-instance-plugins) and [collection plugins](#collection-instance-plugins), except they are used on a single view instance, rather than the application or a collection instance.

**Example**

```js
var app = assemble();

app.create('pages');

app.page('home', {content: '<%%= name %>'})
  .use(permalink(':dest/:name.html'))
  .render(function(err, view) {
    if (err) return console.error(err);

    view.dest();
  });
```


## Pipeline plugins

Pipeline plugins are different than other plugins in that they must receive and return a [vinyl][] stream.

**Example**

```js
var app = assemble();
app.src('*.hbs')
  .pipe(permalinks())
  .pipe(app.dest('foo/'))
```
