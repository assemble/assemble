## Pages

Add a page to `cache.pages`. pages can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

page objects are expected to have the following properties:

  - `name` {String} The name of the page
  - `data` {Object} Context for the page
  - `content` {String} The actual content of the page.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

**Example:**

```js
assemble.page({
  name: 'a',
  layout: 'b',
  data: {title: 'page A'},
  content: 'Some content. '
});
```

@param {String} `patterns` File paths or glob patterns to pages.
@param {String} `options`
@return {Object}
@api public

Load pages onto the cache as normalized pages-objects.
Specify file paths or glob patterns for pages to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
pages will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each page as its unique identifier.

**Example:**

```js
assemble.pages('templates/pages/*.hbs');
```

@param {String|Array|Object} `patterns` Object, array of objects, file paths or glob patterns.
@param {String} `options` Options to pass to the `pagesCache.load()` method.
@return {Object} `Assemble` to enable chaining.
@api public

## Partials

Add a partial to `cache.partials`. Partials can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Partial objects are expected to have the following properties:

  - `name` {String} The name of the partial
  - `data` {Object} Context for the partial
  - `content` {String} The actual content of the partial.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

**Example:**

```js
assemble.partial({
  name: 'a',
  layout: 'b',
  data: {title: 'Partial A'},
  content: 'Some content. '
});
```

@param {String} `patterns` File paths or glob patterns to partials.
@param {String} `options`
@return {Object}
@api public

Load partials onto the cache as normalized partials-objects.
Specify file paths or glob patterns for partials to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
partials will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each partial as its unique identifier.

**Example:**

```js
assemble.partials('templates/partials/*.hbs');
```

@param {String|Array|Object} `patterns` Object, array of objects, file paths or glob patterns.
@param {String} `options` Options to pass to the `partialsCache.load()` method.
@return {Object} `Assemble` to enable chaining.
@api public


## Layouts

Add a layout to `cache.layouts`. Layouts can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Layout objects are expected to have the following properties:

  - `name` {String} The name of the layout
  - `data` {Object} Context for the layout
  - `content` {String} The actual content of the layout.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

**Example:**

```js
assemble.layout({
  name: 'foo',
  data: {title: 'Layout Foo'},
  content: 'Some content. '
});
```

@param {String} `patterns` File paths or glob patterns to layouts.
@param {Object} `options`
@return {Object} `Assemble` to enable chaining.
@api public

Returns an object with all the parsed layouts by name. Internally uses
the resolved layout filepaths from `options.layouts` to read in and cache
any layouts not already cached.
 
{%= docs("api-layouts") %}
Use layout options to combine the patterns to make glob patterns for looking
up layouts.

@param  {Array}  `patterns` Glob patterns for looking up layouts
@param  {Object} `options`  Options containing layout options
@return {Object} `Assemble` to enable chaining.
@api public
