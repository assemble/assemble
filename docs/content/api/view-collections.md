---
title: View collections
category: api
collection: docs
description: >
  This document describes collections, how they are used in Assemble and how to create them.
related: ['collections', 'class.View']
---

## What is a "view collection"?

View collections are used for caching views, and are decorated with special methods and features that are helpful for handling templates, rendering, calculating context, and so on.

Also see [view-types](view-types.md).

## Built-in view collections

You might find it useful to brush up on [view-types](view-types.md) before continuing on with view collections. In a nutshell, view types determine how a view will be treated during the render-cycle. Assemble currently ships with three built-in view collections:

- [pages](#pages):
- [partials](#partials)
- [layouts](#layouts)

### Pages

**View type**: `renderable`

### Layouts

**View type**: `layout`

- Layouts are a special kind of view that belong to the `layouts` view collection
- Layouts are stored on the `assemble.views.layouts` object.

### Partials

**View type**: `partial`

## Custom view collections


## API

All view collections expose the following methods.

### .view

Create an un-cached [view](View.md) (a view that will not be added to the collection).

**Example**

To create an un-cached "page":

```js
var assemble = require('assemble');
var app = assemble();

// create a view collection
app.create('pages');

// create an un-cached "page"
var home = app.pages.view('home', {content: 'This is the home page'});
// do stuff with the "home" page
```

**Caching views**

Use [.addView](#addView) or [.setView](#setView) to cache views and add them to the collection.

### .setView

Set a [view](view.md) on the collection. This is identical to [addView](#addView) except `.setView` does not emit an event for each view.

```js
collection.setView('foo', {content: 'bar'});
```

To create an un-cached view, use [.view](#view).

### .addView

Add a [view](view.md) to the collection.

```js
collection.addView('foo', {content: 'bar'});
```

To create an un-cached view, use [.view](#view).
