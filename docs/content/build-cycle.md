# Build Cycle

**Overview**

* initialize app
* read
* transform
* write

**View lifecycle**

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

Instance plugins are invoked at specific points during the application lifecycle.

**Application lifecycle**

- App: the application instance is initialized first
- Collection: next, collections are created, if defined
- View: last, views are created, if defined

**Exceptions to the rule**

- Un-cached (collection-less) views might be created before any collections are created, thus
- Plugins that are _defined on a collection_ will only be passed to views created by the collection.

### Plugin lifecycle

Accordingly:

- App plugins are invoked when the instance is created
- Collection plugins are invoked when a collection is created
- View plugins are invoked when a view is created

## Middleware

Middleware handlers correspond to points during the build cycle.

## Build cycle

Middleware handlers correspond to points during the build cycle.

## View lifecycle

- load
- render
- write

### Load

The "load" stage corresponds to when a `view` is _created and added to a collection_, at which point the `.onLoad` middleware handler is invoked.

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

_(These probably aren't in the 100% correct order! I just wanted to write it down so I wouldn't forget to do this. Feel free to do a pr with corrections :)_

- pre-render
- pre-compile
- apply layout
- merge partials
- merge helpers
- merge context
- compile
- post-compile
- render
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