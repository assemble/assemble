```js
assemble.template(singular, plural);
```

**Example:**

```js
assemble.template('include', 'includes');
```

Each new template `type` add two new methods to Assemble:

 - a method for loading one `type` template at a time
 - a method for loading multiple `type` templates at a time.


Continuing our example above:

```js
// load one include at a time
assemble.include();
// load multiple includes
assemble.includes();
```

## Create new template "types"

Templates loaded using these methods are stored on `assemble.cache[type]`, or continuing with the example, `assemble.cache.includes`.

**Loading template**

When loading templates via `assemble.includes()` or `assemble.include()`, templates can be specified either as objects, or as strings or arrays of glob patterns or file paths to the files to be parsed into template objects.

Template objects are expected to have the following properties:

  - `name` {String} The name of the include
  - `data` {Object} Context for the include
  - `content` {String} The actual content of the include.
  - `layout` {String} **Optionally** define a layout to be used for the given template.

**Example:**

```js
assemble.include({
 name: 'foo',
 data: {title: 'Include Foo'},
 content: 'Some content. '
});
```

## Pages

Add a page to `cache.pages`. pages can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

page objects are expected to have the following properties:

  - `name` {String} The name of the page
  - `data` {Object} Context for the page
  - `content` {String} The actual content of the page.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

* `patterns` **{String}**: File paths or glob patterns to pages.
* `options` **{String}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.page({
  name: 'a',
  layout: 'b',
  data: {title: 'page A'},
  content: 'Some content. '
});
```

Load pages onto the cache as normalized pages-objects.
Specify file paths or glob patterns for pages to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
pages will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each page as its unique identifier.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.pages('templates/pages/*.hbs');
```

## Partials

Add a partial to `cache.partials`. Partials can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Partial objects are expected to have the following properties:

  - `name` {String} The name of the partial
  - `data` {Object} Context for the partial
  - `content` {String} The actual content of the partial.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.partial({
  name: 'a',
  layout: 'b',
  data: {title: 'Partial A'},
  content: 'Some content. '
});
```

Load partials onto the cache as normalized partials-objects.
Specify file paths or glob patterns for partials to use with
the current view engine.

If a string or array of file paths or glob patterns is passed,
partials will be read from the file system, parsed into an
object, and stored on the `cache` using the full filepath
of each partial as its unique identifier.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.partials('templates/partials/*.hbs');
```

## Layouts

Add a layout to `cache.layouts`. Layouts can be defined either
as objects, or as glob patterns or file paths to the files to read
in and parse.

Layout objects are expected to have the following properties:

  - `name` {String} The name of the layout
  - `data` {Object} Context for the layout
  - `content` {String} The actual content of the layout.
  - `layout` {String} (Optional) You may optionally define a layout to use. This can also be defined on `data.layout`.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.

**Example:**

```js
assemble.layout({
  name: 'foo',
  data: {title: 'Layout Foo'},
  content: 'Some content. '
});
```

Returns an object with all the parsed layouts by name. Internally uses
the resolved layout filepaths from `options.layouts` to read in and cache
any layouts not already cached.

Use layout options to combine the patterns to make glob patterns for looking
up layouts.

* `patterns` **{String|Array|Object}**: Object, array of objects, file paths or glob patterns.
* `options` **{Object}**: Options to pass to the `loader.load()` method.
* returns **{Assemble}**: to enable chaining.
