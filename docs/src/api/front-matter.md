---
title: Front matter
---

Assemble parses YAML front matter by default, using a built-in [middleware](./middleware.md). If you need something different, this can easily be [customized](#custom-parser) with your own middleware.

## Overview

- When front-matter exists, it will be parsed by the and the resulting object is loaded onto `view.data`.
- The front-matter middleware is powered by the [parser-front-matter][] library.
- The front-matter middleware is called by the `onLoad` middleware handler, so front matter is parsed immediately after views are created.

Front matter is converted to an object and stored on `view.data`, then removed from the text prior to rendering. At render-time the `view.data` object is passed as context to the engine's `render()` function.


## Custom parser

If you need something different than what the default front-matter parser provides, you can register your own 