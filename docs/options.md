### [Template](https://github.com/jonschlinkert/template/blob/master/index.js#L58)

Create a new instance of `Template`, optionally passing default `options` to initialize with.

* `options` **{Object}**: Options to initialize with.    

**Example:**

```js
var Template = require('template');
var template = new Template();
```

### [.default engines](https://github.com/jonschlinkert/template/blob/master/index.js#L262)

Load default engines. The default engine, [engine-lodash] will process templates in any files with the `.md` extension. To change or negate these extensions, just do:

```js
engine.option('defaultExts', 'md');
// or an array of extensions
engine.option('defaultExts', ['hbs', 'md']);
```

### [.transform](https://github.com/jonschlinkert/template/blob/master/index.js#L316)

Assign transform `fn` to `name` or return the value of `name` if no other arguments are passed.

* `name` **{String}**: The name of the transform to add.    
* `fn` **{Function}**: The actual transform function.    
* `returns` **{Object}**: Returns `Template` for chaining.  

Transforms are run immediately during init, and are used to
extend or modify the `cache.data` object, but really anything
on the `this` object can be tranformed.

```js
template.transform('username', function(app) {
  var url = app.cache.data.author.url.split('/');
  app.cache.data.username = url[2];
});
```

### [.route](https://github.com/jonschlinkert/template/blob/master/index.js#L403)

Proxy to the engine `Router#route()` Returns a new `Route` instance for the `path`.

* `path` **{String}**    

Routes are isolated middleware stacks for specific paths.
See the Route api docs for details.

### [.param](https://github.com/jonschlinkert/template/blob/master/index.js#L421)

Proxy to `Router#param()` with one added api feature. The `name` parameter can be an array of names.

* `name` **{String|Array}**    
* `fn` **{Function}**    
* `returns` **{Object}** `Template`: for chaining  

See the Router#param() docs for more details.

Delegate `.METHOD(...)` calls to `router.METHOD(...)`

### [.all](https://github.com/jonschlinkert/template/blob/master/index.js#L522)

Special-cased "all" method, applying the given route `path`, middleware, and callback.

* `path` **{String}**    
* **{Function}**: Callback    
* `returns` **{Object}** `Template`: for chaining  

```js
template.all(/\.md$/, function (file, next) {
  // do stuff next();
});
```

### [.addDelims](https://github.com/jonschlinkert/template/blob/master/index.js#L612)

Cache delimiters by `name` with the given `options` for later use.

* `name` **{String}**: The name to use for the stored delimiters.    
* `delims` **{Array}**: Array of delimiter strings. See [delims] for details.    
* `opts` **{Object}**: Options to pass to [delims]. You can also use the options to override any of the generated delimiters.    

**Example:**

```js
template.addDelims('curly', ['{%', '%}']);
template.addDelims('angle', ['<%', '%>']);
template.addDelims('es6', ['${', '}'], {
  // override the generated regex
  interpolate: /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g
});
```

### [.useDelims](https://github.com/jonschlinkert/template/blob/master/index.js#L665)

Specify by `ext` the delimiters to make active.

* `ext` **{String}**    

```js
template.useDelims('curly');
template.useDelims('angle');
```

### [.handleDelims](https://github.com/jonschlinkert/template/blob/master/index.js#L695)

Specify by `ext` the delimiters to make active.

* `ext` **{String}**    

```js
template.useDelims('curly');
template.useDelims('angle');
```

### [.engine](https://github.com/jonschlinkert/template/blob/master/index.js#L762)

* `exts` **{String|Array}**: File extension or array of extensions.    
* `fn` **{Function|Object}**: or `options`    
* `options` **{Object}**    
* `returns` **{Object}** `Template`: to enable chaining  

{%= docs("api-engine") %}

Register the given view engine callback `fn` as `ext`. If only `ext`
is passed, the engine registered for `ext` is returned. If no `ext`
is passed, the entire cache is returned.

### [.getEngine](https://github.com/jonschlinkert/template/blob/master/index.js#L783)

Get the engine settings registered for the given `ext`.

* `ext` **{String}**: The engine to get.    
* `returns` **{Object}**: Object with methods and settings for the specified engine.  

{%= docs("api-getEngine") %}

```js
template.getEngine('.html');
```

### [.getExt](https://github.com/jonschlinkert/template/blob/master/index.js#L809)

Used in the `.render()` method to select the `ext` to use for picking an engine.

* `template` **{Object}**: Template object    
* `locals` **{Object}**: Locals object    
* `returns` **{String}** `ext`: For determining the engine to use.  

This logic can be overridden by passing a custom
function on `options.getExt`, e.g.:

