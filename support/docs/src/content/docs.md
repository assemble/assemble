---
title: Advanced
category: docs
sortBy: 30
---
### Example: Pre-process CSS

**Using a plugin**

Use plugins to pre-process CSS (Assemble can run any gulp plugin):

```js
var assemble = require('assemble');
var less = require('gulp-less');

app.task('css', function () {
  app.src('styles/*.less')
    .pipe(less())
    .pipe(app.dest('dist/assets/css'));
});

app.task('default', ['css']);
```

**Or, using an engine**

Instead of a plugin you can register an engine, such as [engine-less](https://github.com/jonschlinkert/engine-less).

_(Engines are run automatically on any files that have a file extension matching the name that you used when registering the engine.)_

```js
var assemble = require('assemble');
app.engine('less', require('engine-less'));

app.task('css', function () {
  app.src('styles/*.less')
    .pipe(app.dest('dist/assets/css'));
});

app.task('default', ['css']);
```


## API

All of the following code examples assume the following code:

```js
var assemble = require('assemble');
var app = assemble();
```

## Collections

Assemble has first-class support for collections, with four different collection types to choose from, depending on your needs.

### Collection type comparison

**Collection type** | **Object (cache) type** | **Description**
--- | --- | ---
Collection | Object | Bare-bones collections, for caching an object of `items`. Use `app.collection()` or `new app.Collection()` when you want to customize your own render cycle, middleware handlers, or creating an entirely custom collection experience.
View collection | Object | Augments collections with special methods and middleware handlers that are synchronized to the render cycle. View collections are typically created using the [.create](#create) method.
List | Array | Similar to collections, but caches `items` as an **array**. Use `app.list()` or `new app.List()` to create a list.
Group | Object | Used within lists for grouping items. Can be used in conjunction with sorting, paging, pagination, and more.

## API

* [collections][]
  - [.create][]
  - [.addView][]
  - [.getView][]

### .create

Create a custom view collection.

```js
app.create('docs');
```

Adds both the `.doc` and `.docs` methods to `app` for loading views onto the collection (thanks to the [inflection][] library).

**Add views**

Add views to the custom `docs` collection.

```js
// define a "page"
app.doc('faq.hbs', { content: 'Read our FAQ' });

// load a glob of "pages"
app.docs('foo/*.hbs');
```

You can use `app.doc` or `app.docs` interchangeably.

**View cache**

Views are cached on `app.views.*` using the _plural_ name of the collection. So our custom `docs` views would be stored on `app.views.docs`.

**Get views**

Get views from the collection.

```js
var doc = app.docs.getView('faq.hbs');

// or
var doc = app.views.docs['faq.hbs'];
```

### View types

Assemble supports three different view types: `partial`, `renderable` and `layout`. View types determine how individual views will be handled during the render cycle. When a view collection is created, one or more view types may be passed on the options.

- partial
- renderable
- layout

### Built-in view collections

The following collections ship with assemble. The collections are created using the `.create` method, the same way a user would create them.

- [partials](#partial)
- [pages](#page)
- [layouts](#layout)

### .partial

> Add partials to be used in other templates.

```js
// define partials as objects
app.partial('button', { content: '<button>Click me!</button>' });
app.partial('banner', { content: '<div>Heads up!</div>' });

// or load a glob of partials
app.partials('partials/*.hbs');
```

**Usage**

Use the `partial` helper to inject into other templates:

```html
<!-- handlebars -->
\{{partial "banner"}}

<!-- lodash/erb style -->
<%%= partial("banner") %>
```

Get a cached partial:

```js
var banner = app.partials.getView('banner');
```

### .page

> Add pages that might be rendered (really, any template is renderable, pages fit the part though)

```js
app.page('toc.hbs', { content: 'Table of Contents...'});
// or load a glob of pages
app.pages('pages/*.hbs', {site: {title: 'Code Project'}});
```

Use the `page` helper to inject pages into other templates:

```js
\{{page "toc"}}
```

Get a cached page:

```js
var toc = app.views.pages['toc'];
```

Pages are `renderable` templates, so they also have a `.render()` method:

```js
var toc = app.views.pages['toc'];
// async
toc.render({}, function(err, content) {
  console.log(content);
});

// or sync
var res = toc.render();
```

**Params**

 - `locals` **{Object}**: Optionally pass locals as the first arg
 - `callback` **{Function}**: If a callback is passed, the template will be rendered async, otherwise sync.


### .layout

> Add layouts, which are used to "wrap" other templates:

```js
app.layout('default', {content: [
  '<!DOCTYPE html>',
  '  <html lang="en">',
  '  <head>',
  '    <meta charset="UTF-8">',
  '    <title>{%%= title %}</title>',
  '  </head>',
  '  <body>',
  '    {%% body %}', // `body` is the insertion point for another template
  '  </body>',
  '</html>'
].join('\n')});

// or load a glob of layouts
app.layouts('layouts/*.hbs', {site: {title: 'Code Project'}});
```

Layouts may be use with any other template, including other layouts. Any level of nesting is also possible.

**Body tags**

Layouts use a `body` as the insertion point for other templates. The syntax assemble uses for the `body` tag is:

```js
{%% body %}
```

Admittedly, it's a strange syntax, but that's why we're using it. assemble shouldn't collide with templates that you might be using in your documentation.


**Usage**

Layouts can be defined in template locals:

```js
// either of these work (one object or two)
app.page('toc.hbs', { content: 'Table of Contents...'}, { layout: 'default' });
app.partial('foo.hbs', { content: 'partial stuff', layout: 'block' });
```

Or in the front matter of a template. For example, here is how another layout would use our layout example from earlier:

```js
// using this 'inline' template format to make it easy to see what's happening
// this could be loaded from a file too
app.layout('sidebar', {content: [
  '---',
  'layout: default',
  '---',
  '<div>',
  ' {%% body %}',
  '</div>'
].join('\n')});
```

### .engine

> Add engines for rendering templates.

```js
// render any files with a `.tmpl` extension using engine-lodash
app.engine('tmpl', require('engine-lodash'));

// render any files with a `.less` extension using engine-less
app.engine('less', require('engine-less'));
```


### .helper

> Add helpers to be used in templates.

Helpers are passed to the template engine being used at render time.

**Custom helper**

```js
app.helper('read', function(filepath) {
  return fs.readFileSync(filepath, 'utf8');
});
//=> \{{read "foo.txt"}}
```

**Register a glob of helpers**

```js
app.helpers('helpers/*.js');
```

**Pro tip**

If you want to publish your helpers and share them with the community, make them as generic as possible so they work with any template engine.


# Data

### .data

> Load data to pass to templates.

Any of these work:

```js
app.data({foo: 'bar'});
app.data('package.json');
app.data(['foo/*.{json,yml}']);
```
