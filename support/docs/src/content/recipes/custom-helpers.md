---
title: Custom helpers
description: >
  This recipe shows how to create and use custom helpers with assemble.
category: recipes
related:
  - custom-async-helpers
---

## Create a helper

The following helper takes a string and converts it to all uppercase characters.

```js
app.helper('upper', function(str) {
  return str.toUpperCase();
});
```

## Usage

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
