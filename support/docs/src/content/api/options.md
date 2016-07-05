---
draft: true

title: Config
collection: docs
category: api
description: > 
  The purpose of the config API is to set and get general configuration value that are globally usable and accessible in your assemble application.
---

#### .option

Set or get an option value.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
app.option('a', 'b');
app.option({c: 'd'});
console.log(app.options);
//=> {a: 'b', c: 'd'}
```

## .enable / .disable

In addition to `.option()`, the following methods may be used as convenience methods for getting and setting Boolean values on the `app.options` object:

```js
app.enable('xyz');
//=> app.options.xyz = true;

app.disable('xyz');
//=> app.options.xyz = false;
```

Is `xyz` enabled?

```js
app.enabled('xyz');
//=> 'true'
```

Is `xyz` disabled?

```js
app.disabled('xyz');
//=> 'false'
```

## Helper options

Helper options may defined on `app.option()` by prefixing the option property with the name of the helper.

**Example**

To define options for helper `foo`:

```js
app.option('helper.foo', {bar: 'baz'});
// or
app.option('helper.foo.bar', 'baz');
```

# Currently supported options

- `cwd`:
- `deep`:
- `extendViews`:
- `hash`:
- `inflection`:
- `Item`:
- `items`:
- `layout`:
- `List`:
- `mergePartials`:
- `namespaceData`:
- `plural`:
- `rename`:
- `renameFn`:
- `renameKey`:
- `rethrow`:
- `sort`:
- `View`:
- `Views`:
- `views`:
- `viewType`:

