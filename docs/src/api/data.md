---
title: Data
collection: docs
category: api
description: >
  Load data to be passed as context to templates at render time.
---

## Site-wide data

Set a site-wide `title` to be used on all "pages" or "posts":

```js
app.data({
  site: {
    title: 'Blog'
  }
});
```

Load data from a filepath:

```js
app.data('package.json');
```

## options.namespace

_(TODO: namespace option/method for data)_

For more complex data needs, like working with i18n data, you can pass a function to `app.options.namespace` to customize how data properties are define:

```js
app.option('namespace', function(filepath, options) {

});
```
