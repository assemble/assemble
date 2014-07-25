Template engines in Assemble are used to render:

  - views:   Such as pages and partials. Views are used when generating
             web pages. The path of the layout file will be passed to the
             engine's `renderFile()` function.

  - layouts: Views used when generating web pages.  The path of the layout
             file will be passed to the engine's `renderFile()` function.

  - content: Text written in lightweight markup, which optionally has front
             matter.  Front matter will be removed from the content prior to
             rendering. `data` from front matter is merged into the context
             and passed to the engine's `render()` function.

By default Assemble will `require()` the engine based on the file extension.
For example if you try to render a "foo.hbs" file Assemble will invoke the
following internally:

```js
var engine = require('engines');
assemble.engine('hbs', engine.handlebars);
```

The module is expected to export a `.renderFile` function or, for compatibility
with Express, an `__express` function.

For engines that do not provide `.renderFile` out of the box, or if you wish
to "map" a different extension to the template engine you may use this
method. For example mapping the EJS template engine to ".html" files:

```js
assemble.engine('html', require('ejs').renderFile);
```

Additionally, template engines are used to render lightweight markup found in
content files.  For example using Textile:

```js
assemble.engine('textile', require('textile-engine'));
```

In this case, it is expected that the module export a `render` function which
will be passed content data (after removing any front matter).