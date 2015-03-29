# Options API

> The Options API exposes methods for setting and getting options in Assemble. 

## Overview

- Options are stored on the `assemble.options` object.
- Options can be defined and used in any way you need in your projects. 
- Assemble uses the same API to set [default options][built-in options] for some of assemble's built-in features, such as `layout` and `layoutdir`. Defaults can easily be changed, disabled or overridden.

## Methods

The following methods are used for managing options in assemble:

- [.option](#option)
- [.enable](#enable)
- [.enabled](#enabled)
- [.disable](#disable)
- [.disabled](#disabled)

See [related links](#related).

## .option

Set an option

```js
assemble.option('foo', 'bar');
// or as an object
assemble.option({foo: 'bar'});
```

**Example usage:**

Pass config settings directly:

```js
assemble.option({
  layoutdir: 'templates/layouts',
  layout: 'blog'
});
```

### [.option](index.js#L44)

Set or get an option.

* `key` **{String}**: The option name.    
* `value` **{*}**: The value to set.    
* `returns` **{*}**: Returns a `value` when only `key` is defined.  

```js
assemble.option('a', true);
assemble.option('a');
//=> true
```

### [.enable](index.js#L71)

Enable `key`.

* `key` **{String}**    
* `returns` **{Object}** `Options`: to enable chaining  

**Example**

```js
assemble.enable('a');
```

### [.disable](index.js#L89)

Disable `key`.

* `key` **{String}**: The option to disable.    
* `returns` **{Object}** `Options`: to enable chaining  

**Example**

```js
assemble.disable('a');
```

### [.enabled](index.js#L110)

Check if `key` is enabled (truthy).

* `key` **{String}**    
* `returns`: {Boolean}  

```js
assemble.enabled('a');
//=> false

assemble.enable('a');
assemble.enabled('a');
//=> true
```

### [.disabled](index.js#L131)

Check if `key` is disabled (falsey).

* `key` **{String}**    
* `returns` **{Boolean}**: Returns true if `key` is disabled.  

```js
assemble.disabled('a');
//=> true

assemble.enable('a');
assemble.disabled('a');
//=> false
```

### [.hasOption](index.js#L151)

Return true if `options.hasOwnProperty(key)`

* `key` **{String}**    
* `returns` **{Boolean}**: True if `key` is is on options.  

```js
assemble.hasOption('a');
//=> false
assemble.option('a', 'b');
assemble.hasOption('a');
//=> true
```

### [.isBoolean](index.js#L171)

Return true if `options.hasOwnProperty(key)`

* `key` **{String}**    
* `returns` **{Boolean}**: True if `key` is is on options.  

```js
assemble.hasOption('a');
//=> false
assemble.option('a', 'b');
assemble.hasOption('a');
//=> true
```

### [.flags](index.js#L184)

* `keys` **{Array}**    
* `returns`: {Array}  

Generate an array of command line args from
the given `keys` or all options.


## Related

- Learn about [assemble's built-in options][built-in options]
- Visit [options-cache](https://github.com/jonschlinkert/options-cache) to see all available features.


[built-in options](./options-built-in.md)
