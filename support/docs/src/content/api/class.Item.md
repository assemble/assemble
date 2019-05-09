---
title: Item
category: api
---

The `Item` class is used by the [Collection](/api/Collection.md) class to create an `item`.

## API

### Item

Create an instance of `Item`. Optionally pass a default object to use.

**Params**

* `item` **{Object}**

**Example**

```js
var item = new Item({
  path: 'foo.html',
  content: '...'
});
```

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
item.data('a', 'b');
item.data({c: 'd'});
console.log(item.cache.data);
//=> {a: 'b', c: 'd'}
```

### .clone

Re-decorate Item methods after calling vinyl's `.clone()` method.

**Params**

* `options` **{Object}**
* `returns` **{Object}** `item`: Cloned instance

**Example**

```js
item.clone({deep: true}); // false by default
```

## .inspect

The `.inspect` method uses node's [inspect feature](https://nodejs.org/api/util.html#util_util_inspect_object_options) to create a string representation of the `item` object, which changes how the `item` object appears in the terminal

**Example**

```js
<Item "foo" <Buffer 2e 2e 2e>>
```

