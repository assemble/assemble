---
title: Config
collection: docs
category: api
description: > 
  The purpose of the config API is to set and get general configuration values that can be used by any method. In other words, these methods are generically, and globally usable.
---

## .option

The `.option()` method sets values on the `assemble.options` object.

```js
// set
assemble.option('abc', true);

// get
assemble.option('abc')); 
//=> true
assemble.options.abc; 
//=> true
```

In addition to `.option()`, the following methods may be used as convenience methods for getting and setting Boolean values on the `assemble.options` object:

```js
assemble.enable('xyz');
//=> assemble.options.xyz = true;

assemble.disable('xyz');
//=> assemble.options.xyz = false;
```

Is `xyz` enabled?

```js
assemble.enabled('xyz');
//=> 'true'
```

Is `xyz` disabled?

```js
assemble.disabled('xyz');
//=> 'false'
```

# Options

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

cwd
namespaceData

## Reserved words

- `options`
  * `rename`
  * `flatten`
  * `ext`
  * `extDot`
  * `base`
  * `cwd`
- `files`
- `dest`
- `src`
