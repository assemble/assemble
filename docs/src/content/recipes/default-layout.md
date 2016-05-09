---
title: Default layout
description: >
  This recipe describes how to define a "default" layout.
category: recipes
---

**What is a "default" layout?**

A "default" layout is the layout that will be used on any [renderable views](/api/view-types.md#renderable) that do not already have a layout defined.

**Choices for defining a layout**

There are several ways to define a layout depending on what you need. This document covers the following:

* [assemble options](#assemble-options)
* [YAML front-matter](#yaml-front-matter)
* [middleware](#middleware)
* [plugins](#plugins)

Learn more about [layouts](/api/layouts.md).

## assemble options

To set the default layout to be used (globally) for all templates, define the layout on the assemble options:

```js
app.option('layout', 'blog-post');
console.log(app.options.layout);
//=> 'blog-post'
```

Learn more about [assemble options](/api/options.md).

## YAML front matter

Front matter is a good choice if you need to define a layout on a template-by-template basis:

```html
---
title: Categories | Blog
layout: 2-col-sidebar
---

The is the {{title}} page.
```

Learn more about [YAML front matter](/api/front-matter.md).

## Middleware

The `.preLayout` middleware method is a good time to set the layout, since this method is called immediately before layouts are applied:

```js
app.preLayout(/\.hbs$/, function(view, next) {
  // only set the layout if it's not already defined
  if (!view.layout) {
    view.layout = '3-column';
  }
  next();
});
```

Learn more about [middleware](/api/middleware.md).

## Plugins

### Instance plugins

**What is an instance plugin?**

Instance plugins are functions that expose the instance as the only parameter, and are run when an instance is created.

In this section, we show how to use a _view plugin_, which is an instance plugin that get called on a `view` (instance) when the view is created, directly after the `.onLoad` middleware is run.

Layouts defined using a view plugin might get overridden at some point later on at runtime - which is desirable in cases, like when a default layout should be set initially, but then updated dynamically based on path variables or permalinks.

```js
// define `view` plugins on a collection by
// returning a function inside the plugin
app.create('docs')
  .use(function(views) {
    return function(view) {
      if (!view.layout) {
        view.layout = '3-column';
      }
    };
  });
```

Learn more about [middleware](/api/middleware.md).
