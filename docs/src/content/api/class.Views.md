---
title: Views
category: api
draft: true
---

## Overview

The `Views` class is responsible for view collections in assemble. Whenever the `.create` method is used, an instance of `Views` is created. Thus, all of the methods and properties unique to view collections, such as `.addView` and `.getView`, are prototype methods on the `View` class.

The `View` class is also exposed as a property on `app` in case you need to access it directly.

**Example**

```js
var assemble = require('assemble');
var app = assemble();
var views = new app.Views();
```

**Related**

Also see:

- [View](View.md)
- [view-collections](view-collections.md)

## API

Methods, features and options available on the `Views` class.

### Views

Create an instance of `Views` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Views();
collection.addView('foo', {content: 'bar'});
```

### .setView

Set a view on the collection. This is identical to [addView](#addView) except `setView` does not emit an event for each view.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` instance.

**Example**

```js
collection.setView('foo', {content: 'bar'});
```

### .addView

Similar to [setView](#setView), adds a view to the collection but also fires an event and iterates over the loading `queue` for loading views from the `addView` event listener. If the given view is not already an instance of `View`, it will be converted to one before being added to the `views` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `View` to allow chaining view methods.

**Example**

```js
var views = new Views(...);
views.addView('a.html', {path: 'a.html', contents: '...'});
```

### .deleteView

Delete a view from collection `views`.

**Params**

* `key` **{String}**
* `returns` **{Object}**: Returns the instance for chaining

**Example**

```js
views.deleteView('foo.html');
```

### .addViews

Load multiple views onto the collection.

**Params**

* `views` **{Object|Array}**
* `returns` **{Object}**: returns the `collection` object

**Example**

```js
collection.addViews({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### .addList

Load an array of views onto the collection.

**Params**

* `list` **{Array}**
* `returns` **{Object}**: returns the `views` instance

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### .getView

Get a view from the collection.

**Params**

* `key` **{String}**: Key of the view to get.
* `returns` **{Object}**

**Example**

```js
collection.getView('a.html');
```

### .extendView

Load a view from the file system.

**Params**

* `view` **{Object}**
* `returns` **{Object}**

**Example**

```js
collection.loadView(view);
```

### .extendView

Decorate each view on the collection with additional methods and properties. This provides a way of easily overriding defaults.

**Params**

* `view` **{Object}**
* `returns` **{Object}**

**Example**

```js
collection.extendView(view);
```

### .isType

Return true if the collection belongs to the given view `type`.

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
collection.isType('partial');
```

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
views.data('a', 'b');
views.data({c: 'd'});
console.log(views.cache.data);
//=> {a: 'b', c: 'd'}
```

## Views Examples

Create an instance of `Views`:

```js
var posts = new Views();
```

**Usage**

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
