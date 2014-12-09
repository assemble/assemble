# Loading templates

> Learn about the various ways to define and load templates with Assemble

There are three [built-in methods] for loading templates, but it's easy to define [custom template types] whenever you need more than the defaults.

## Built-in template types

 - [pages](#page): pages are templates that will eventually be rendered. e.g. each page has a one-to-one relationship with a destination file.
 - [partials](#partial): partials, sometimes called _includes_, can be injected into other templates.
 - [layouts](#layout): layouts are used to "wrap" other templates with common content, markup or logic.

Jump to [custom template types].

### pages

Define pages using the `.page()` or `.pages()` methods. Both will produce the same result.

**Example**

```js
var assemble = require('assemble');
```

**define a page**

```js
assemble.page('home.hbs', 'This is content');
```

**Get a stored page:**

```js
console.log(assemble.views.pages);
//=> {'home.hbs': {content: 'This is content'}}
```

**Related info**

- [rendering pages](./rendering-pages.md)


### layouts

Define layouts using the `.layout()` or `.layouts()` methods. Both will produce the same result.

**define a layout**

```js
var assemble = require('assemble');
assemble.layout('default.hbs', '<html><body>{% body %}</body></html>');
```

**Get a stored layout:**

```js
console.log(assemble.views.layouts);
//=> {'default.hbs': {content: '{% body %}'}}
```

**Related info**

- [using layouts](./using-layouts.md)


### partials

Define partials using the `.partial()` or `.partials()` methods. Both will produce the same result.

**define a partial**

```js
var assemble = require('assemble');
assemble.partial('sidebar.hbs', '<div>...</div>');
```

**Get a stored partial:**

```js
console.log(assemble.views.partials);
//=> {'sidebar.hbs': {content: '<div>...</div>'}}
```

**Related info**

- [using partials](./using-partials.md)


## Custom template types


Define partials using the `.partial()` or `.partials()` methods. Both will produce the same result.

**define a partial**

```js
var assemble = require('assemble');
assemble.partial('sidebar.hbs', '<div>...</div>');
```

**Get a stored partial:**

```js
console.log(assemble.views.partials);
//=> {'sidebar.hbs': {content: '<div>...</div>'}}
```
