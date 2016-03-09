---
title: List
category: api
collection: docs
description: > 
  Learn how to create and work with lists, for grouping, sorting, pagination and more!
---

## List

Create an instance of `List` with the given `options`. Lists differ from collections in that items are stored as an array, allowing items to be paginated, sorted, and grouped.

**Params**

* `options` **{Object}**

**Example**

```js
var list = new List();
list.addItem('foo', {content: 'bar'});
```

## Methods

* [.addItem](#addItem)
* [.addItems](#addItems)
* [.addList](#addList)
* [.extendItem](#extendItem)
* [.getIndex](#getIndex)
* [.getItem](#getItem)
* [.groupBy](#groupBy)
* [.hasItem](#hasItem)
* [.paginate](#paginate)
* [.removeItem](#removeItem)
* [.setItem](#setItem)
* [.sortBy](#sortBy)

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

Similar to [setItem](#setItem), adds an item to the list but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener. If the given item is not already an instance of `Item`, it will be converted to one before being added to the `items` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `Item` to allow chaining item methods.

**Example**

```js
var items = new Items(...);
items.addItem('a.html', {path: 'a.html', contents: '...'});
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

Load an array of items or the items from another instance of `List`.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the List instance for chaining

**Example**

```js
var foo = new List(...);
var bar = new List(...);
bar.addList(foo);
```

### .hasItem

Return true if the list has the given item (name).

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.addItem('foo.html', {content: '...'});
list.hasItem('foo.html');
//=> true
```

### .getIndex

Get a the index of a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getIndex('foo.html');
//=> 1
```

### .getItem

Get a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<View <foo.html>>'
```

### .removeItem

Remove an item from the list.

**Params**

* `items` **{Object}**: Object of views

**Example**

```js
var list = new List(...);
list.addItems({
  'a.html': {path: 'a.html', contents: '...'}
});
```

### .extendItem

Decorate each item on the list with additional methods
and properties. This provides a way of easily overriding
defaults.

**Params**

* `item` **{Object}**
* `returns` **{Object}**: Instance of item for chaining

### .groupBy

Group all list `items` using the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns the grouped items.

**Example**

```js
var list = new List();
list.addItems(...);
var groups = list.groupBy('data.date', 'data.slug');
```

### .sortBy

Sort all list `items` using the given property, properties or compare functions. See [array-sort](https://github.com/jonschlinkert/array-sort) for the full range of available features and options.

* `returns` **{Object}**: Returns a new `List` instance with sorted items.

**Example**

```js
var list = new List();
list.addItems(...);
var result = list.sortBy('data.date');
//=> new sorted list
```

### .paginate

Paginate all `items` in the list with the given options, See [paginationator](https://github.com/doowb/paginationator) for the full range of available features and options.

* `returns` **{Object}**: Returns the paginated items.

**Example**

```js
var list = new List(items);
var pages = list.paginate({limit: 5});
```
