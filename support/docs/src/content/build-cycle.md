---
title: Build Cycle
category: docs
sortBy: 20
---
**Overview**

* initialize app
* read
* transform
* write

**Build stages**

* initialize app
* create collection (only applies to cached views)
* load view
* render cycle
  - ~~build grid~~ (coming soon)
  - apply layout
  - merge context
  - compile
  - render
* write

## Plugins

Unless explicitly invoked by the user (using `.use` or `.run`, for example), instance plugins are only invoked when an instance is created.

**Instances**

More specifically, plugins are invoked when the following instances are created:

- App: `app` plugins are invoked when the application (assemble) instance is initialized
- Collection: `collection` plugins are invoked when a collection is created
- View: `view` plugins are invoked when a view is created

**Exceptions to the rule**

- Un-cached (collection-less) views might be created before any collections are created (for example, views created using `app.view()` are not cached on a collection)
- Plugins that are _defined on a collection_ will only be passed to views created by the collection.

## Middleware

Middleware handlers correspond to points during the build cycle.

## View lifecycle

- [load](#load)
- [render cycle](#render-cycle)
- [write](#write)

### Load

The "load" stage corresponds to when a `view` is _loaded onto a collection_. This is also the point the `.onLoad` middleware handler is invoked.

- `app.src`
- `collection.addView`
- `collection.setView`

**Exception to the rule: un-cached views**

Methods are available for creating collection-less (un-cached) views. Namely:

- `app.view`
- `collection.view`

However, since views created by these methods are, by definition, not "loaded" onto a collection (even when created by `collection.view`), the `.onLoad` middleware handler is not called (by default). You can work around this by calling the `.onLoad` middleware yourself.

For example, since the [assemble-render-file][] plugin renders views that may or may not belong to a collection (and some views might have been loaded by `app.src()`, versus a collection method), the `.onLoad` middleware handler is called before `.render`, to ensure that all `.onLoad` middleware functions are called, regardless of how the views were loaded.

### Render cycle

The render cycle is the most complex part of the build cycle, and consists of five major "stages":

- ~~build grid~~ (coming soon)
- apply layout
- merge context
- compile
- render

**In detail**

Create the context:

- merge context (not a middleware stage)

Start the render cycle:

- pre-render
- pre-compile (if `.compile` is called directly, this will happen before pre-render)

Apply the layout stack:

- pre-layout
- on-layout
- post-layout

Merge helpers and partials onto the context:

- merge helpers (not a middleware stage)
- on-merge (partials)

Finish compiling:

- compile (`.compile` method is called)
- post-compile

Finish rendering:

- render (`.render` method is called)
- post-render

**Related API methods**

- `.compile`
- `.render`

### Write

- `onStream`
- `preWrite`
- `postWrite`


**Related API methods**

- `view.write`
- `app.dest`


### Pre-render

- `.preRender` middleware is invoked
- `preRender` event is emitted

### Render

### Post-render