**Example:**

```js
template.option('getExt', function(template, locals) {
  return path.extname(template.path);
});
```

### [.helper](https://github.com/jonschlinkert/template/blob/master/index.js#L907)

Register generic template helpers that are not specific to an engine.

* `key` **{String}**: Helper name    
* `fn` **{Function}**: Helper function.    

Helpers registered using this method will be passed to every
engine, so this method is best for generic javascript functions -
unless you want to see Lo-Dash blow up from `Handlebars.SafeString`.

```js
template.helper('lower', function(str) {
  return str.toLowerCase();
});
```

### [.helpers](https://github.com/jonschlinkert/template/blob/master/index.js#L928)

Register multiple helpers.

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.    

```js
template.addHelpers({
  a: function() {},
  b: function() {},
  c: function() {},
});
```

### [.asyncHelper](https://github.com/jonschlinkert/template/blob/master/index.js#L970)

Register generic async template helpers that are not specific to an engine.

* `name` **{String}**: Helper name.    
* `fn` **{Function}**: Helper function    

As with the sync version, helpers registered using this method will
be passed to every engine, so this method is best for generic
javascript functions.

```js
template.asyncHelper('lower', function(str, next) {
  str = str.toLowerCase();
  next();
});
```

### [.asyncHelpers](https://github.com/jonschlinkert/template/blob/master/index.js#L991)

Register multiple async helpers.

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.    

```js
template.addAsyncHelpers({
  a: function() {},
  b: function() {},
  c: function() {},
});
```

### [.engineHelpers](https://github.com/jonschlinkert/template/blob/master/index.js#L1009)

Register an object of helpers for the given `ext` (engine).

* `ext` **{String}**: The engine to register helpers with.    
* `returns` **{Object}**: Object of helpers for the specified engine.  

```js
template.helpers(require('handlebars-helpers'));
```

### [.validate](https://github.com/jonschlinkert/template/blob/master/index.js#L1194)

* `key` **{String}**: Template key    
* `value` **{Object}**: Template object    

Validate a template object to ensure that it has the properties
expected for applying layouts, choosing engines, and so on.

### [.view](https://github.com/jonschlinkert/template/blob/master/index.js#L1282)

* `collection` **{String}**    
* `name` **{String}**    
* `returns`: {Object}  

Get the given view `collection` from views. Optionally
pass a `name` to get a specific template from the
collection.

### [.getType](https://github.com/jonschlinkert/template/blob/master/index.js#L1365)

Get all views of the given [type]. Valid values are `renderable`, `layout` or `partial`.

* `type` **{String}**    
* `opts` **{Object}**    

```js
var pages = template.getType('renderable');
//=> { pages: { 'home.hbs': { ... }, 'about.hbs': { ... }}, posts: { ... }}
```

[type]: ./template-types

### [.mergeType](https://github.com/jonschlinkert/template/blob/master/index.js#L1388)

Merge all collections of the given `type` into a single collection. e.g. `partials` and `includes` would be merged.

* `type` **{String}**: The template type to search.    
* `collections` **{String}**: Optionally pass an array of collections    

If an array of `collections` is passed, only those collections
will be merged and the order in which the collections are defined
in the array will be respected.

### [.mergeLayouts](https://github.com/jonschlinkert/template/blob/master/index.js#L1419)

Merge all `layout` collections based on user-defined options.

* `type` **{String}**: The template type to search.    
* `collections` **{String}**: Optionally pass an array of collections    

