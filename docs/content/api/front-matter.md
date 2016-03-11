---
title: Front matter
collection: docs
category: api
---

Assemble parses YAML front matter by default, using a built-in [middleware](./middleware.md). If you need something different, this can easily be [customized](#custom-parser) with your own middleware.

## Overview

Front matter is converted to an object and stored on `view.data`, then removed from the text prior to rendering. At render-time the `view.data` object is passed as context to the engine's `render()` function.

Here are some specifics:

- A middleware is used for parsing front-matter, powered by the [parser-front-matter][] library.
- When front-matter exists on a view (on `view.content`), it will be parsed and the resulting object will be set on on `view.data`. Also the original front-matter block is stripped from `view.content`.
- The front-matter middleware is called by the `onLoad` middleware handler, so front matter is parsed immediately after views are created.

## Custom parser

If you need something different than what the default front-matter parser provides, you can register a custom middleware with any parser you want.

**Example**

Change the regex pattern to whatever makes sense for matching your templates.

```js
app.onLoad(/\.hbs/, function(view, next) {
  // parse front matter from `view.content`
  next();
});
```

