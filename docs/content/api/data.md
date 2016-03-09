---
title: Data
collection: docs
category: api
description: >
  Set, load or get data to be used for rendering templates.
---

## Overview

Set, get and merge data onto the `app.cache.data` object, to be used as context for rendering templates. 

**Example**

```js
app.data({site: {title: 'Home'}});
// or
app.data('site.title', 'Home');
console.log(app.cache.data);
//=> {site: {title: 'Home'}}

// or
app.data('a', 'b');
app.data({c: 'd'});
app.data('e', ['f']);
console.log(app.cache.data);
//=> {a: 'b', c: 'd', e: ['f']}
```

## API

### .dataLoader

Register a data loader for loading data onto `app.cache.data`.

**Params**

* `ext` **{String}**: The file extension for to match to the loader
* `fn` **{Function}**: The loader function.

**Example**

```js
var yaml = require('js-yaml');

app.dataLoader('yml', function(str, fp) {
  return yaml.safeLoad(str);
});

app.data('foo.yml');
//=> loads and parses `foo.yml` as yaml
```

### .data

Load data onto `app.cache.data`

**Params**

* `key` **{String|Object}**: Key of the value to set, or object to extend.
* `val` **{any}**
* `returns` **{Object}**: Returns the instance of `Template` for chaining

**Example**

```js
console.log(app.cache.data);
//=> {};

app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}

// set an array
app.data('e', ['f']);

// overwrite the array
app.data('e', ['g']);

// update the array
app.data('e', ['h'], true);
console.log(app.cache.data.e);
//=> ['g', 'h']
```

## Glob patterns

Glob patterns may be passed as a string or array. All of these should work:

```js
app.data('foo.json');
app.data('*.json');
app.data(['*.json']);
// pass options to node-glob
app.data(['*.json'], {dot: true});
```

## Get data

If a single string argument (`key`) is passed and is a property on the `app.cache.data` object, the value of `key` is returned.

**Example**

```js
app.data('a', 'b');
console.log(app.data('a'));
//=> 'b'
```

## Namespacing

Namespacing allows you to load data onto a specific key, optionally using part of the file path as the key.

**Example**

Given that `foo.json` contains `{a: 'b'}`:

```js
app.data('foo.json');
console.log(app.cache.data);
//=> {a: 'b'}

app.data('foo.json', {namespace: true});
console.log(app.cache.data);
//=> {foo: {a: 'b'}}

app.data('foo.json', {
  namespace: function(fp) {
    return path.basename(fp);
  }
});
console.log(app.cache.data);
//=> {'foo.json': {a: 'b'}}
```

**options.namespace**

Or define a custom namespace function on `options.namespace`.

```js
app.option('namespace', function(fp) {
  return path.basename(fp);
});
```
