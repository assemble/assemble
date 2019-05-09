---
title: Custom async helpers
description: >
  This recipe shows how to create and use custom async helpers with assemble.
category: recipes
related:
  - custom-helpers
---
**Heads up!**

It's a best practice to use sync helpers whenever possible, and use async helpers only when necessary. Sync helpers are faster, easier to debug, and are more durable than async helpers.

## Create an async helper

The following helper takes a string and converts it to all uppercase characters.

```js
app.asyncHelper('upper', function(str, options, cb) {
  // double-check to ensure you have the correct argument for the callback.
  // handlebars and other engines sometimes add arguments, like `options`
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  cb(null, str.toUpperCase());
});
```

## Usage

Async helper usage is exactly the same as sync helper usage.

**handlebars**

Usage with handlebars:

```handlebars
foo \{{upper "bar"}} baz
```

Results in:

```html
foo BAR baz
```

**Lo-Dash**

Usage with Lo-Dash templates:

```html
foo <%%= upper("bar") %> baz
```

Results in:

```html
foo BAR baz
```
