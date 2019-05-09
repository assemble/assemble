---
draft: true

title: Collection
category: api
collection: docs
description: > 
  Learn how to create custom collections with the `Collection` class.
---

The `Collection` class is used internally by assemble for creating view collections, and is also exposed as a static property on assemble's API since it can be useful for creating custom collections. 

## Collection

Create an instance of `Collection` with `options` to instantiate with:

**Params**

* `options` **{Object}**

**Example**

```js
var assemble = require('assemble');
var Collection = assemble.Collection;
var collection = new Collection(options);
```

**Usage**

Now you can use methods on the collection, such as `addItem`, for adding items to the collection:

```js
collection.addItem('foo', {content: 'bar'});
```

## Methods

* [.setItem](#setItem)
* [.addItem](#addItem)
* [.addItems](#addItems)
* [.addList](#addList)
* [.getItem](#getItem)

### .setItem

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### .addItem

Similar to `setItem`, adds an item to the collection but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener.  An item may be an instance of `Item`, if not, the item is converted to an instance of `Item`.

**Params**

* `key` **{String}**
* `value` **{Object}**

**Example**

```js
var list = new List(...);
list.addItem('a.html', {path: 'a.html', contents: '...'});
```

### .addItems

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### .addList

Load an array of items onto the collection.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the Collection instance for chaining

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### .getItem

Get an item from the collection.

**Params**

* `key` **{String}**: Key of the item to get.
* `returns` **{Object}**

**Example**

```js
collection.getItem('a.html');
```
