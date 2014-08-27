Template engines are used to render the following types of `views`:

  - `views`: Such as pages and partials. Views are used when generating web pages. The path of the layout file will be passed to the engine's `.render()` function.
  - `layouts`: Templates used for wrapping pages. The path of the layout file will be passed to the engine's `.render()` function.
  - `content`: Text written in lightweight markup, which optionally has front matter.  Front matter will be removed from the content prior to rendering. `data` from front matter is merged into the context and passed to the options on the engine's `.render()` function.

Beyond the defaults, engines can render any custom template types.

By default Assemble will `require()` the engine based on the file extension. For example if you try to render a "foo.hbs" file Assemble will invoke the following internally:

```js
var engine = require('engines');
assemble.engine('hbs', engine.handlebars);
```

```js
assemble.engine('hbs', handlebars, {
  layouts: {
    delims: ['{{', '}}']
    defaultLayout: 'default'
  },
  helpers: {},
  partials: {},
  destExt: '.html'
});
```

Engines are expected to export a `.render()` function or, for compatibility with [Express](http://expressjs.com/), an `__express` function.

For engines that do not provide `.render()` out of the box, you can alternatively map a different file extension to the template engine that you wish to use. For instance, you could map the EJS template engine to `.html` files.

**Example:**

```js
assemble.engine('html', require('ejs').render);
```

Beyond templates, engines can be used to render lightweight markup found in content files, like [markdown](https://help.github.com/articles/markdown-basics) or [textile](http://redcloth.org/textile):

**Example:**

```js
assemble.engine('textile', require('textile-engine'));
```

In this case, it is expected that the module export a `.render()` function which will be passed content data (after removing any front matter).
