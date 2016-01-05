---
title: Engines
collection: docs
category: api
---

## Engines API

### .engine

Register the given template engine callback `fn` as `ext`.

**Example**

```js
app.engine('hbs', require('engine-handlebars'));
```

**Params**

* `ext` **{String}** File extension to use.
* `fn` **{Function|Object}**: Engine function or object with a `.render` method.
* `options` **{Object}**
* `returns` **{Object}**: Returns the assemble instance for chaining

Template engines in Assemble are used to render views. More specifically:

* `view.content`: Any text or markup language.

* `layouts` Layouts used when generating web pages.  The path of the layout file will be passed to the engine's `renderFile()` function.

By default Assemble will `require()` the engine based on the file extension.
For example if you try to render a "foo.jade" file Assemble will invoke the
following internally:

```js
app.engine('jade', require('jade'));
```

The module is expected to export a `.renderFile` function, or, for
compatibility with Express, an `__express` function.

For engines that do not provide `.renderFile` out of the box, or if you wish
to "map" a different extension to the template engine you may use this
method. For example mapping the EJS template engine to ".html" files:

```js
app.engine('html', require('ejs').renderFile);
```

Additionally, template engines are used to render lightweight markup found in
content files.  For example using Textile:

```js
app.engine('textile', require('textile-engine'));
```

In this case, it is expected that the module export a `render` function which
will be passed content data (after removing any front matter).
