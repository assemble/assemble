---
title: Data
collection: docs
category: api
description: >
  Set, load or get data to be used for rendering templates.
---

The `.data` method is exposed on the [app]() instance, as well as the following:

- [view]()
- [item]()


### .data

Set, get and load data to be used for rendering templates. 

```js
app.data([data]);
```

If a string (`key`) is passed and is a property on the `app.cache.data` object, the value of `key` is returned.

**Params**

* `key` **{String|Object|Array}**: Pass a key-value pair, object, glob pattern, file path or array of glob patterns or filepaths. 
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

## Global data

Set a site-wide `title` to be used on all "pages" or "posts":

```js
app.data({
  site: {
    title: 'Blog'
  }
});
```

Load data from a filepath:

```js
app.data('package.json');
```

## options.namespace

_(TODO: namespace option/method for data)_

For more complex data needs, like working with i18n data, you can pass a function to `app.options.namespace` to customize how data properties are define:

```js
app.option('namespace', function(filepath, options) {

});
```
