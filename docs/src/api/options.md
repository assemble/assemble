---
title: Config
collection: docs
category: api
---

The purpose of the config API is to set and get general configuration values that can be used by any method. In other words, these methods are generically, and globally usable.

## .option

The `.option()` method sets values on the `assemble.options` object.

```js
// set
assemble.option('abc', true);

// get
assemble.option('abc')); //=> true
assemble.options.abc; //=> true
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

## .set / .get

The `.set()` method sets values on the `assemble` instance.

```js
assemble.set('level', 'admin');
assemble.get('level');
//=> 'admin'
```


## options.mergeTypes

Specify the [viewTypes](view-types.md) to merge onto the context with `mergePartials`. 

**Type:** `Array`

**Default:** All registered `partial` view types. The most commonly registered partial view types are `partials` and `includes`.

**Example**

Given the following configuration:

```js
app.create('pages'); // viewType is renderable by default
app.create('partials', {viewType: 'partial'});
app.create('includes', {viewType: 'partial'});

app.partial('foo', {content: 'abc'});
app.include('foo', {content: 'xyz'});

app.pages('bar', {content: '\{{> foo }}'});
```

and the following option:

```js
app.option('mergeTypes', ['includes']);
```

Then rendering the page `bar`, like so:

```js
app.pages.getView('bar')
  .render(function(err, res) {
    console.log(res.content)
    // results in => 'xyz'
  });
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