```js
## [.mergePartials](https://github.com/jonschlinkert/template/blob/master/index.js#L1463)

Default method for determining how partials are to be passed to engines. By default, all `partial` collections are merged onto a single `partials` object. To keep each collection on a separate object, you can do `template.disable('mergePartials')`.

* `locals` **{Object}**: Locals should have layout delimiters, if defined    
* `returns`: {Object}  

If you want to control how partials are merged, you can also
pass a function to the `mergePartials` option:

```js
template.option('mergePartials', function(locals) {
  // do stuff
});
```

### [.findRenderable](https://github.com/jonschlinkert/template/blob/master/index.js#L1543)

Search all renderable `subtypes`, returning the first template with the given `key`.

* `key` **{String}**: The template to search for.    
* `subtypes` **{Array}**    

  - If `key` is not found an error is thrown.
  - Optionally limit the search to the specified `subtypes`.

### [.findLayout](https://github.com/jonschlinkert/template/blob/master/index.js#L1559)

Search all layout `subtypes`, returning the first template with the given `key`.

* `key` **{String}**: The template to search for.    
* `subtypes` **{Array}**    

  - If `key` is not found an error is thrown.
  - Optionally limit the search to the specified `subtypes`.

### [.findPartial](https://github.com/jonschlinkert/template/blob/master/index.js#L1575)

Search all partial `subtypes`, returning the first template with the given `key`.

* `key` **{String}**: The template to search for.    
* `subtypes` **{Array}**    

  - If `key` is not found an error is thrown.
  - Optionally limit the search to the specified `subtypes`.

### [.lookup](https://github.com/jonschlinkert/template/blob/master/index.js#L1589)

* `plural` **{String}**: The view collection to search.    
* `name` **{String}**: The name of the template.    
* `ext` **{String}**: Optionally pass a file extension to append to `name`    

Convenience method for finding a template by `name` on
the given collection. Optionally specify a file extension.

### [.create](https://github.com/jonschlinkert/template/blob/master/index.js#L1622)

Create a new `view` collection and associated convience methods.

* `subtype` **{String}**: Singular name of the collection to create, e.g. `page`.    
* `plural` **{String}**: Plural name of the collection, e.g. `pages`.    
* `options` **{Object}**: Options for the collection.  
    - `isRenderable` **{Boolean}**: Templates that may be rendered at some point
    - `isLayout` **{Boolean}**: Templates to be used as layouts
    - `isPartial` **{Boolean}**: Templates to be used as partial views or includes
      
* `stack` **{Function|Array}**: Loader function or functions to be run for every template of this type.    
* `returns` **{Object}** `Template`: to enable chaining.  

Note that when you only specify a name for the type, a plural form is created
automatically (e.g. `page` and `pages`). However, you can define the
`plural` form explicitly if necessary.

### [.compileTemplate](https://github.com/jonschlinkert/template/blob/master/index.js#L1718)

* `template` **{Object}**: The template object with content to compile.    
* `options` **{Object}**: Options to pass along to the engine when compile. May include a `context` property to bind to helpers.    
* `returns` **{Object}**: Template object to enable chaining.  

Compile content on the given `template` object with the specified
engine `options`.

### [.compile](https://github.com/jonschlinkert/template/blob/master/index.js#L1775)

* `file` **{Object|String}**: String or normalized template object.    
* `options` **{Object}**    
* `async` **{Boolean}**: Load async helpers    
* `returns` **{Function}**: Compiled function.  

Compile `content` with the given `options`.

### [.compileString](https://github.com/jonschlinkert/template/blob/master/index.js#L1807)

Compile the given string with the specified `options`.

* `str` **{String}**: The string to compile.    
* `options` **{Object}**: Options to pass to registered view engines.    
* `async` **{Boolean}**: Load async helpers    
* `returns`: {Function}  

The primary purpose of this method is to get the engine before
passing args to `.compileBase()`.

### [.renderTemplate](https://github.com/jonschlinkert/template/blob/master/index.js#L1857)

* `template` **{Object}**: The template object with content to render.    
* `locals` **{Object}**: Locals and/or options to pass to registered view engines.    
* `returns`: {String}  

Render content on the given `template` object with the specified
engine `options` and `callback`.

### [.render](https://github.com/jonschlinkert/template/blob/master/index.js#L2006)

* `file` **{Object|String}**: String or normalized template object.    
* `locals` **{Object}**: Locals and/or options to pass to registered view engines.    
* `returns` **{String}**: Rendered string.  

Render `content` with the given `options` and optional `callback`.

### [.renderString](https://github.com/jonschlinkert/template/blob/master/index.js#L2037)

Render the given string with the specified `locals` and `callback`.

* `str` **{String}**: The string to render.    
* `locals` **{Object}**: Locals and/or options to pass to registered view engines.    
* `returns`: {String}  

The primary purpose of this method is to get the engine before
passing args to `.renderBase()`.

### [.renderSubtype](https://github.com/jonschlinkert/template/blob/master/index.js#L2066)

Returns a render function for rendering templates of the given `subtype`.

* `plural` **{String}**: Template subtype, e.g. `pages`    
* `str` **{String}**: The string to render.    
* `locals` **{Object}**: Locals and/or options to pass to registered view engines.    
* `returns` **{Function}** `params`  

* `returns` **{String}** `string`: The rendered string.  

Mostly used internally as a private method, but it's exposed as a
public method since there are cases when it might be useful, like
for rendering templates in a gulp/grunt/assemble plugin.

### [.renderType](https://github.com/jonschlinkert/template/blob/master/index.js#L2098)

* `str` **{String}**: The string to render.    
* `locals` **{Object}**: Locals and/or options to pass to registered view engines.    
* `returns`: {String}  

Render the given string with the specified `locals` and `callback`.

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
